from fastapi import APIRouter, Depends, Header, HTTPException, UploadFile, File
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
import shutil
import os
import io
from openpyxl import load_workbook, Workbook
from fastapi import UploadFile, File

from app.database import get_db
from app.models import User, Product
from app.schemas import (
    UserCreate,
    LoginRequest,
    ProductCreate,
    ProductUpdate,
    ProductResponse,
)

from app.auth import (
    hash_password,
    verify_password,
    create_access_token,
    verify_token,
)

router = APIRouter()

# ----------------------------
# Get Current User
# ----------------------------
@router.get("/me")
def get_current_user(
    authorization: str = Header(None),
    db: Session = Depends(get_db),
):
    if authorization is None:
        raise HTTPException(
            status_code=401,
            detail="Authorization header missing",
        )

    if not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=401,
            detail="Invalid token format",
        )

    token = authorization.split(" ", 1)[1]
    email = verify_token(token)

    if email is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token",
        )

    user = db.query(User).filter(User.email == email).first()

    if user is None:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )

    return {
        "id": user.id,
        "full_name": user.full_name,
        "email": user.email,
        "role": user.role,
    }


# ----------------------------
# Register
# ----------------------------
@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):

    existing_user = db.query(User).filter(User.email == user.email).first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered",
        )

    new_user = User(
        full_name=user.full_name,
        email=user.email,
        password=hash_password(user.password),
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message": "User registered successfully!"
    }


# ----------------------------
# Login
# ----------------------------
@router.post("/login")
def login(user: LoginRequest, db: Session = Depends(get_db)):

    db_user = db.query(User).filter(User.email == user.email).first()

    if db_user is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password",
        )

    if not verify_password(user.password, db_user.password):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password",
        )

    access_token = create_access_token(
        data={"sub": db_user.email}
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
    }


# ----------------------------
# Upload Image
# ----------------------------
@router.post("/upload-image")
def upload_image(file: UploadFile = File(...)):

    upload_folder = "uploads"

    if not os.path.exists(upload_folder):
        os.makedirs(upload_folder)

    # Sanitize filename to avoid path traversal
    safe_filename = os.path.basename(file.filename)
    file_path = os.path.join(upload_folder, safe_filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return {
        "filename": safe_filename,
        "url": f"/uploads/{safe_filename}",
    }


# ----------------------------
# Add Product
# ----------------------------
@router.post("/products", response_model=ProductResponse)
def add_product(
    product: ProductCreate,
    db: Session = Depends(get_db),
):

    new_product = Product(
        name=product.name,
        description=product.description,
        category=product.category,
        price=product.price,
        quantity=product.quantity,
        image=product.image,
    )

    db.add(new_product)
    db.commit()
    db.refresh(new_product)

    return new_product


# ----------------------------
# Get Products
# ----------------------------
@router.get("/products", response_model=list[ProductResponse])
def get_products(db: Session = Depends(get_db)):

    return db.query(Product).all()


# ----------------------------
# Dashboard
# ----------------------------
from app.models import Product, Sale

@router.get("/dashboard")
def dashboard(db: Session = Depends(get_db)):

    products = db.query(Product).all()
    sales = db.query(Sale).all()

    total_products = len(products)

    inventory_value = sum(
        product.price * product.quantity
        for product in products
    )

    low_stock = len([
        product
        for product in products
        if product.quantity < 10
    ])

    total_sales = len(sales)

    revenue = sum(
        sale.total_price
        for sale in sales
    )

    return {
        "totalProducts": total_products,
        "inventoryValue": inventory_value,
        "lowStock": low_stock,
        "totalSales": total_sales,
        "revenue": revenue,
    }

# ----------------------------
# Dashboard Charts
# ----------------------------
@router.get("/dashboard/charts")
def dashboard_charts(db: Session = Depends(get_db)):

    products = db.query(Product).all()

    labels = []
    stock = []

    category_count = {}

    for product in products:
        labels.append(product.name)
        stock.append(product.quantity)

        if product.category in category_count:
            category_count[product.category] += 1
        else:
            category_count[product.category] = 1

    return {
        "labels": labels,
        "stock": stock,
        "categories": category_count
    }

# ----------------------------
# Update Product
# ----------------------------
@router.put("/products/{product_id}", response_model=ProductResponse)
def update_product(
    product_id: int,
    product: ProductUpdate,
    db: Session = Depends(get_db)
):

    db_product = db.query(Product).filter(Product.id == product_id).first()

    if db_product is None:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    db_product.name = product.name
    db_product.description = product.description
    db_product.category = product.category
    db_product.price = product.price
    db_product.quantity = product.quantity
    db_product.image = product.image

    db.commit()
    db.refresh(db_product)

    return db_product


# ----------------------------
# Delete Product
# ----------------------------
@router.delete("/products/{product_id}")
def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
):

    product = (
        db.query(Product)
        .filter(Product.id == product_id)
        .first()
    )

    if product is None:
        raise HTTPException(
            status_code=404,
            detail="Product not found",
        )

    db.delete(product)
    db.commit()

    return {
        "message": "Product deleted successfully"
    }

# ----------------------------
# Import Products From Excel
# ----------------------------
@router.post("/import-products")
def import_products(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    try:
        workbook = load_workbook(file.file)
    except Exception:
        raise HTTPException(
            status_code=400,
            detail="Invalid Excel file. Please upload a valid .xlsx file.",
        )

    sheet = workbook.active
    rows = list(sheet.iter_rows(values_only=True))

    imported_count = 0
    errors = []

    # Skip Header Row
    # Expected columns: name, description, category, price, quantity
    for index, row in enumerate(rows[1:], start=2):
        try:
            name = row[0]
            description = row[1]
            category = row[2]
            price = row[3]
            quantity = row[4]

            if name is None:
                errors.append(f"Row {index}: missing name, skipped")
                continue

            new_product = Product(
                name=name,
                description=description,
                category=category,
                price=float(price) if price is not None else 0.0,
                quantity=int(quantity) if quantity is not None else 0,
            )

            db.add(new_product)
            imported_count += 1

        except (ValueError, TypeError, IndexError) as e:
            errors.append(f"Row {index}: {str(e)}")
            continue

    db.commit()

    return {
        "message": f"Imported {imported_count} products successfully!",
        "errors": errors,
    }


# ----------------------------
# Export Products To Excel
# ----------------------------
@router.get("/export-products")
def export_products(db: Session = Depends(get_db)):

    products = db.query(Product).all()

    workbook = Workbook()
    sheet = workbook.active
    sheet.title = "Products"

    # Header row
    sheet.append(["ID", "Name", "Description", "Category", "Price", "Quantity"])

    for product in products:
        sheet.append([
            product.id,
            product.name,
            product.description,
            product.category,
            product.price,
            product.quantity,
        ])

    stream = io.BytesIO()
    workbook.save(stream)
    stream.seek(0)

    headers = {
        "Content-Disposition": "attachment; filename=products.xlsx"
    }

    return StreamingResponse(
        stream,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers=headers,
    )