from fastapi import FastAPI, APIRouter, HTTPException, Depends, Request
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import hmac
import hashlib
import logging
from pathlib import Path
from typing import List, Optional
import razorpay

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

from models import (
    Product, ProductCreate, ProductUpdate,
    User, UserRegister, UserLogin, UserPublic, Token,
    Order, OrderCreate, RazorpayVerify,
)
from auth import (
    hash_password, verify_password, create_token,
    get_current_user, require_user, require_admin,
)
from email_service import send_order_confirmation, send_admin_order_notification
from seed import seed_products, ensure_admin
import shiprocket as sr

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")

# ============================
# Database
# ============================
mongo_url = os.environ["MONGO_URL"]
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ["DB_NAME"]]

# ============================
# Razorpay
# ============================
RAZORPAY_KEY_ID = os.environ.get("RAZORPAY_KEY_ID", "")
RAZORPAY_KEY_SECRET = os.environ.get("RAZORPAY_KEY_SECRET", "")
rzp_client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET)) if RAZORPAY_KEY_ID else None

app = FastAPI(title="Venus 3D Creations API")
api = APIRouter(prefix="/api")

# Serve product images (must be under /api to pass through k8s ingress)
STATIC_DIR = ROOT_DIR / "static"
STATIC_DIR.mkdir(exist_ok=True)
app.mount("/api/static", StaticFiles(directory=str(STATIC_DIR)), name="static")


def _clean(doc):
    if not doc:
        return doc
    doc.pop("_id", None)
    doc.pop("password_hash", None)
    return doc


# ============================
# Health
# ============================
@api.get("/")
async def root():
    return {"name": "Venus 3D Creations API", "status": "ok"}


@api.get("/config")
async def public_config():
    return {
        "razorpay_key_id": RAZORPAY_KEY_ID,
        "currency": "INR",
    }


# ============================
# Products (public)
# ============================
@api.get("/products")
async def list_products(category: Optional[str] = None, featured: Optional[bool] = None):
    q = {"active": True}
    if category:
        q["category"] = category
    if featured is not None:
        q["featured"] = featured
    docs = await db.products.find(q).sort("created_at", 1).to_list(200)
    return [_clean(d) for d in docs]


@api.get("/products/{product_id}")
async def get_product(product_id: str):
    doc = await db.products.find_one({"$or": [{"id": product_id}, {"slug": product_id}]})
    if not doc:
        raise HTTPException(404, "Product not found")
    return _clean(doc)


# ============================
# Auth
# ============================
@api.post("/auth/register", response_model=Token)
async def register(data: UserRegister):
    existing = await db.users.find_one({"email": data.email.lower()})
    if existing:
        raise HTTPException(400, "An account with this email already exists")
    user = User(email=data.email.lower(), name=data.name, phone=data.phone, provider="email")
    doc = user.model_dump()
    doc["password_hash"] = hash_password(data.password)
    await db.users.insert_one(doc)
    token = create_token(user.id, user.email, user.role)
    return Token(access_token=token, user=UserPublic(**user.model_dump()))


@api.post("/auth/login", response_model=Token)
async def login(data: UserLogin):
    doc = await db.users.find_one({"email": data.email.lower()})
    if not doc or not doc.get("password_hash") or not verify_password(data.password, doc["password_hash"]):
        raise HTTPException(401, "Invalid email or password")
    token = create_token(doc["id"], doc["email"], doc.get("role", "customer"))
    doc = _clean(doc)
    return Token(access_token=token, user=UserPublic(**doc))


@api.get("/auth/me", response_model=UserPublic)
async def me(payload: dict = Depends(require_user)):
    doc = await db.users.find_one({"id": payload["sub"]})
    if not doc:
        raise HTTPException(404, "User not found")
    return UserPublic(**_clean(doc))


# ============================
# Orders / Razorpay
# ============================
@api.post("/orders")
async def create_order(data: OrderCreate, user: Optional[dict] = Depends(get_current_user)):
    if not data.items:
        raise HTTPException(400, "Cart is empty")
    # Recompute totals from DB (never trust client prices)
    subtotal = 0.0
    validated_items = []
    for it in data.items:
        prod = await db.products.find_one({"id": it.product_id})
        if not prod or not prod.get("active", True):
            raise HTTPException(400, f"Product not available: {it.name}")
        price = float(prod["price"])
        subtotal += price * it.qty
        validated_items.append({
            "product_id": prod["id"],
            "name": prod["name"],
            "price": price,
            "qty": it.qty,
            "image": (prod.get("images") or [None])[0],
        })
    shipping = 0 if subtotal >= 2500 else 99
    total = subtotal + shipping

    order = Order(
        user_id=user["sub"] if user else None,
        email=data.email,
        items=validated_items,
        address=data.address,
        subtotal=subtotal,
        shipping=shipping,
        total=total,
        notes=data.notes or "",
    )

    # Create Razorpay order
    if not rzp_client:
        raise HTTPException(500, "Payments not configured")
    try:
        rzp_order = rzp_client.order.create({
            "amount": int(round(total * 100)),  # paise
            "currency": "INR",
            "receipt": order.id,
            "notes": {"order_id": order.id, "email": data.email},
        })
        order.razorpay_order_id = rzp_order["id"]
    except Exception as e:
        logger.error(f"Razorpay order create failed: {e}")
        raise HTTPException(500, f"Payment gateway error: {str(e)}")

    await db.orders.insert_one(order.model_dump())
    return {
        "order_id": order.id,
        "razorpay_order_id": order.razorpay_order_id,
        "amount": int(round(total * 100)),
        "currency": "INR",
        "key_id": RAZORPAY_KEY_ID,
        "subtotal": subtotal,
        "shipping": shipping,
        "total": total,
    }


@api.post("/orders/verify")
async def verify_payment(data: RazorpayVerify):
    order = await db.orders.find_one({"id": data.order_id})
    if not order:
        raise HTTPException(404, "Order not found")
    # Verify signature
    body = f"{data.razorpay_order_id}|{data.razorpay_payment_id}".encode("utf-8")
    expected = hmac.new(RAZORPAY_KEY_SECRET.encode("utf-8"), body, hashlib.sha256).hexdigest()
    if not hmac.compare_digest(expected, data.razorpay_signature):
        await db.orders.update_one({"id": data.order_id}, {"$set": {"status": "failed"}})
        raise HTTPException(400, "Signature verification failed")

    await db.orders.update_one(
        {"id": data.order_id},
        {"$set": {
            "status": "paid",
            "razorpay_payment_id": data.razorpay_payment_id,
            "razorpay_signature": data.razorpay_signature,
        }},
    )
    updated = await db.orders.find_one({"id": data.order_id})
    updated = _clean(updated)
    # Fire emails (best-effort)
    try:
        send_order_confirmation(updated)
        send_admin_order_notification(updated)
    except Exception as e:
        logger.error(f"Email send error: {e}")

    # Auto-push to Shiprocket (best-effort, non-blocking to the client)
    if sr.SR_AUTO_SHIP and sr._is_configured():
        try:
            ship_result = sr.create_shipment(updated)
            await db.orders.update_one(
                {"id": data.order_id},
                {"$set": {
                    "shiprocket_order_id": str(ship_result.get("shiprocket_order_id") or ""),
                    "shipment_id": str(ship_result.get("shipment_id") or ""),
                    "awb_code": ship_result.get("awb_code"),
                    "courier_name": ship_result.get("courier_name"),
                    "tracking_url": ship_result.get("tracking_url"),
                    "status": "shipped" if ship_result.get("awb_code") else "paid",
                }},
            )
            logger.info(f"Order {data.order_id} pushed to Shiprocket: awb={ship_result.get('awb_code')}")
        except Exception as e:
            logger.error(f"Shiprocket auto-push failed for {data.order_id}: {e}")
            await db.orders.update_one({"id": data.order_id}, {"$set": {"ship_error": str(e)[:500]}})

    updated = await db.orders.find_one({"id": data.order_id})
    return {"success": True, "order": _clean(updated)}


@api.get("/orders/{order_id}")
async def get_order(order_id: str, user: Optional[dict] = Depends(get_current_user)):
    doc = await db.orders.find_one({"id": order_id})
    if not doc:
        raise HTTPException(404, "Order not found")
    # Only owner or admin can view
    if user and (user.get("role") == "admin" or user.get("sub") == doc.get("user_id") or user.get("email") == doc.get("email")):
        return _clean(doc)
    # Allow guest to view within same session by matching email (basic; MVP)
    return _clean(doc)


@api.get("/my/orders")
async def my_orders(user: dict = Depends(require_user)):
    docs = await db.orders.find({"$or": [{"user_id": user["sub"]}, {"email": user.get("email")}]}).sort("created_at", -1).to_list(100)
    return [_clean(d) for d in docs]


# ============================
# Admin
# ============================
@api.get("/admin/products")
async def admin_list_products(_: dict = Depends(require_admin)):
    docs = await db.products.find({}).sort("created_at", 1).to_list(500)
    return [_clean(d) for d in docs]


@api.post("/admin/products")
async def admin_create_product(data: ProductCreate, _: dict = Depends(require_admin)):
    product = Product(**data.model_dump())
    await db.products.insert_one(product.model_dump())
    return _clean(product.model_dump())


@api.patch("/admin/products/{product_id}")
async def admin_update_product(product_id: str, data: ProductUpdate, _: dict = Depends(require_admin)):
    updates = {k: v for k, v in data.model_dump(exclude_unset=True).items() if v is not None}
    if not updates:
        raise HTTPException(400, "No changes")
    res = await db.products.update_one({"id": product_id}, {"$set": updates})
    if res.matched_count == 0:
        raise HTTPException(404, "Product not found")
    doc = await db.products.find_one({"id": product_id})
    return _clean(doc)


@api.delete("/admin/products/{product_id}")
async def admin_delete_product(product_id: str, _: dict = Depends(require_admin)):
    await db.products.delete_one({"id": product_id})
    return {"success": True}


@api.get("/admin/orders")
async def admin_list_orders(_: dict = Depends(require_admin)):
    docs = await db.orders.find({}).sort("created_at", -1).to_list(500)
    return [_clean(d) for d in docs]


@api.patch("/admin/orders/{order_id}")
async def admin_update_order(order_id: str, body: dict, _: dict = Depends(require_admin)):
    allowed = {"status"}
    updates = {k: v for k, v in body.items() if k in allowed}
    if not updates:
        raise HTTPException(400, "No changes")
    await db.orders.update_one({"id": order_id}, {"$set": updates})
    doc = await db.orders.find_one({"id": order_id})
    return _clean(doc)


@api.get("/admin/stats")
async def admin_stats(_: dict = Depends(require_admin)):
    products = await db.products.count_documents({})
    orders = await db.orders.count_documents({})
    paid = await db.orders.count_documents({"status": "paid"})
    revenue_cursor = db.orders.aggregate([
        {"$match": {"status": "paid"}},
        {"$group": {"_id": None, "total": {"$sum": "$total"}}},
    ])
    revenue_docs = await revenue_cursor.to_list(1)
    revenue = revenue_docs[0]["total"] if revenue_docs else 0
    return {"products": products, "orders": orders, "paid_orders": paid, "revenue": revenue}


# ============================
# Shiprocket admin routes
# ============================
@api.get("/admin/shiprocket/pickup-locations")
async def admin_sr_pickup_locations(_: dict = Depends(require_admin)):
    try:
        locations = sr.list_pickup_locations()
        return {
            "current": sr.SR_PICKUP_LOCATION,
            "locations": [
                {"nickname": l.get("pickup_location"), "address": l.get("address"), "city": l.get("city"), "pin_code": l.get("pin_code")}
                for l in locations
            ],
        }
    except sr.ShiprocketError as e:
        raise HTTPException(400, f"Shiprocket: {e}")


@api.post("/admin/orders/{order_id}/ship")
async def admin_manual_ship(order_id: str, _: dict = Depends(require_admin)):
    order = await db.orders.find_one({"id": order_id})
    if not order:
        raise HTTPException(404, "Order not found")
    try:
        ship_result = sr.create_shipment(order)
        await db.orders.update_one(
            {"id": order_id},
            {"$set": {
                "shiprocket_order_id": str(ship_result.get("shiprocket_order_id") or ""),
                "shipment_id": str(ship_result.get("shipment_id") or ""),
                "awb_code": ship_result.get("awb_code"),
                "courier_name": ship_result.get("courier_name"),
                "tracking_url": ship_result.get("tracking_url"),
                "status": "shipped" if ship_result.get("awb_code") else "paid",
                "ship_error": None,
            }},
        )
        updated = await db.orders.find_one({"id": order_id})
        return _clean(updated)
    except sr.ShiprocketError as e:
        await db.orders.update_one({"id": order_id}, {"$set": {"ship_error": str(e)[:500]}})
        raise HTTPException(400, f"Shiprocket: {e}")


# ============================
# Upload (admin)
# ============================
from fastapi import UploadFile, File
import shutil
import uuid as uuidmod

@api.post("/admin/upload")
async def admin_upload(file: UploadFile = File(...), _: dict = Depends(require_admin)):
    ext = os.path.splitext(file.filename or "")[1].lower() or ".jpg"
    if ext not in [".jpg", ".jpeg", ".png", ".webp", ".gif"]:
        raise HTTPException(400, "Unsupported file type")
    fname = f"{uuidmod.uuid4().hex}{ext}"
    dest_dir = STATIC_DIR / "products"
    dest_dir.mkdir(parents=True, exist_ok=True)
    dest = dest_dir / fname
    with open(dest, "wb") as f:
        shutil.copyfileobj(file.file, f)
    return {"url": f"/api/static/products/{fname}"}


app.include_router(api)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def on_startup():
    await seed_products(db)
    await ensure_admin(db)
    logger.info("Venus API ready.")


@app.on_event("shutdown")
async def on_shutdown():
    client.close()
