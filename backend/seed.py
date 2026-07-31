"""Seed & migrate products for Venus 3D Creations.
Runs on every startup — safe to call multiple times.
- Seeds initial 9 lamps if the collection is empty
- Migrates products with legacy PDF-extracted images to new studio photography
- Adds Zoro / Shade lamps if missing
"""
import os
import logging
from pathlib import Path

logger = logging.getLogger(__name__)

STATIC_BASE = "/api/static/products"

# Map slug -> preferred image files (in order). Studio photos ship in the repo.
IMAGE_MAP = {
    "wavy-lamp": [f"{STATIC_BASE}/wavy-0{i}.jpg" for i in range(1, 4)],
    "spectra-lamp": [f"{STATIC_BASE}/spectra-0{i}.jpg" for i in range(1, 6)],
    "nova-lamp": [f"{STATIC_BASE}/nova-0{i}.jpg" for i in range(1, 9)],
    "cargo-lamp": [f"{STATIC_BASE}/cargo-0{i}.jpg" for i in range(1, 9)],
    "retro-lamp": [f"{STATIC_BASE}/retro-0{i}.jpg" for i in range(1, 9)],
    "small-table-lamp": [f"{STATIC_BASE}/small-0{i}.jpg" for i in range(1, 9)],
    "crumpled-lamp": [f"{STATIC_BASE}/crumpled-0{i}.jpg" for i in range(1, 9)],
    "zoro-lamp": [f"{STATIC_BASE}/zoro-0{i}.jpg" for i in range(1, 9)],
    "shade-lamp": [f"{STATIC_BASE}/shade-0{i}.jpg" for i in range(1, 6)],
}

SEED_LAMPS = [
    {
        "name": "Wavy Lamp", "slug": "wavy-lamp", "category": "lamps",
        "series": "Signature Series \u00b7 N\u00b0 01", "price": 1899,
        "description": "Embrace the fluid lines and sculptural forms of our Wavy table lamp. This piece offers a blend of artistic expression and functional design \u2014 perfect for adding a touch of modern elegance to any space.",
        "material": "Matte PLA \u00b7 Warm LED", "dimensions": "18 \u00d7 18 \u00d7 30 cm",
        "lead_time": "Ships in 3\u20135 days", "tag": "Best Seller", "featured": True,
    },
    {
        "name": "Spectra Lamp", "slug": "spectra-lamp", "category": "lamps",
        "series": "Ambient Series \u00b7 N\u00b0 02", "price": 2099,
        "description": "The Spectra lamp illuminates with soft lighting that creates a calming atmosphere. Delicate cut-outs allow the light from within to emanate, casting a warm and inviting glow that turns any room into a sanctuary at dusk.",
        "material": "Silk PLA \u00b7 Warm LED", "dimensions": "20 \u00d7 20 \u00d7 32 cm",
        "lead_time": "Ships in 3\u20135 days", "tag": "New", "featured": True,
    },
    {
        "name": "Nova Lamp", "slug": "nova-lamp", "category": "lamps",
        "series": "Modern Series \u00b7 N\u00b0 03", "price": 2599,
        "description": "The Nova lamp offers a sleek and modern lighting solution. With its clean lines, it is perfect for desks, bedside tables, bedrooms, or any space where focused light is needed. Both stylish and practical \u2014 it enhances every environment with its subtle glow.",
        "material": "Matte PLA \u00b7 Dimmable LED", "dimensions": "18 \u00d7 18 \u00d7 34 cm",
        "lead_time": "Ships in 3\u20135 days", "featured": True,
    },
    {
        "name": "Cargo Lamp", "slug": "cargo-lamp", "category": "lamps",
        "series": "Statement Series \u00b7 N\u00b0 04", "price": 3699,
        "description": "This table lamp features a distinctive base design, blending modern minimalism with artistic flair. Its unique form adds a touch of elegance and creativity to any space \u2014 making it perfect for those who appreciate one-of-a-kind statement pieces.",
        "material": "Reinforced PLA \u00b7 Warm LED", "dimensions": "22 \u00d7 22 \u00d7 38 cm",
        "lead_time": "Ships in 5\u20137 days", "tag": "Limited", "featured": True,
    },
    {
        "name": "Retro Lamp", "slug": "retro-lamp", "category": "lamps",
        "series": "Classic Series \u00b7 N\u00b0 05", "price": 2599,
        "description": "With its black base and classic white shade, this table lamp exudes calm and sophistication. Designed to complement both modern and traditional d\u00e9cor, it offers a gentle illumination that enhances the ambiance of any room.",
        "material": "Matte PLA \u00b7 Fabric shade", "dimensions": "20 \u00d7 20 \u00d7 40 cm",
        "lead_time": "Ships in 3\u20135 days",
    },
    {
        "name": "Small Table Lamp", "slug": "small-table-lamp", "category": "lamps",
        "series": "Petite Series \u00b7 N\u00b0 06", "price": 1299,
        "description": "Elevate your home with this elegant small table lamp, designed to create a calm and inviting atmosphere. The softly textured lampshade casts a warm, gentle light \u2014 perfect for bedrooms, living rooms, study corners, or bedside tables. Its compact size suits small spaces, while the tripod-style base gives it a stylish, handcrafted look.",
        "material": "Textured PLA \u00b7 Warm LED", "dimensions": "14 \u00d7 14 \u00d7 22 cm",
        "lead_time": "Ships in 3\u20135 days", "tag": "Best Seller",
    },
    {
        "name": "Crumpled Lamp", "slug": "crumpled-lamp", "category": "lamps",
        "series": "Organic Series \u00b7 N\u00b0 07", "price": 2099,
        "description": "This compact table lamp brings together modern minimalism and handmade charm. The textured shade diffuses light gently, creating a warm and inviting mood that works beautifully on bedside tables, side tables, shelves, and accent corners. Its unique crumpled silhouette gives it a soft, organic feel that stands out \u2014 even when the lamp is turned off.",
        "material": "Textured PLA \u00b7 Warm LED", "dimensions": "16 \u00d7 16 \u00d7 26 cm",
        "lead_time": "Ships in 3\u20135 days", "tag": "New",
    },
    {
        "name": "Zoro Lamp", "slug": "zoro-lamp", "category": "lamps",
        "series": "Cinematic Series \u00b7 N\u00b0 08", "price": 2799,
        "description": "A sculptural silhouette that catches the eye long before it's switched on. The Zoro lamp brings dramatic linework and a cinematic mood to bedside tables, entryways and reading corners \u2014 a piece as much art as it is light.",
        "material": "Textured PLA \u00b7 Warm LED", "dimensions": "18 \u00d7 18 \u00d7 32 cm",
        "lead_time": "Ships in 3\u20135 days", "tag": "New", "featured": True,
    },
    {
        "name": "Shade Lamp", "slug": "shade-lamp", "category": "lamps",
        "series": "Softlight Series \u00b7 N\u00b0 09", "price": 2399,
        "description": "A quiet, contemplative shade lamp designed to soften a room. Its diffused glow makes it perfect for living rooms, studies and hallways where a gentler light is welcome. Simple to place, easy to love.",
        "material": "Softlight PLA \u00b7 Fabric-look shade", "dimensions": "20 \u00d7 20 \u00d7 34 cm",
        "lead_time": "Ships in 3\u20135 days", "tag": "New", "featured": True,
    },
]


def _is_legacy_image(url: str) -> bool:
    """Legacy PDF-extracted images look like /api/static/products/lamp-000.jpg or /static/products/lamp-000.jpg"""
    return "lamp-00" in url or url.startswith("/static/products/")


async def seed_products(db):
    """Seed missing products and migrate legacy image paths. Idempotent."""
    from models import Product

    for entry in SEED_LAMPS:
        slug = entry["slug"]
        images = IMAGE_MAP.get(slug, [])
        existing = await db.products.find_one({"slug": slug})

        if not existing:
            # Insert new product
            product = Product(**entry, images=images)
            await db.products.insert_one(product.model_dump())
            logger.info(f"Seeded new product: {slug} ({len(images)} images)")
            continue

        # Migrate legacy image paths if needed
        current_images = existing.get("images") or []
        needs_update = False
        if not current_images:
            needs_update = True
        elif any(_is_legacy_image(u) for u in current_images):
            needs_update = True

        if needs_update and images:
            await db.products.update_one(
                {"_id": existing["_id"]},
                {"$set": {"images": images}},
            )
            logger.info(f"Migrated images for {slug}: {len(images)} images")


async def ensure_admin(db):
    from models import User
    from auth import hash_password
    admin_email = os.environ.get("ADMIN_EMAIL", "venus3dcreations@gmail.com")
    existing = await db.users.find_one({"email": admin_email})
    if existing:
        if existing.get("role") != "admin":
            await db.users.update_one({"_id": existing["_id"]}, {"$set": {"role": "admin"}})
            logger.info(f"Promoted {admin_email} to admin.")
        return
    admin_password = os.environ.get("ADMIN_PASSWORD", "venus@admin2025")
    if admin_password == "venus@admin2025":
        logger.warning("Admin seeded with the default password — set ADMIN_PASSWORD in the environment for production.")
    admin = User(email=admin_email, name="Venus Studio", role="admin", provider="email")
    doc = admin.model_dump()
    doc["password_hash"] = hash_password(admin_password)
    await db.users.insert_one(doc)
    logger.info(f"Created admin user: {admin_email}")
