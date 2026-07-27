#!/usr/bin/env python3
"""
Backend API Test Suite for Venus 3D Creations
Tests all backend endpoints as specified in test_result.md
"""
import requests
import json
import sys
from typing import Dict, Optional

# Backend URL from environment
BASE_URL = "https://venus-v2.preview.emergentagent.com/api"
STATIC_URL = "https://venus-v2.preview.emergentagent.com"

# Admin credentials
ADMIN_EMAIL = "venus3dcreations@gmail.com"
ADMIN_PASSWORD = "venus@admin2025"

# Test results tracking
test_results = {
    "passed": [],
    "failed": [],
    "warnings": []
}

def log_pass(test_name: str, details: str = ""):
    """Log a passed test"""
    msg = f"✅ PASS: {test_name}"
    if details:
        msg += f" - {details}"
    print(msg)
    test_results["passed"].append(test_name)

def log_fail(test_name: str, details: str):
    """Log a failed test"""
    msg = f"❌ FAIL: {test_name} - {details}"
    print(msg)
    test_results["failed"].append(f"{test_name}: {details}")

def log_warning(test_name: str, details: str):
    """Log a warning"""
    msg = f"⚠️  WARNING: {test_name} - {details}"
    print(msg)
    test_results["warnings"].append(f"{test_name}: {details}")

def print_section(title: str):
    """Print a section header"""
    print(f"\n{'='*80}")
    print(f"  {title}")
    print(f"{'='*80}\n")

# ============================================================================
# Test 1: Products Endpoints
# ============================================================================
def test_products_listing():
    """Test GET /api/products - should return 7 lamps"""
    print_section("TEST 1: Products Listing")
    
    try:
        response = requests.get(f"{BASE_URL}/products", timeout=10)
        
        if response.status_code != 200:
            log_fail("GET /api/products", f"Expected 200, got {response.status_code}")
            return None
        
        products = response.json()
        
        if not isinstance(products, list):
            log_fail("GET /api/products", f"Expected list, got {type(products)}")
            return None
        
        if len(products) != 7:
            log_fail("GET /api/products", f"Expected 7 products, got {len(products)}")
            return None
        
        log_pass("GET /api/products", f"Returned {len(products)} products")
        return products
        
    except Exception as e:
        log_fail("GET /api/products", f"Exception: {str(e)}")
        return None

def test_products_filter_category(products: Optional[list]):
    """Test GET /api/products?category=lamps"""
    try:
        response = requests.get(f"{BASE_URL}/products?category=lamps", timeout=10)
        
        if response.status_code != 200:
            log_fail("GET /api/products?category=lamps", f"Expected 200, got {response.status_code}")
            return
        
        filtered = response.json()
        
        if not isinstance(filtered, list):
            log_fail("GET /api/products?category=lamps", f"Expected list, got {type(filtered)}")
            return
        
        # All should be lamps
        for p in filtered:
            if p.get("category") != "lamps":
                log_fail("GET /api/products?category=lamps", f"Product {p.get('name')} has category {p.get('category')}")
                return
        
        log_pass("GET /api/products?category=lamps", f"Returned {len(filtered)} lamps")
        
    except Exception as e:
        log_fail("GET /api/products?category=lamps", f"Exception: {str(e)}")

def test_products_filter_featured():
    """Test GET /api/products?featured=true"""
    try:
        response = requests.get(f"{BASE_URL}/products?featured=true", timeout=10)
        
        if response.status_code != 200:
            log_fail("GET /api/products?featured=true", f"Expected 200, got {response.status_code}")
            return
        
        featured = response.json()
        
        if not isinstance(featured, list):
            log_fail("GET /api/products?featured=true", f"Expected list, got {type(featured)}")
            return
        
        # All should be featured
        for p in featured:
            if not p.get("featured"):
                log_fail("GET /api/products?featured=true", f"Product {p.get('name')} is not featured")
                return
        
        log_pass("GET /api/products?featured=true", f"Returned {len(featured)} featured products")
        
    except Exception as e:
        log_fail("GET /api/products?featured=true", f"Exception: {str(e)}")

def test_product_detail_by_slug(products: Optional[list]):
    """Test GET /api/products/{slug}"""
    if not products:
        log_fail("GET /api/products/{slug}", "No products available to test")
        return None
    
    try:
        # Test with wavy-lamp slug
        slug = "wavy-lamp"
        response = requests.get(f"{BASE_URL}/products/{slug}", timeout=10)
        
        if response.status_code != 200:
            log_fail(f"GET /api/products/{slug}", f"Expected 200, got {response.status_code}")
            return None
        
        product = response.json()
        
        if not isinstance(product, dict):
            log_fail(f"GET /api/products/{slug}", f"Expected dict, got {type(product)}")
            return None
        
        if product.get("slug") != slug:
            log_fail(f"GET /api/products/{slug}", f"Expected slug {slug}, got {product.get('slug')}")
            return None
        
        log_pass(f"GET /api/products/{slug}", f"Retrieved product: {product.get('name')}")
        return product
        
    except Exception as e:
        log_fail(f"GET /api/products/{slug}", f"Exception: {str(e)}")
        return None

def test_product_detail_by_id(products: Optional[list]):
    """Test GET /api/products/{id}"""
    if not products or len(products) == 0:
        log_fail("GET /api/products/{id}", "No products available to test")
        return
    
    try:
        product_id = products[0].get("id")
        if not product_id:
            log_fail("GET /api/products/{id}", "Product has no ID")
            return
        
        response = requests.get(f"{BASE_URL}/products/{product_id}", timeout=10)
        
        if response.status_code != 200:
            log_fail(f"GET /api/products/{product_id}", f"Expected 200, got {response.status_code}")
            return
        
        product = response.json()
        
        if product.get("id") != product_id:
            log_fail(f"GET /api/products/{product_id}", f"Expected id {product_id}, got {product.get('id')}")
            return
        
        log_pass(f"GET /api/products/{product_id}", f"Retrieved product: {product.get('name')}")
        
    except Exception as e:
        log_fail(f"GET /api/products/{id}", f"Exception: {str(e)}")

# ============================================================================
# Test 2: Config Endpoint
# ============================================================================
def test_config():
    """Test GET /api/config"""
    print_section("TEST 2: Config Endpoint")
    
    try:
        response = requests.get(f"{BASE_URL}/config", timeout=10)
        
        if response.status_code != 200:
            log_fail("GET /api/config", f"Expected 200, got {response.status_code}")
            return
        
        config = response.json()
        
        if config.get("razorpay_key_id") != "rzp_test_TIXjU0bLvC2jNr":
            log_fail("GET /api/config", f"Expected razorpay_key_id rzp_test_TIXjU0bLvC2jNr, got {config.get('razorpay_key_id')}")
            return
        
        if config.get("currency") != "INR":
            log_fail("GET /api/config", f"Expected currency INR, got {config.get('currency')}")
            return
        
        log_pass("GET /api/config", f"razorpay_key_id={config.get('razorpay_key_id')}, currency={config.get('currency')}")
        
    except Exception as e:
        log_fail("GET /api/config", f"Exception: {str(e)}")

# ============================================================================
# Test 3: Auth Endpoints
# ============================================================================
def test_auth_register():
    """Test POST /api/auth/register"""
    print_section("TEST 3: Auth - Register")
    
    import uuid
    test_email = f"test_{uuid.uuid4().hex[:8]}@example.com"
    
    try:
        payload = {
            "email": test_email,
            "name": "Test Customer",
            "password": "TestPass123!",
            "phone": "9876543210"
        }
        
        response = requests.post(f"{BASE_URL}/auth/register", json=payload, timeout=10)
        
        if response.status_code != 200:
            log_fail("POST /api/auth/register", f"Expected 200, got {response.status_code}: {response.text}")
            return None, None
        
        data = response.json()
        
        if not data.get("access_token"):
            log_fail("POST /api/auth/register", "No access_token in response")
            return None, None
        
        if not data.get("user"):
            log_fail("POST /api/auth/register", "No user in response")
            return None, None
        
        log_pass("POST /api/auth/register", f"Registered user: {data['user'].get('email')}")
        return test_email, data.get("access_token")
        
    except Exception as e:
        log_fail("POST /api/auth/register", f"Exception: {str(e)}")
        return None, None

def test_auth_register_duplicate(email: Optional[str]):
    """Test POST /api/auth/register with duplicate email - should return 400"""
    if not email:
        log_fail("POST /api/auth/register (duplicate)", "No email to test duplicate")
        return
    
    try:
        payload = {
            "email": email,
            "name": "Duplicate User",
            "password": "AnotherPass123!",
            "phone": "9876543211"
        }
        
        response = requests.post(f"{BASE_URL}/auth/register", json=payload, timeout=10)
        
        if response.status_code != 400:
            log_fail("POST /api/auth/register (duplicate)", f"Expected 400, got {response.status_code}")
            return
        
        log_pass("POST /api/auth/register (duplicate)", "Correctly rejected duplicate email with 400")
        
    except Exception as e:
        log_fail("POST /api/auth/register (duplicate)", f"Exception: {str(e)}")

def test_auth_login(email: Optional[str], password: str = "TestPass123!"):
    """Test POST /api/auth/login"""
    print_section("TEST 4: Auth - Login")
    
    if not email:
        log_fail("POST /api/auth/login", "No email to test login")
        return None
    
    try:
        payload = {
            "email": email,
            "password": password
        }
        
        response = requests.post(f"{BASE_URL}/auth/login", json=payload, timeout=10)
        
        if response.status_code != 200:
            log_fail("POST /api/auth/login", f"Expected 200, got {response.status_code}: {response.text}")
            return None
        
        data = response.json()
        
        if not data.get("access_token"):
            log_fail("POST /api/auth/login", "No access_token in response")
            return None
        
        log_pass("POST /api/auth/login", f"Logged in user: {email}")
        return data.get("access_token")
        
    except Exception as e:
        log_fail("POST /api/auth/login", f"Exception: {str(e)}")
        return None

def test_auth_login_wrong_password(email: Optional[str]):
    """Test POST /api/auth/login with wrong password - should return 401"""
    if not email:
        log_fail("POST /api/auth/login (wrong password)", "No email to test")
        return
    
    try:
        payload = {
            "email": email,
            "password": "WrongPassword123!"
        }
        
        response = requests.post(f"{BASE_URL}/auth/login", json=payload, timeout=10)
        
        if response.status_code != 401:
            log_fail("POST /api/auth/login (wrong password)", f"Expected 401, got {response.status_code}")
            return
        
        log_pass("POST /api/auth/login (wrong password)", "Correctly rejected wrong password with 401")
        
    except Exception as e:
        log_fail("POST /api/auth/login (wrong password)", f"Exception: {str(e)}")

def test_auth_me(token: Optional[str]):
    """Test GET /api/auth/me"""
    print_section("TEST 5: Auth - Me")
    
    if not token:
        log_fail("GET /api/auth/me", "No token to test")
        return
    
    try:
        headers = {"Authorization": f"Bearer {token}"}
        response = requests.get(f"{BASE_URL}/auth/me", headers=headers, timeout=10)
        
        if response.status_code != 200:
            log_fail("GET /api/auth/me", f"Expected 200, got {response.status_code}: {response.text}")
            return
        
        user = response.json()
        
        if not user.get("email"):
            log_fail("GET /api/auth/me", "No email in response")
            return
        
        log_pass("GET /api/auth/me", f"Retrieved user: {user.get('email')}")
        
    except Exception as e:
        log_fail("GET /api/auth/me", f"Exception: {str(e)}")

# ============================================================================
# Test 6: Orders
# ============================================================================
def test_order_creation(products: Optional[list]):
    """Test POST /api/orders - guest checkout"""
    print_section("TEST 6: Order Creation")
    
    if not products or len(products) == 0:
        log_fail("POST /api/orders", "No products available to create order")
        return None
    
    try:
        # Use first product
        product = products[0]
        
        payload = {
            "email": "customer@example.com",
            "items": [
                {
                    "product_id": product.get("id"),
                    "name": product.get("name"),
                    "price": product.get("price"),
                    "qty": 2
                }
            ],
            "address": {
                "full_name": "Priya Sharma",
                "phone": "9876543210",
                "line1": "123 MG Road",
                "line2": "Near City Mall",
                "city": "Bangalore",
                "state": "Karnataka",
                "pincode": "560001",
                "country": "India"
            },
            "notes": "Please handle with care"
        }
        
        response = requests.post(f"{BASE_URL}/orders", json=payload, timeout=10)
        
        if response.status_code != 200:
            log_fail("POST /api/orders", f"Expected 200, got {response.status_code}: {response.text}")
            return None
        
        order = response.json()
        
        # Verify razorpay_order_id is present and starts with "order_"
        razorpay_order_id = order.get("razorpay_order_id")
        if not razorpay_order_id:
            log_fail("POST /api/orders", "No razorpay_order_id in response")
            return None
        
        if not razorpay_order_id.startswith("order_"):
            log_fail("POST /api/orders", f"razorpay_order_id should start with 'order_', got: {razorpay_order_id}")
            return None
        
        # Verify amount is in paise
        amount = order.get("amount")
        if not amount or not isinstance(amount, int):
            log_fail("POST /api/orders", f"Invalid amount: {amount}")
            return None
        
        # Verify currency
        if order.get("currency") != "INR":
            log_fail("POST /api/orders", f"Expected currency INR, got {order.get('currency')}")
            return None
        
        # Verify totals
        expected_subtotal = product.get("price") * 2
        if order.get("subtotal") != expected_subtotal:
            log_fail("POST /api/orders", f"Expected subtotal {expected_subtotal}, got {order.get('subtotal')}")
            return None
        
        log_pass("POST /api/orders", f"Created order with razorpay_order_id={razorpay_order_id}, amount={amount} paise")
        return order.get("order_id")
        
    except Exception as e:
        log_fail("POST /api/orders", f"Exception: {str(e)}")
        return None

def test_order_verify_bad_signature(order_id: Optional[str]):
    """Test POST /api/orders/verify with bad signature - should return 400"""
    print_section("TEST 7: Order Verification (Bad Signature)")
    
    if not order_id:
        log_fail("POST /api/orders/verify", "No order_id to test")
        return
    
    try:
        payload = {
            "order_id": order_id,
            "razorpay_order_id": "order_fake123",
            "razorpay_payment_id": "pay_fake123",
            "razorpay_signature": "bad_signature_12345"
        }
        
        response = requests.post(f"{BASE_URL}/orders/verify", json=payload, timeout=10)
        
        if response.status_code != 400:
            log_fail("POST /api/orders/verify (bad signature)", f"Expected 400, got {response.status_code}")
            return
        
        log_pass("POST /api/orders/verify (bad signature)", "Correctly rejected bad signature with 400")
        
    except Exception as e:
        log_fail("POST /api/orders/verify (bad signature)", f"Exception: {str(e)}")

# ============================================================================
# Test 8: Admin Routes
# ============================================================================
def test_admin_login():
    """Test admin login"""
    print_section("TEST 8: Admin Login")
    
    try:
        payload = {
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        }
        
        response = requests.post(f"{BASE_URL}/auth/login", json=payload, timeout=10)
        
        if response.status_code != 200:
            log_fail("POST /api/auth/login (admin)", f"Expected 200, got {response.status_code}: {response.text}")
            return None
        
        data = response.json()
        
        if not data.get("access_token"):
            log_fail("POST /api/auth/login (admin)", "No access_token in response")
            return None
        
        # Verify user role is admin
        if data.get("user", {}).get("role") != "admin":
            log_fail("POST /api/auth/login (admin)", f"Expected role admin, got {data.get('user', {}).get('role')}")
            return None
        
        log_pass("POST /api/auth/login (admin)", f"Admin logged in: {ADMIN_EMAIL}")
        return data.get("access_token")
        
    except Exception as e:
        log_fail("POST /api/auth/login (admin)", f"Exception: {str(e)}")
        return None

def test_admin_list_products(admin_token: Optional[str]):
    """Test GET /api/admin/products"""
    print_section("TEST 9: Admin - List Products")
    
    if not admin_token:
        log_fail("GET /api/admin/products", "No admin token")
        return
    
    try:
        headers = {"Authorization": f"Bearer {admin_token}"}
        response = requests.get(f"{BASE_URL}/admin/products", headers=headers, timeout=10)
        
        if response.status_code != 200:
            log_fail("GET /api/admin/products", f"Expected 200, got {response.status_code}: {response.text}")
            return
        
        products = response.json()
        
        if not isinstance(products, list):
            log_fail("GET /api/admin/products", f"Expected list, got {type(products)}")
            return
        
        log_pass("GET /api/admin/products", f"Retrieved {len(products)} products")
        
    except Exception as e:
        log_fail("GET /api/admin/products", f"Exception: {str(e)}")

def test_admin_update_product(admin_token: Optional[str], products: Optional[list]):
    """Test PATCH /api/admin/products/{id}"""
    print_section("TEST 10: Admin - Update Product")
    
    if not admin_token:
        log_fail("PATCH /api/admin/products/{id}", "No admin token")
        return
    
    if not products or len(products) == 0:
        log_fail("PATCH /api/admin/products/{id}", "No products to update")
        return
    
    try:
        product_id = products[0].get("id")
        original_price = products[0].get("price")
        new_price = original_price + 100
        
        headers = {"Authorization": f"Bearer {admin_token}"}
        payload = {"price": new_price}
        
        response = requests.patch(f"{BASE_URL}/admin/products/{product_id}", json=payload, headers=headers, timeout=10)
        
        if response.status_code != 200:
            log_fail("PATCH /api/admin/products/{id}", f"Expected 200, got {response.status_code}: {response.text}")
            return
        
        updated = response.json()
        
        if updated.get("price") != new_price:
            log_fail("PATCH /api/admin/products/{id}", f"Expected price {new_price}, got {updated.get('price')}")
            return
        
        log_pass("PATCH /api/admin/products/{id}", f"Updated product price from {original_price} to {new_price}")
        
        # Restore original price
        payload = {"price": original_price}
        requests.patch(f"{BASE_URL}/admin/products/{product_id}", json=payload, headers=headers, timeout=10)
        
    except Exception as e:
        log_fail("PATCH /api/admin/products/{id}", f"Exception: {str(e)}")

def test_admin_stats(admin_token: Optional[str]):
    """Test GET /api/admin/stats"""
    print_section("TEST 11: Admin - Stats")
    
    if not admin_token:
        log_fail("GET /api/admin/stats", "No admin token")
        return
    
    try:
        headers = {"Authorization": f"Bearer {admin_token}"}
        response = requests.get(f"{BASE_URL}/admin/stats", headers=headers, timeout=10)
        
        if response.status_code != 200:
            log_fail("GET /api/admin/stats", f"Expected 200, got {response.status_code}: {response.text}")
            return
        
        stats = response.json()
        
        required_keys = ["products", "orders", "paid_orders", "revenue"]
        for key in required_keys:
            if key not in stats:
                log_fail("GET /api/admin/stats", f"Missing key: {key}")
                return
        
        log_pass("GET /api/admin/stats", f"products={stats['products']}, orders={stats['orders']}, paid_orders={stats['paid_orders']}, revenue={stats['revenue']}")
        
    except Exception as e:
        log_fail("GET /api/admin/stats", f"Exception: {str(e)}")

def test_admin_list_orders(admin_token: Optional[str]):
    """Test GET /api/admin/orders"""
    print_section("TEST 12: Admin - List Orders")
    
    if not admin_token:
        log_fail("GET /api/admin/orders", "No admin token")
        return
    
    try:
        headers = {"Authorization": f"Bearer {admin_token}"}
        response = requests.get(f"{BASE_URL}/admin/orders", headers=headers, timeout=10)
        
        if response.status_code != 200:
            log_fail("GET /api/admin/orders", f"Expected 200, got {response.status_code}: {response.text}")
            return
        
        orders = response.json()
        
        if not isinstance(orders, list):
            log_fail("GET /api/admin/orders", f"Expected list, got {type(orders)}")
            return
        
        log_pass("GET /api/admin/orders", f"Retrieved {len(orders)} orders")
        
    except Exception as e:
        log_fail("GET /api/admin/orders", f"Exception: {str(e)}")

def test_admin_routes_non_admin(customer_token: Optional[str]):
    """Test that non-admin token returns 403 on admin routes"""
    print_section("TEST 13: Admin Routes - Non-Admin Access")
    
    if not customer_token:
        log_fail("Admin routes (non-admin)", "No customer token to test")
        return
    
    try:
        headers = {"Authorization": f"Bearer {customer_token}"}
        
        # Test admin products endpoint
        response = requests.get(f"{BASE_URL}/admin/products", headers=headers, timeout=10)
        
        if response.status_code != 403:
            log_fail("GET /api/admin/products (non-admin)", f"Expected 403, got {response.status_code}")
            return
        
        log_pass("GET /api/admin/products (non-admin)", "Correctly rejected non-admin with 403")
        
    except Exception as e:
        log_fail("Admin routes (non-admin)", f"Exception: {str(e)}")

# ============================================================================
# Test 14: Static Images
# ============================================================================
def test_static_images():
    """Test GET /static/products/lamp-000.jpg"""
    print_section("TEST 14: Static Images")
    
    try:
        response = requests.get(f"{STATIC_URL}/static/products/lamp-000.jpg", timeout=10)
        
        if response.status_code != 200:
            log_fail("GET /static/products/lamp-000.jpg", f"Expected 200, got {response.status_code}")
            return
        
        # Check content type
        content_type = response.headers.get("content-type", "")
        if "image" not in content_type.lower():
            log_fail("GET /static/products/lamp-000.jpg", f"Expected image content-type, got {content_type}")
            return
        
        log_pass("GET /static/products/lamp-000.jpg", f"Image served successfully, content-type={content_type}")
        
    except Exception as e:
        log_fail("GET /static/products/lamp-000.jpg", f"Exception: {str(e)}")

# ============================================================================
# Main Test Runner
# ============================================================================
def main():
    print("\n" + "="*80)
    print("  VENUS 3D CREATIONS - BACKEND API TEST SUITE")
    print("="*80)
    print(f"  Base URL: {BASE_URL}")
    print("="*80 + "\n")
    
    # Test 1: Products
    products = test_products_listing()
    if products:
        test_products_filter_category(products)
        test_products_filter_featured()
        test_product_detail_by_slug(products)
        test_product_detail_by_id(products)
    
    # Test 2: Config
    test_config()
    
    # Test 3-5: Auth
    test_email, customer_token = test_auth_register()
    if test_email:
        test_auth_register_duplicate(test_email)
        test_auth_login_wrong_password(test_email)
    
    if customer_token:
        test_auth_me(customer_token)
    else:
        # Try to login if registration failed
        if test_email:
            customer_token = test_auth_login(test_email)
            if customer_token:
                test_auth_me(customer_token)
    
    # Test 6-7: Orders
    order_id = test_order_creation(products)
    if order_id:
        test_order_verify_bad_signature(order_id)
    
    # Test 8-13: Admin
    admin_token = test_admin_login()
    if admin_token:
        test_admin_list_products(admin_token)
        test_admin_update_product(admin_token, products)
        test_admin_stats(admin_token)
        test_admin_list_orders(admin_token)
    
    if customer_token:
        test_admin_routes_non_admin(customer_token)
    
    # Test 14: Static images
    test_static_images()
    
    # Print summary
    print_section("TEST SUMMARY")
    print(f"✅ Passed: {len(test_results['passed'])}")
    print(f"❌ Failed: {len(test_results['failed'])}")
    print(f"⚠️  Warnings: {len(test_results['warnings'])}")
    
    if test_results['failed']:
        print("\n" + "="*80)
        print("  FAILED TESTS:")
        print("="*80)
        for failure in test_results['failed']:
            print(f"  ❌ {failure}")
    
    if test_results['warnings']:
        print("\n" + "="*80)
        print("  WARNINGS:")
        print("="*80)
        for warning in test_results['warnings']:
            print(f"  ⚠️  {warning}")
    
    print("\n" + "="*80)
    print("  TEST RUN COMPLETE")
    print("="*80 + "\n")
    
    # Exit with error code if any tests failed
    if test_results['failed']:
        sys.exit(1)
    else:
        sys.exit(0)

if __name__ == "__main__":
    main()
