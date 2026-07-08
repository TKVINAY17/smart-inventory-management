from fastapi import APIRouter, Depends, Header, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
import shutil
import os

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

    file_path = os.path.join(upload_folder, file.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return {
        "filename": file.filename,
        "url": f"/uploads/{file.filename}",
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
@router.get("/dashboard")
def dashboard(db: Session = Depends(get_db)):

    products = db.query(Product).all()

    total_products = len(products)

    inventory_value = 0
    low_stock = 0

    for product in products:
        price = product.price if product.price else 0
        quantity = product.quantity if product.quantity else 0

        inventory_value += price * quantity

        if quantity < 10:
            low_stock += 1

    return {
        "totalProducts": total_products,
        "inventoryValue": inventory_value,
        "lowStock": low_stock,
    }


# ----------------------------
# Update Product
# ----------------------------
@router.put("/products/{product_id}", response_model=ProductResponse)
def update_product(
    product_id: int,
    product: ProductUpdate,
    db: Session = Depends(get_db),
):

    db_product = (
        db.query(Product)
        .filter(Product.id == product_id)
        .first()
    )

    if db_product is None:
        raise HTTPException(
            status_code=404,
            detail="Product not found",
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