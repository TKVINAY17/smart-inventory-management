from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError

from app.database import get_db
from app.models import Product, Sale
from app.sales_schemas import SaleCreate, SaleResponse

router = APIRouter(
    prefix="/sales",
    tags=["Sales"]
)


# -------------------------
# Create Sale
# -------------------------
@router.post("/", response_model=SaleResponse)
def create_sale(
    sale: SaleCreate,
    db: Session = Depends(get_db)
):

    if sale.quantity <= 0:
        raise HTTPException(
            status_code=400,
            detail="Quantity must be greater than zero"
        )

    product = db.query(Product).filter(
        Product.id == sale.product_id
    ).first()

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    if product.quantity < sale.quantity:
        raise HTTPException(
            status_code=400,
            detail="Insufficient stock"
        )

    total = product.price * sale.quantity

    new_sale = Sale(
        product_id=product.id,
        product_name=product.name,
        quantity=sale.quantity,
        unit_price=product.price,
        total_price=total,
    )

    product.quantity -= sale.quantity

    try:
        db.add(new_sale)
        db.commit()
        db.refresh(new_sale)

    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

    return new_sale


# -------------------------
# Get All Sales
# -------------------------
@router.get("/", response_model=list[SaleResponse])
def get_sales(db: Session = Depends(get_db)):
    return db.query(Sale).order_by(Sale.id.desc()).all()