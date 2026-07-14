from pydantic import BaseModel


class SaleCreate(BaseModel):
    product_id: int
    quantity: int


class SaleResponse(BaseModel):
    id: int
    product_id: int
    product_name: str
    quantity: int
    unit_price: float
    total_price: float

    class Config:
        from_attributes = True