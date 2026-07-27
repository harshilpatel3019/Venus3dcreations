"""Seed products from the Venus 3D Creations catalogue.
Safe to call multiple times — will only insert if collection is empty.
"""
import os
import logging
from typing import List

logger = logging.getLogger(__name__)

BACKEND_URL = os.environ.get("FRONTEND_URL", "").rstrip("/")  # backend & frontend on same host in dev

# Images extracted from the PDF live in /app/backend/static/products/
# The order in the catalogue matches PDF image extraction order (pdfimages puts them roughly in order).
STATIC_BASE = "/api/static/products"

SEED_LAMPS = [
    {
        "name": "Wavy Lamp",
        "slug": "wavy-lamp",
        "category": "lamps",
        "series": "Signature Series · N° 01",
        "price": 1899,
        "description": "Embrace the fluid lines and sculptural forms of our Wavy table lamp. This piece offers a blend of artistic expression and functional design — perfect for adding a touch of modern elegance to any space.",
        "material": "Matte PLA · Warm LED",
        "dimensions": "18 × 18 × 30 cm",
        "lead_time": "Ships in 3–5 days",
        "tag": "Best Seller",
        "images": [f"{STATIC_BASE}/lamp-000.jpg"],
        "featured": True,
    },
    {
        "name": "Spectra Lamp",
        "slug": "spectra-lamp",
        "category": "lamps",
        "series": "Ambient Series · N° 02",
        "price": 2099,
        "description": "The Spectra lamp illuminates with soft lighting that creates a calming atmosphere. Delicate cut-outs allow the light from within to emanate, casting a warm and inviting glow that turns any room into a sanctuary at dusk.",
        "material": "Silk PLA · Warm LED",
        "dimensions": "20 × 20 × 32 cm",
        "lead_time": "Ships in 3–5 days",
        "tag": "New",
        "images": [f"{STATIC_BASE}/lamp-001.jpg"],
        "featured": True,
    },
    {
        "name": "Nova Lamp",
        "slug": "nova-lamp",
        "category": "lamps",
        "series": "Modern Series · N° 03",
        "price": 2599,
        "description": "The Nova lamp offers a sleek and modern lighting solution. With its clean lines, it is perfect for desks, bedside tables, bedrooms, or any space where focused light is needed. Both stylish and practical — it enhances every environment with its subtle glow.",
        "material": "Matte PLA · Dimmable LED",
        "dimensions": "18 × 18 × 34 cm",
        "lead_time": "Ships in 3–5 days",
        "images": [f"{STATIC_BASE}/lamp-002.jpg"],
        "featured": True,
    },
    {
        "name": "Cargo Lamp",
        "slug": "cargo-lamp",
        "category": "lamps",
        "series": "Statement Series · N° 04",
        "price": 3699,
        "description": "This table lamp features a distinctive base design, blending modern minimalism with artistic flair. Its unique form adds a touch of elegance and creativity to any space — making it perfect for those who appreciate one-of-a-kind statement pieces.",
        "material": "Reinforced PLA · Warm LED",
        "dimensions": "22 × 22 × 38 cm",
        "lead_time": "Ships in 5–7 days",
        "tag": "Limited",
        "images": [f"{STATIC_BASE}/lamp-003.jpg"],
        "featured": True,
    },
    {
        "name": "Retro Lamp",
        "slug": "retro-lamp",
        "category": "lamps",
        "series": "Classic Series · N° 05",
        "price": 2599,
        "description": "With its black base and classic white shade, this table lamp exudes calm and sophistication. Designed to complement both modern and traditional décor, it offers a gentle illumination that enhances the ambiance of any room.",
        "material": "Matte PLA · Fabric shade",
        "dimensions": "20 × 20 × 40 cm",
        "lead_time": "Ships in 3–5 days",
        "images": [f"{STATIC_BASE}/lamp-004.jpg"],
    },
    {
        "name": "Small Table Lamp",
        "slug": "small-table-lamp",
        "category": "lamps",
        "series": "Petite Series · N° 06",
        "price": 1299,
        "description": "Elevate your home with this elegant small table lamp, designed to create a calm and inviting atmosphere. The softly textured lampshade casts a warm, gentle light — perfect for bedrooms, living rooms, study corners, or bedside tables. Its compact size suits small spaces, while the tripod-style base gives it a stylish, handcrafted look.",
        "material": "Textured PLA · Warm LED",
        "dimensions": "14 × 14 × 22 cm",
        "lead_time": "Ships in 3–5 days",
        "tag": "Best Seller",
        "images": [f"{STATIC_BASE}/lamp-005.jpg"],
    },
    {
        "name": "Crumpled Lamp",
        "slug": "crumpled-lamp",
        "category": "lamps",
        "series": "Organic Series · N° 07",
        "price": 2099,
        "description": "This compact table lamp brings together modern minimalism and handmade charm. The textured shade diffuses light gently, creating a warm and inviting mood that works beautifully on bedside tables, side tables, shelves, and accent corners. Its unique crumpled silhouette gives it a soft, organic feel that stands out — even when the lamp is turned off.",
        "material": "Textured PLA · Warm LED",
        "dimensions": "16 × 16 × 26 cm",
        "lead_time": "Ships in 3–5 days",
        "tag": "New",
        "images": [f"{STATIC_BASE}/lamp-006.jpg"],
    },
]


async def seed_products(db):
    count = await db.products.count_documents({})
    if count > 0:
        logger.info(f"Products already seeded ({count}). Skipping.")
        return
    from models import Product
    for p in SEED_LAMPS:
        product = Product(**p)
        await db.products.insert_one(product.model_dump())
    logger.info(f"Seeded {len(SEED_LAMPS)} products.")


async def ensure_admin(db):
    from models import User
    from auth import hash_password
    admin_email = os.environ.get("ADMIN_EMAIL", "venus3dcreations@gmail.com")
    existing = await db.users.find_one({"email": admin_email})
    if existing:
        # ensure role is admin
        if existing.get("role") != "admin":
            await db.users.update_one({"_id": existing["_id"]}, {"$set": {"role": "admin"}})
            logger.info(f"Promoted {admin_email} to admin.")
        return
    admin = User(email=admin_email, name="Venus Studio", role="admin", provider="email")
    doc = admin.model_dump()
    doc["password_hash"] = hash_password("venus@admin2025")  # default; change from admin UI
    await db.users.insert_one(doc)
    logger.info(f"Created default admin: {admin_email} / venus@admin2025")
