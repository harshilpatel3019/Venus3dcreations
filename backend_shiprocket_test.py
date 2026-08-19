#!/usr/bin/env python3
"""
Shiprocket Integration Test Suite for Venus 3D Creations
Tests the new Shiprocket auto-push feature without creating real paid orders.
"""
import sys
import os
import requests
import json
from datetime import datetime
from pathlib import Path
from dotenv import load_dotenv

# Load backend .env before importing modules
backend_dir = Path('/app/backend')
load_dotenv(backend_dir / '.env')

# Add backend to path for imports
sys.path.insert(0, '/app/backend')

BASE_URL = "https://venus-v2.preview.emergentagent.com/api"
ADMIN_EMAIL = "venus3dcreations@gmail.com"
ADMIN_PASSWORD = "venus@admin2025"

def print_test(name):
    print(f"\n{'='*80}")
    print(f"TEST: {name}")
    print('='*80)

def print_pass(msg):
    print(f"✅ PASS: {msg}")

def print_fail(msg):
    print(f"❌ FAIL: {msg}")
    
def print_info(msg):
    print(f"ℹ️  INFO: {msg}")

# ============================================================================
# TEST 1: Pickup locations endpoint (safe, read-only)
# ============================================================================
def test_pickup_locations():
    print_test("TEST 1: Pickup locations endpoint (safe, read-only)")
    
    # Login as admin
    print_info("Logging in as admin...")
    login_resp = requests.post(
        f"{BASE_URL}/auth/login",
        json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD},
        timeout=15
    )
    
    if login_resp.status_code != 200:
        print_fail(f"Admin login failed: {login_resp.status_code} {login_resp.text}")
        return False
    
    token = login_resp.json()["access_token"]
    print_pass(f"Admin login successful, token: {token[:20]}...")
    
    # GET pickup locations
    print_info("Fetching pickup locations...")
    headers = {"Authorization": f"Bearer {token}"}
    resp = requests.get(
        f"{BASE_URL}/admin/shiprocket/pickup-locations",
        headers=headers,
        timeout=15
    )
    
    if resp.status_code != 200:
        print_fail(f"Pickup locations endpoint failed: {resp.status_code} {resp.text}")
        return False
    
    data = resp.json()
    print_pass(f"Pickup locations endpoint returned HTTP 200")
    print_info(f"Response: {json.dumps(data, indent=2)}")
    
    # Verify response structure
    if "current" not in data:
        print_fail("Response missing 'current' field")
        return False
    
    if data["current"] != "Home":
        print_fail(f"Expected current='Home', got '{data['current']}'")
        return False
    
    print_pass(f"Current pickup location: {data['current']}")
    
    if "locations" not in data:
        print_fail("Response missing 'locations' field")
        return False
    
    if not isinstance(data["locations"], list):
        print_fail("'locations' is not a list")
        return False
    
    if len(data["locations"]) == 0:
        print_fail("No pickup locations returned")
        return False
    
    print_pass(f"Found {len(data['locations'])} pickup location(s)")
    
    # Check if "Home" is in the locations
    home_found = False
    for loc in data["locations"]:
        if loc.get("nickname") == "Home":
            home_found = True
            print_pass(f"Found 'Home' location: {loc.get('address')}, {loc.get('city')}, {loc.get('pin_code')}")
            break
    
    if not home_found:
        print_fail("'Home' location not found in locations list")
        return False
    
    print_pass("TEST 1 PASSED: Pickup locations endpoint working correctly")
    return True


# ============================================================================
# TEST 2: Admin auth required for shiprocket endpoints
# ============================================================================
def test_admin_auth_required():
    print_test("TEST 2: Admin auth required for shiprocket endpoints")
    
    # Try GET pickup-locations without token
    print_info("Trying GET /api/admin/shiprocket/pickup-locations without token...")
    resp = requests.get(
        f"{BASE_URL}/admin/shiprocket/pickup-locations",
        timeout=15
    )
    
    if resp.status_code != 401:
        print_fail(f"Expected 401, got {resp.status_code}")
        return False
    
    print_pass("GET /api/admin/shiprocket/pickup-locations without token correctly returns 401")
    
    # Try POST ship without token
    print_info("Trying POST /api/admin/orders/some-id/ship without token...")
    resp = requests.post(
        f"{BASE_URL}/admin/orders/some-id/ship",
        timeout=15
    )
    
    if resp.status_code != 401:
        print_fail(f"Expected 401, got {resp.status_code}")
        return False
    
    print_pass("POST /api/admin/orders/some-id/ship without token correctly returns 401")
    
    print_pass("TEST 2 PASSED: Admin auth required for shiprocket endpoints")
    return True


# ============================================================================
# TEST 3: Manual ship endpoint validation
# ============================================================================
def test_manual_ship_validation():
    print_test("TEST 3: Manual ship endpoint validation")
    
    # Login as admin
    print_info("Logging in as admin...")
    login_resp = requests.post(
        f"{BASE_URL}/auth/login",
        json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD},
        timeout=15
    )
    
    if login_resp.status_code != 200:
        print_fail(f"Admin login failed: {login_resp.status_code}")
        return False
    
    token = login_resp.json()["access_token"]
    print_pass("Admin login successful")
    
    # Try to ship nonexistent order
    print_info("Trying to ship nonexistent order...")
    headers = {"Authorization": f"Bearer {token}"}
    resp = requests.post(
        f"{BASE_URL}/admin/orders/nonexistent-order-id-12345/ship",
        headers=headers,
        timeout=15
    )
    
    if resp.status_code != 404:
        print_fail(f"Expected 404, got {resp.status_code}: {resp.text}")
        return False
    
    print_pass("POST /api/admin/orders/nonexistent-id/ship correctly returns 404")
    
    print_pass("TEST 3 PASSED: Manual ship endpoint validation working")
    return True


# ============================================================================
# TEST 4: Verify Shiprocket module code integrity (do NOT actually push)
# ============================================================================
def test_shiprocket_module_integrity():
    print_test("TEST 4: Verify Shiprocket module code integrity")
    
    try:
        # Import shiprocket module
        print_info("Importing shiprocket module...")
        import shiprocket as sr
        print_pass("shiprocket module imported successfully")
        
        # Check if configured
        print_info("Checking if Shiprocket is configured...")
        is_configured = sr._is_configured()
        if not is_configured:
            print_fail("Shiprocket is not configured (missing email or password)")
            return False
        print_pass("Shiprocket is configured (email and password present)")
        
        # Get token (this will make a real auth call but won't create orders)
        print_info("Testing Shiprocket authentication...")
        token = sr._get_token()
        if not token:
            print_fail("Failed to get Shiprocket token")
            return False
        
        if not token.startswith("eyJ"):
            print_fail(f"Token doesn't look like JWT (doesn't start with 'eyJ'): {token[:20]}")
            return False
        
        print_pass(f"Shiprocket auth successful, token: {token[:30]}... (JWT format confirmed)")
        
        # Check configuration values
        print_info("Verifying configuration values...")
        
        if sr.SR_PICKUP_LOCATION != "Home":
            print_fail(f"Expected SR_PICKUP_LOCATION='Home', got '{sr.SR_PICKUP_LOCATION}'")
            return False
        print_pass(f"SR_PICKUP_LOCATION = 'Home' ✓")
        
        if sr.SR_AUTO_SHIP != True:
            print_fail(f"Expected SR_AUTO_SHIP=True, got {sr.SR_AUTO_SHIP}")
            return False
        print_pass(f"SR_AUTO_SHIP = True ✓")
        
        if sr.SR_DEFAULT_WEIGHT != 1.5:
            print_fail(f"Expected weight=1.5, got {sr.SR_DEFAULT_WEIGHT}")
            return False
        print_pass(f"SR_DEFAULT_WEIGHT = 1.5 kg ✓")
        
        if sr.SR_DEFAULT_L != 25.0:
            print_fail(f"Expected length=25, got {sr.SR_DEFAULT_L}")
            return False
        print_pass(f"SR_DEFAULT_LENGTH = 25 cm ✓")
        
        if sr.SR_DEFAULT_B != 25.0:
            print_fail(f"Expected breadth=25, got {sr.SR_DEFAULT_B}")
            return False
        print_pass(f"SR_DEFAULT_BREADTH = 25 cm ✓")
        
        if sr.SR_DEFAULT_H != 40.0:
            print_fail(f"Expected height=40, got {sr.SR_DEFAULT_H}")
            return False
        print_pass(f"SR_DEFAULT_HEIGHT = 40 cm ✓")
        
        # Test payload building
        print_info("Testing order payload building...")
        sample_order = {
            "id": "test-order-1",
            "created_at": "2026-01-01T10:00:00",
            "email": "test@example.com",
            "address": {
                "full_name": "Ravi Kumar",
                "phone": "9999999999",
                "line1": "1 Test Street",
                "line2": "",
                "city": "Ahmedabad",
                "state": "Gujarat",
                "pincode": "380001",
                "country": "India"
            },
            "items": [
                {
                    "product_id": "p1",
                    "name": "Wavy Lamp",
                    "price": 1899,
                    "qty": 1
                }
            ],
            "subtotal": 1899
        }
        
        payload = sr._build_order_payload(sample_order)
        print_info(f"Generated payload: {json.dumps(payload, indent=2)}")
        
        # Verify payload structure
        required_fields = [
            "order_id", "order_date", "pickup_location",
            "billing_customer_name", "billing_last_name", "billing_address",
            "billing_city", "billing_pincode", "billing_state", "billing_country",
            "billing_email", "billing_phone", "shipping_is_billing",
            "order_items", "payment_method", "sub_total",
            "length", "breadth", "height", "weight"
        ]
        
        for field in required_fields:
            if field not in payload:
                print_fail(f"Payload missing required field: {field}")
                return False
        
        print_pass("Payload has all required fields")
        
        # Verify specific values
        if payload["pickup_location"] != "Home":
            print_fail(f"Payload pickup_location should be 'Home', got '{payload['pickup_location']}'")
            return False
        print_pass("Payload pickup_location = 'Home' ✓")
        
        if payload["payment_method"] != "Prepaid":
            print_fail(f"Payload payment_method should be 'Prepaid', got '{payload['payment_method']}'")
            return False
        print_pass("Payload payment_method = 'Prepaid' ✓")
        
        if payload["billing_customer_name"] != "Ravi":
            print_fail(f"Expected billing_customer_name='Ravi', got '{payload['billing_customer_name']}'")
            return False
        print_pass("Payload billing_customer_name = 'Ravi' ✓")
        
        if payload["billing_last_name"] != "Kumar":
            print_fail(f"Expected billing_last_name='Kumar', got '{payload['billing_last_name']}'")
            return False
        print_pass("Payload billing_last_name = 'Kumar' ✓")
        
        if payload["weight"] != 1.5:
            print_fail(f"Payload weight should be 1.5, got {payload['weight']}")
            return False
        print_pass("Payload weight = 1.5 kg ✓")
        
        if payload["length"] != 25.0:
            print_fail(f"Payload length should be 25, got {payload['length']}")
            return False
        print_pass("Payload length = 25 cm ✓")
        
        if payload["breadth"] != 25.0:
            print_fail(f"Payload breadth should be 25, got {payload['breadth']}")
            return False
        print_pass("Payload breadth = 25 cm ✓")
        
        if payload["height"] != 40.0:
            print_fail(f"Payload height should be 40, got {payload['height']}")
            return False
        print_pass("Payload height = 40 cm ✓")
        
        if len(payload["order_items"]) != 1:
            print_fail(f"Expected 1 order item, got {len(payload['order_items'])}")
            return False
        
        item = payload["order_items"][0]
        if item["name"] != "Wavy Lamp":
            print_fail(f"Expected item name='Wavy Lamp', got '{item['name']}'")
            return False
        if item["sku"] != "p1":
            print_fail(f"Expected item sku='p1', got '{item['sku']}'")
            return False
        if item["units"] != 1:
            print_fail(f"Expected item units=1, got {item['units']}")
            return False
        if item["selling_price"] != "1899":
            print_fail(f"Expected item selling_price='1899', got '{item['selling_price']}'")
            return False
        
        print_pass("Payload order_items correctly formatted ✓")
        
        print_pass("TEST 4 PASSED: Shiprocket module code integrity verified")
        return True
        
    except Exception as e:
        print_fail(f"Exception during module integrity test: {e}")
        import traceback
        traceback.print_exc()
        return False


# ============================================================================
# TEST 5: Order model has new shipping fields
# ============================================================================
def test_order_model_fields():
    print_test("TEST 5: Order model has new shipping fields")
    
    try:
        print_info("Importing models module...")
        from models import Order
        print_pass("models module imported successfully")
        
        # Check if Order model has Shiprocket fields
        print_info("Checking Order model for Shiprocket fields...")
        
        # Create a sample order to inspect fields
        sample_order = Order(
            email="test@example.com",
            items=[],
            address={
                "full_name": "Test User",
                "phone": "1234567890",
                "line1": "Test",
                "city": "Test",
                "state": "Test",
                "pincode": "123456"
            },
            subtotal=100,
            total=100
        )
        
        order_dict = sample_order.model_dump()
        
        required_fields = [
            "shiprocket_order_id",
            "shipment_id",
            "awb_code",
            "courier_name",
            "tracking_url",
            "ship_error"
        ]
        
        for field in required_fields:
            if field not in order_dict:
                print_fail(f"Order model missing field: {field}")
                return False
            print_pass(f"Order model has field: {field} ✓")
        
        print_pass("TEST 5 PASSED: Order model has all Shiprocket fields")
        return True
        
    except Exception as e:
        print_fail(f"Exception during model field test: {e}")
        import traceback
        traceback.print_exc()
        return False


# ============================================================================
# TEST 6: Backend health (regression check)
# ============================================================================
def test_backend_health():
    print_test("TEST 6: Backend health (regression check)")
    
    # Test GET /api/products
    print_info("Testing GET /api/products...")
    resp = requests.get(f"{BASE_URL}/products", timeout=15)
    
    if resp.status_code != 200:
        print_fail(f"GET /api/products failed: {resp.status_code}")
        return False
    
    products = resp.json()
    if len(products) != 9:
        print_fail(f"Expected 9 products, got {len(products)}")
        return False
    
    print_pass(f"GET /api/products returns 9 products ✓")
    
    # Test GET /api/config
    print_info("Testing GET /api/config...")
    resp = requests.get(f"{BASE_URL}/config", timeout=15)
    
    if resp.status_code != 200:
        print_fail(f"GET /api/config failed: {resp.status_code}")
        return False
    
    config = resp.json()
    if "razorpay_key_id" not in config:
        print_fail("Config missing razorpay_key_id")
        return False
    
    if "currency" not in config:
        print_fail("Config missing currency")
        return False
    
    if config["currency"] != "INR":
        print_fail(f"Expected currency='INR', got '{config['currency']}'")
        return False
    
    print_pass(f"GET /api/config returns razorpay_key_id and currency=INR ✓")
    
    print_pass("TEST 6 PASSED: Backend health check passed (no regression)")
    return True


# ============================================================================
# Main test runner
# ============================================================================
def main():
    print("\n" + "="*80)
    print("SHIPROCKET INTEGRATION TEST SUITE")
    print("Venus 3D Creations - Backend Testing")
    print("="*80)
    
    results = {}
    
    # Run all tests
    results["TEST 1: Pickup locations endpoint"] = test_pickup_locations()
    results["TEST 2: Admin auth required"] = test_admin_auth_required()
    results["TEST 3: Manual ship validation"] = test_manual_ship_validation()
    results["TEST 4: Shiprocket module integrity"] = test_shiprocket_module_integrity()
    results["TEST 5: Order model fields"] = test_order_model_fields()
    results["TEST 6: Backend health"] = test_backend_health()
    
    # Summary
    print("\n" + "="*80)
    print("TEST SUMMARY")
    print("="*80)
    
    passed = 0
    failed = 0
    
    for test_name, result in results.items():
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status}: {test_name}")
        if result:
            passed += 1
        else:
            failed += 1
    
    print("\n" + "="*80)
    print(f"TOTAL: {passed} passed, {failed} failed out of {len(results)} tests")
    print("="*80)
    
    if failed == 0:
        print("\n🎉 ALL TESTS PASSED! Shiprocket integration is working correctly.")
        return 0
    else:
        print(f"\n⚠️  {failed} test(s) failed. Please review the failures above.")
        return 1


if __name__ == "__main__":
    sys.exit(main())
