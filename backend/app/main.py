from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.database import Base, engine
from app.models import (
    User,
    Product,
    Sale,
    Supplier,
    PurchaseOrder,
    PurchaseOrderItem,
    Customer,
)
from app.routes import router
from app.sales_routes import router as sales_router
import sqlite3
from fastapi import HTTPException
from app.models import Customer

# 1. Create the app FIRST
app = FastAPI(
    title="Smart Inventory Management API",
    version="1.0.0"
)

# 2. Create DB tables
Base.metadata.create_all(bind=engine)

# 3. Middleware
origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 4. Static files
app.mount(
    "/uploads",
    StaticFiles(directory="uploads"),
    name="uploads"
)

# 5. Routers (only once each)
app.include_router(router)
app.include_router(sales_router)


@app.get("/")
def home():
    return {"message": "Welcome to Smart Inventory Management API"}


@app.get("/health")
def health():
    return {"status": "Server is running successfully!"}


def restock_product(product_id: int, quantity: int):
    conn = sqlite3.connect("inventory.db")
    cursor = conn.cursor()

    cursor.execute(
        "SELECT quantity FROM products WHERE id=?",
        (product_id,)
    )

    product = cursor.fetchone()

    if not product:
        conn.close()
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    new_quantity = product[0] + quantity

    cursor.execute(
        """
        UPDATE products
        SET quantity=?
        WHERE id=?
        """,
        (new_quantity, product_id),
    )

    conn.commit()
    conn.close()

    return {
        "message": "Stock updated successfully",
        "new_quantity": new_quantity,
    }