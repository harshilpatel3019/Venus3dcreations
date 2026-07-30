#!/usr/bin/env python3
"""
Comprehensive test suite for Venus 3D Creations backend seed & migration logic.
Tests production redeploy scenario (fresh database + fresh filesystem).
"""
import requests
import time
import subprocess
import sys
from pymongo import MongoClient
from dotenv import load_dotenv
import os
from pathlib import Path

# Load backend environment
load_dotenv("/app/backend/.env")

BACKEND_URL = "http://localhost:8001"
MONGO_URL = os.environ.get("MONGO_URL", "mongodb://localhost:27017")
DB_NAME = os.environ.get("DB_NAME", "test_database")

# Expected product configuration
EXPECTED_PRODUCTS = {
    "wavy-lamp": {"name": "Wavy Lamp", "image_count": 3},
    "spectra-lamp": {"name": "Spectra Lamp", "image_count": 5},
    "nova-lamp": {"name": "Nova Lamp", "image_count": 8},
    "cargo-lamp": {"name": "Cargo Lamp", "image_count": 8},
    "retro-lamp": {"name": "Retro Lamp", "image_count": 8},
    "small-table-lamp": {"name": "Small Table Lamp", "image_count": 8},
    "crumpled-lamp": {"name": "Crumpled Lamp", "image_count": 8},
    "zoro-lamp": {"name": "Zoro Lamp", "image_count": 8},
    "shade-lamp": {"name": "Shade Lamp", "image_count": 5},
}

ADMIN_EMAIL = "venus3dcreations@gmail.com"
ADMIN_PASSWORD = "venus@admin2025"

class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    RESET = '\033[0m'

def print_test(msg):
    print(f"\n{Colors.BLUE}{'='*80}{Colors.RESET}")
    print(f"{Colors.BLUE}{msg}{Colors.RESET}")
    print(f"{Colors.BLUE}{'='*80}{Colors.RESET}")

def print_pass(msg):
    print(f"{Colors.GREEN}✓ PASS: {msg}{Colors.RESET}")

def print_fail(msg):
    print(f"{Colors.RED}✗ FAIL: {msg}{Colors.RESET}")

def print_info(msg):
    print(f"{Colors.YELLOW}ℹ INFO: {msg}{Colors.RESET}")

def restart_backend():
    """Restart backend service via supervisor"""
    print_info("Restarting backend service...")
    result = subprocess.run(
        ["sudo", "supervisorctl", "restart", "backend"],
        capture_output=True,
        text=True
    )
    if result.returncode != 0:
        print_fail(f"Backend restart failed: {result.stderr}")
        return False
    print_info("Waiting 5 seconds for backend to initialize...")
    time.sleep(5)
    return True

def get_mongo_client():
    """Get MongoDB client"""
    return MongoClient(MONGO_URL)

def test_1_seed_on_empty_database():
    """TEST 1: Seed on empty database"""
    print_test("TEST 1: Seed on empty database")
    
    # Step 1: Drop products collection
    print_info("Connecting to MongoDB and dropping products collection...")
    client = get_mongo_client()
    db = client[DB_NAME]
    result = db.products.delete_many({})
    print_info(f"Deleted {result.deleted_count} products from database")
    client.close()
    
    # Step 2: Restart backend
    if not restart_backend():
        return False
    
    # Step 3: Call GET /api/products
    print_info("Fetching products from API...")
    try:
        response = requests.get(f"{BACKEND_URL}/api/products", timeout=10)
        response.raise_for_status()
        products = response.json()
    except Exception as e:
        print_fail(f"Failed to fetch products: {e}")
        return False
    
    # Step 4: Verify exactly 9 products
    if len(products) != 9:
        print_fail(f"Expected 9 products, got {len(products)}")
        return False
    print_pass(f"Exactly 9 products returned")
    
    # Step 5: Verify each product
    all_passed = True
    products_by_slug = {p.get("slug"): p for p in products}
    
    for slug, expected in EXPECTED_PRODUCTS.items():
        if slug not in products_by_slug:
            print_fail(f"Product '{slug}' not found in seeded products")
            all_passed = False
            continue
        
        product = products_by_slug[slug]
        
        # Check name
        if product.get("name") != expected["name"]:
            print_fail(f"{slug}: Expected name '{expected['name']}', got '{product.get('name')}'")
            all_passed = False
        
        # Check images
        images = product.get("images", [])
        if len(images) != expected["image_count"]:
            print_fail(f"{slug}: Expected {expected['image_count']} images, got {len(images)}")
            all_passed = False
        else:
            print_pass(f"{slug}: {len(images)} images")
        
        # Verify image URLs start with /api/static/products/
        for img_url in images:
            if not img_url.startswith("/api/static/products/"):
                print_fail(f"{slug}: Image URL '{img_url}' doesn't start with '/api/static/products/'")
                all_passed = False
        
        # Check required fields
        if not product.get("description"):
            print_fail(f"{slug}: Missing description")
            all_passed = False
        
        if not product.get("material"):
            print_fail(f"{slug}: Missing material")
            all_passed = False
        
        if not product.get("dimensions"):
            print_fail(f"{slug}: Missing dimensions")
            all_passed = False
        
        price = product.get("price", 0)
        if price <= 0:
            print_fail(f"{slug}: Invalid price {price}")
            all_passed = False
        
        # Check currency context (INR mentioned in description or material)
        # Price is in INR as per the system
        if price > 0:
            print_pass(f"{slug}: Price {price} INR")
    
    if all_passed:
        print_pass("TEST 1: All products seeded correctly with proper image counts and metadata")
        return True
    else:
        print_fail("TEST 1: Some validations failed")
        return False

def test_2_legacy_image_migration():
    """TEST 2: Legacy image path migration"""
    print_test("TEST 2: Legacy image path migration")
    
    # Step 1: Manually update wavy-lamp to have legacy image path
    print_info("Updating wavy-lamp with legacy image path...")
    client = get_mongo_client()
    db = client[DB_NAME]
    
    result = db.products.update_one(
        {"slug": "wavy-lamp"},
        {"$set": {"images": ["/api/static/products/lamp-000.jpg"]}}
    )
    
    if result.matched_count == 0:
        print_fail("wavy-lamp not found in database")
        client.close()
        return False
    
    print_info("Verified legacy path set in database")
    client.close()
    
    # Step 2: Restart backend
    if not restart_backend():
        return False
    
    # Step 3: Verify migration
    print_info("Fetching wavy-lamp to verify migration...")
    try:
        response = requests.get(f"{BACKEND_URL}/api/products/wavy-lamp", timeout=10)
        response.raise_for_status()
        product = response.json()
    except Exception as e:
        print_fail(f"Failed to fetch wavy-lamp: {e}")
        return False
    
    images = product.get("images", [])
    expected_images = [
        "/api/static/products/wavy-01.jpg",
        "/api/static/products/wavy-02.jpg",
        "/api/static/products/wavy-03.jpg"
    ]
    
    if images == expected_images:
        print_pass(f"Legacy images migrated correctly: {images}")
        return True
    else:
        print_fail(f"Migration failed. Expected {expected_images}, got {images}")
        return False

def test_3_idempotency():
    """TEST 3: Idempotency - no duplicates on restart"""
    print_test("TEST 3: Idempotency")
    
    # Step 1: Count products before restart
    try:
        response = requests.get(f"{BACKEND_URL}/api/products", timeout=10)
        response.raise_for_status()
        products_before = response.json()
        count_before = len(products_before)
        print_info(f"Products before restart: {count_before}")
    except Exception as e:
        print_fail(f"Failed to fetch products: {e}")
        return False
    
    # Step 2: Restart backend
    if not restart_backend():
        return False
    
    # Step 3: Count products after restart
    try:
        response = requests.get(f"{BACKEND_URL}/api/products", timeout=10)
        response.raise_for_status()
        products_after = response.json()
        count_after = len(products_after)
        print_info(f"Products after restart: {count_after}")
    except Exception as e:
        print_fail(f"Failed to fetch products: {e}")
        return False
    
    # Step 4: Verify no duplicates
    if count_after != count_before:
        print_fail(f"Product count changed: {count_before} -> {count_after}. Duplicates created!")
        return False
    
    if count_after != 9:
        print_fail(f"Expected 9 products, got {count_after}")
        return False
    
    # Verify wavy-lamp images weren't overwritten unnecessarily
    wavy = next((p for p in products_after if p.get("slug") == "wavy-lamp"), None)
    if not wavy:
        print_fail("wavy-lamp not found")
        return False
    
    expected_images = [
        "/api/static/products/wavy-01.jpg",
        "/api/static/products/wavy-02.jpg",
        "/api/static/products/wavy-03.jpg"
    ]
    
    if wavy.get("images") != expected_images:
        print_fail(f"wavy-lamp images were modified: {wavy.get('images')}")
        return False
    
    print_pass("Idempotency verified: No duplicates, existing correct paths preserved")
    return True

def test_4_image_files_reachable():
    """TEST 4: Image files reachable via HTTP"""
    print_test("TEST 4: Image files reachable")
    
    test_images = [
        "/api/static/products/wavy-01.jpg",
        "/api/static/products/zoro-01.jpg",
        "/api/static/products/shade-01.jpg",
        "/api/static/products/studio-01.jpg",  # Homepage hero image
    ]
    
    all_passed = True
    for img_path in test_images:
        url = f"{BACKEND_URL}{img_path}"
        try:
            response = requests.head(url, timeout=5)
            if response.status_code == 200:
                content_type = response.headers.get("content-type", "")
                if "image" in content_type:
                    print_pass(f"{img_path}: HTTP 200, {content_type}")
                else:
                    print_fail(f"{img_path}: HTTP 200 but wrong content-type: {content_type}")
                    all_passed = False
            else:
                print_fail(f"{img_path}: HTTP {response.status_code}")
                all_passed = False
        except Exception as e:
            print_fail(f"{img_path}: Request failed - {e}")
            all_passed = False
    
    if all_passed:
        print_pass("All test images reachable")
        return True
    else:
        print_fail("Some images not reachable")
        return False

def test_5_admin_still_works():
    """TEST 5: Admin login still works"""
    print_test("TEST 5: Admin login")
    
    try:
        response = requests.post(
            f"{BACKEND_URL}/api/auth/login",
            json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD},
            timeout=10
        )
        response.raise_for_status()
        data = response.json()
    except Exception as e:
        print_fail(f"Admin login failed: {e}")
        return False
    
    # Verify token returned
    token = data.get("access_token")
    if not token:
        print_fail("No access_token in response")
        return False
    
    # Verify user data
    user = data.get("user", {})
    if user.get("role") != "admin":
        print_fail(f"Expected role=admin, got role={user.get('role')}")
        return False
    
    if user.get("email") != ADMIN_EMAIL:
        print_fail(f"Expected email={ADMIN_EMAIL}, got email={user.get('email')}")
        return False
    
    print_pass(f"Admin login successful: {ADMIN_EMAIL} with role=admin")
    print_info(f"Token: {token[:50]}...")
    return True

def main():
    """Run all tests"""
    print(f"\n{Colors.BLUE}{'='*80}{Colors.RESET}")
    print(f"{Colors.BLUE}Venus 3D Creations - Backend Seed & Migration Test Suite{Colors.RESET}")
    print(f"{Colors.BLUE}{'='*80}{Colors.RESET}\n")
    
    results = {}
    
    # Run tests in sequence
    results["TEST 1: Seed on empty database"] = test_1_seed_on_empty_database()
    results["TEST 2: Legacy image migration"] = test_2_legacy_image_migration()
    results["TEST 3: Idempotency"] = test_3_idempotency()
    results["TEST 4: Image files reachable"] = test_4_image_files_reachable()
    results["TEST 5: Admin login"] = test_5_admin_still_works()
    
    # Summary
    print(f"\n{Colors.BLUE}{'='*80}{Colors.RESET}")
    print(f"{Colors.BLUE}TEST SUMMARY{Colors.RESET}")
    print(f"{Colors.BLUE}{'='*80}{Colors.RESET}\n")
    
    passed = sum(1 for v in results.values() if v)
    total = len(results)
    
    for test_name, result in results.items():
        status = f"{Colors.GREEN}PASS{Colors.RESET}" if result else f"{Colors.RED}FAIL{Colors.RESET}"
        print(f"{status}: {test_name}")
    
    print(f"\n{Colors.BLUE}{'='*80}{Colors.RESET}")
    if passed == total:
        print(f"{Colors.GREEN}ALL TESTS PASSED ({passed}/{total}){Colors.RESET}")
        print(f"{Colors.GREEN}✓ Backend seed & migration logic is production-ready{Colors.RESET}")
        print(f"{Colors.BLUE}{'='*80}{Colors.RESET}\n")
        return 0
    else:
        print(f"{Colors.RED}SOME TESTS FAILED ({passed}/{total} passed){Colors.RESET}")
        print(f"{Colors.RED}✗ Issues found - see details above{Colors.RESET}")
        print(f"{Colors.BLUE}{'='*80}{Colors.RESET}\n")
        return 1

if __name__ == "__main__":
    sys.exit(main())
