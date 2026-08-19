#!/usr/bin/env python3
"""
Test UUID-image migration logic in seed.py
Verifies that stale admin-uploaded UUID-named images are migrated to studio photography
"""
import requests
import time
import subprocess
import sys
from pymongo import MongoClient
import os

# Backend URL from environment
BACKEND_URL = "https://venus-v2.preview.emergentagent.com/api"

# MongoDB connection
MONGO_URL = os.environ.get("MONGO_URL", "mongodb://localhost:27017")
client = MongoClient(MONGO_URL)
db = client["test_database"]  # Match DB_NAME from backend/.env

def restart_backend():
    """Restart backend service and wait for it to be ready"""
    print("🔄 Restarting backend...")
    subprocess.run(["sudo", "supervisorctl", "restart", "backend"], check=True)
    time.sleep(6)  # Wait for startup + seed to complete
    
    # Verify backend is up
    for i in range(10):
        try:
            resp = requests.get(f"{BACKEND_URL}/products", timeout=5)
            if resp.status_code == 200:
                print("✅ Backend ready")
                return
        except Exception:
            pass
        time.sleep(1)
    print("❌ Backend failed to start")
    sys.exit(1)

def get_product_images(slug):
    """Get images array for a product by slug"""
    product = db.products.find_one({"slug": slug})
    if not product:
        return None
    return product.get("images", [])

def set_product_images(slug, images):
    """Set images array for a product"""
    result = db.products.update_one(
        {"slug": slug},
        {"$set": {"images": images}}
    )
    return result.modified_count > 0

def test_1_uuid_image_migration():
    """TEST 1: UUID-image migration"""
    print("\n" + "="*80)
    print("TEST 1: UUID-image migration")
    print("="*80)
    
    # Set wavy-lamp to a stale UUID admin upload
    uuid_image = "/api/static/products/5af4d276104c4bf2a77604392e59ecbf.jpg"
    print(f"Setting wavy-lamp images to: {uuid_image}")
    set_product_images("wavy-lamp", [uuid_image])
    
    # Verify it was set
    current = get_product_images("wavy-lamp")
    print(f"Before restart: {current}")
    assert current == [uuid_image], f"Failed to set UUID image"
    
    # Restart backend to trigger migration
    restart_backend()
    
    # Check if migration happened
    migrated = get_product_images("wavy-lamp")
    expected = [
        "/api/static/products/wavy-01.jpg",
        "/api/static/products/wavy-02.jpg",
        "/api/static/products/wavy-03.jpg"
    ]
    
    print(f"After restart: {migrated}")
    
    if migrated == expected:
        print("✅ TEST 1 PASSED: UUID image migrated to studio photos")
        return True
    else:
        print(f"❌ TEST 1 FAILED: Expected {expected}, got {migrated}")
        return False

def test_2_idempotency():
    """TEST 2: Existing correct images are preserved (idempotency)"""
    print("\n" + "="*80)
    print("TEST 2: Idempotency - correct images preserved")
    print("="*80)
    
    # wavy-lamp should already have correct images from TEST 1
    before = get_product_images("wavy-lamp")
    print(f"Before restart: {before}")
    
    expected = [
        "/api/static/products/wavy-01.jpg",
        "/api/static/products/wavy-02.jpg",
        "/api/static/products/wavy-03.jpg"
    ]
    
    if before != expected:
        print(f"⚠️  Skipping TEST 2: wavy-lamp doesn't have correct images from TEST 1")
        return False
    
    # Restart backend
    restart_backend()
    
    # Check images are unchanged
    after = get_product_images("wavy-lamp")
    print(f"After restart: {after}")
    
    if after == expected:
        print("✅ TEST 2 PASSED: Correct images preserved (idempotent)")
        return True
    else:
        print(f"❌ TEST 2 FAILED: Images changed unexpectedly to {after}")
        return False

def test_3_legacy_path_migration():
    """TEST 3: Legacy path migration still works (regression check)"""
    print("\n" + "="*80)
    print("TEST 3: Legacy path migration (regression check)")
    print("="*80)
    
    # Set nova-lamp to legacy PDF-extracted path
    legacy_image = "/api/static/products/lamp-002.jpg"
    print(f"Setting nova-lamp images to: {legacy_image}")
    set_product_images("nova-lamp", [legacy_image])
    
    # Verify it was set
    current = get_product_images("nova-lamp")
    print(f"Before restart: {current}")
    assert current == [legacy_image], f"Failed to set legacy image"
    
    # Restart backend
    restart_backend()
    
    # Check if migration happened
    migrated = get_product_images("nova-lamp")
    expected = [f"/api/static/products/nova-0{i}.jpg" for i in range(1, 9)]
    
    print(f"After restart: {migrated}")
    
    if migrated == expected:
        print("✅ TEST 3 PASSED: Legacy path migrated to 8 studio photos")
        return True
    else:
        print(f"❌ TEST 3 FAILED: Expected {len(expected)} images, got {len(migrated)}")
        return False

def test_4_custom_images_survive():
    """TEST 4: Custom non-UUID filenames survive"""
    print("\n" + "="*80)
    print("TEST 4: Custom non-UUID admin uploads preserved")
    print("="*80)
    
    # Set retro-lamp to custom non-UUID filenames
    custom_images = [
        "/api/static/products/mycustom_retro.jpg",
        "/api/static/products/anothername.jpg"
    ]
    print(f"Setting retro-lamp images to: {custom_images}")
    set_product_images("retro-lamp", custom_images)
    
    # Verify it was set
    current = get_product_images("retro-lamp")
    print(f"Before restart: {current}")
    assert current == custom_images, f"Failed to set custom images"
    
    # Restart backend
    restart_backend()
    
    # Check if custom images survived
    after = get_product_images("retro-lamp")
    print(f"After restart: {after}")
    
    if after == custom_images:
        print("✅ TEST 4 PASSED: Custom non-UUID images preserved")
        return True
    else:
        print(f"❌ TEST 4 FAILED: Custom images were changed to {after}")
        return False

def test_5_all_products_list():
    """TEST 5: All 9 products still list correctly with images"""
    print("\n" + "="*80)
    print("TEST 5: All 9 products list with images")
    print("="*80)
    
    try:
        resp = requests.get(f"{BACKEND_URL}/products", timeout=10)
        resp.raise_for_status()
        products = resp.json()
        
        print(f"Total products: {len(products)}")
        
        if len(products) != 9:
            print(f"❌ TEST 5 FAILED: Expected 9 products, got {len(products)}")
            return False
        
        # Check each product has at least 1 image
        for p in products:
            images = p.get("images", [])
            if not images:
                print(f"❌ TEST 5 FAILED: Product {p['slug']} has no images")
                return False
            print(f"  {p['slug']}: {len(images)} images")
        
        print("✅ TEST 5 PASSED: All 9 products have images")
        return True
        
    except Exception as e:
        print(f"❌ TEST 5 FAILED: {e}")
        return False

def test_6_static_images_reachable():
    """TEST 6: Static images are reachable"""
    print("\n" + "="*80)
    print("TEST 6: Static images reachable")
    print("="*80)
    
    test_images = [
        "/api/static/products/wavy-01.jpg",
        "/api/static/products/nova-01.jpg"
    ]
    
    all_passed = True
    for img_path in test_images:
        url = f"https://venus-v2.preview.emergentagent.com{img_path}"
        try:
            resp = requests.head(url, timeout=5)
            if resp.status_code == 200:
                print(f"✅ {img_path}: HTTP {resp.status_code}")
            else:
                print(f"❌ {img_path}: HTTP {resp.status_code}")
                all_passed = False
        except Exception as e:
            print(f"❌ {img_path}: {e}")
            all_passed = False
    
    if all_passed:
        print("✅ TEST 6 PASSED: Static images reachable")
    else:
        print("❌ TEST 6 FAILED: Some images not reachable")
    
    return all_passed

def main():
    print("="*80)
    print("UUID-IMAGE MIGRATION TEST SUITE")
    print("="*80)
    
    # Ensure backend is running and products are seeded
    print("\n🔄 Initial backend restart to ensure products are seeded...")
    restart_backend()
    
    # Verify products exist
    count = db.products.count_documents({})
    print(f"Products in database: {count}")
    if count == 0:
        print("❌ No products found after seed. Aborting tests.")
        sys.exit(1)
    
    results = {}
    
    # Run all tests in sequence
    results["TEST 1: UUID-image migration"] = test_1_uuid_image_migration()
    results["TEST 2: Idempotency"] = test_2_idempotency()
    results["TEST 3: Legacy path migration"] = test_3_legacy_path_migration()
    results["TEST 4: Custom images survive"] = test_4_custom_images_survive()
    results["TEST 5: All products list"] = test_5_all_products_list()
    results["TEST 6: Static images reachable"] = test_6_static_images_reachable()
    
    # Summary
    print("\n" + "="*80)
    print("TEST SUMMARY")
    print("="*80)
    
    passed = sum(1 for v in results.values() if v)
    total = len(results)
    
    for test_name, result in results.items():
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status}: {test_name}")
    
    print(f"\nTotal: {passed}/{total} tests passed")
    
    if passed == total:
        print("\n🎉 ALL TESTS PASSED - Safe to deploy to production")
        sys.exit(0)
    else:
        print(f"\n⚠️  {total - passed} test(s) failed")
        sys.exit(1)

if __name__ == "__main__":
    main()
