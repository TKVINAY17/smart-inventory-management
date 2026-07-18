from pydantic import BaseModel, EmailStr


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