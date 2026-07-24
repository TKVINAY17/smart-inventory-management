from pydantic import BaseModel, EmailStr
from typing import Optional


# ----------------------------
# Register
# ----------------------------

class UserCreate(BaseModel):
    full_name: str
    email: EmailStr
    password: str


# ----------------------------
# User Response
# ----------------------------

class UserResponse(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    role: str

    class Config:
        from_attributes = True


# ----------------------------
# Login
# ----------------------------

class LoginRequest(BaseModel):
    email: EmailStr
    password: str


# ----------------------------
# JWT Token Response
# ----------------------------

class Token(BaseModel):
    access_token: str
    token_type: str


# ----------------------------
# Product Create
# ----------------------------

class ProductCreate(BaseModel):
    name: str
    description: str
    category: str
    price: float
    quantity: int
    image: str | None = None


# ----------------------------
# Product Response
# ----------------------------

class ProductResponse(BaseModel):
    id: int
    name: str
    description: str
    category: str
    price: float
    quantity: int
    image: str | None = None

    class Config:
        from_attributes = True


# ----------------------------
# Product Update
# ----------------------------

class ProductUpdate(BaseModel):
    name: str
    description: str
    category: str
    price: float
    quantity: int
    image: str | None = None


# ----------------------------
# Supplier Create
# ----------------------------

class SupplierCreate(BaseModel):
    company_name: str
    contact_person: str
    email: str
    phone: str
    address: str
    gst_number: str


# ----------------------------
# Supplier Response
# ----------------------------

class SupplierResponse(SupplierCreate):
    id: int

    class Config:
        from_attributes = True
        
# Purchase Order Item Create
# ----------------------------

class PurchaseOrderItemCreate(BaseModel):
    product_id: int
    product_name: str
    quantity: int
    unit_price: float


# ----------------------------
# Purchase Order Item Response
# ----------------------------

class PurchaseOrderItemResponse(PurchaseOrderItemCreate):
    id: int
    total_price: float

    class Config:
        from_attributes = True


# ----------------------------
# Purchase Order Create
# ----------------------------

class PurchaseOrderCreate(BaseModel):
    supplier_id: int
    supplier_name: str
    items: list[PurchaseOrderItemCreate]


# ----------------------------
# Purchase Order Response
# ----------------------------

class PurchaseOrderResponse(BaseModel):
    id: int
    po_number: str
    supplier_id: int
    supplier_name: str
    status: str
    total_amount: float

    class Config:
        from_attributes = True

    


class CustomerBase(BaseModel):
    name: str
    phone: str
    email: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    gst_number: Optional[str] = None


class CustomerCreate(CustomerBase):
    pass


class CustomerUpdate(CustomerBase):
    pass


class Customer(CustomerBase):
    id: int

    class Config:
        from_attributes = True



    class Config:
        from_attributes = True





class CustomerCreate(CustomerBase):
    pass


class CustomerUpdate(CustomerBase):
    pass


class Customer(CustomerBase):
    id: int

    class Config:
        from_attributes = True