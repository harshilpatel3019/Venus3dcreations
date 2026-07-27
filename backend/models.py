from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
from datetime import datetime
import uuid


def new_id() -> str:
    return str(uuid.uuid4())


# =========================
# Products
# =========================
class ProductBase(BaseModel):
    name: str
    slug: str
    category: str  # lamps, handbags, sculptures, decor, custom
    price: float  # in INR
    description: str
    material: Optional[str] = ""
    dimensions: Optional[str] = ""
    lead_time: Optional[str] = "Ships in 3-5 days"
    tag: Optional[str] = None  # New, Best Seller, Limited
    series: Optional[str] = None
    images: List[str] = []
    stock: int = 100
    active: bool = True
    featured: bool = False


class Product(ProductBase):
    id: str = Field(default_factory=new_id)
    created_at: datetime = Field(default_factory=datetime.utcnow)


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    category: Optional[str] = None
    price: Optional[float] = None
    description: Optional[str] = None
    material: Optional[str] = None
    dimensions: Optional[str] = None
    lead_time: Optional[str] = None
    tag: Optional[str] = None
    series: Optional[str] = None
    images: Optional[List[str]] = None
    stock: Optional[int] = None
    active: Optional[bool] = None
    featured: Optional[bool] = None


# =========================
# Users
# =========================
class UserBase(BaseModel):
    email: EmailStr
    name: str
    phone: Optional[str] = None


class User(UserBase):
    id: str = Field(default_factory=new_id)
    role: str = "customer"  # customer, admin
    provider: str = "email"  # email, google
    created_at: datetime = Field(default_factory=datetime.utcnow)


class UserRegister(UserBase):
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserPublic(UserBase):
    id: str
    role: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserPublic


# =========================
# Orders
# =========================
class Address(BaseModel):
    full_name: str
    phone: str
    line1: str
    line2: Optional[str] = ""
    city: str
    state: str
    pincode: str
    country: str = "India"


class OrderItem(BaseModel):
    product_id: str
    name: str
    price: float
    qty: int
    image: Optional[str] = None


class OrderCreate(BaseModel):
    items: List[OrderItem]
    address: Address
    email: EmailStr
    notes: Optional[str] = ""


class Order(BaseModel):
    id: str = Field(default_factory=new_id)
    user_id: Optional[str] = None
    email: EmailStr
    items: List[OrderItem]
    address: Address
    subtotal: float
    shipping: float = 0
    total: float
    currency: str = "INR"
    status: str = "created"  # created, paid, failed, shipped, delivered, cancelled
    razorpay_order_id: Optional[str] = None
    razorpay_payment_id: Optional[str] = None
    razorpay_signature: Optional[str] = None
    notes: Optional[str] = ""
    created_at: datetime = Field(default_factory=datetime.utcnow)


class RazorpayVerify(BaseModel):
    order_id: str  # our order id
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str
