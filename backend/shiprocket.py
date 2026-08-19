"""Shiprocket integration for Venus 3D Creations.

Handles authentication, order creation and AWB assignment.
Token is cached in-memory for 9 days (Shiprocket tokens live 10 days).
"""
import os
import time
import logging
from typing import Optional, List, Dict, Any
import requests

logger = logging.getLogger(__name__)

BASE_URL = "https://apiv2.shiprocket.in/v1/external"

SR_EMAIL = os.environ.get("SHIPROCKET_EMAIL", "")
SR_PASSWORD = os.environ.get("SHIPROCKET_PASSWORD", "")
SR_PICKUP_LOCATION = os.environ.get("SHIPROCKET_PICKUP_LOCATION", "Primary")
SR_DEFAULT_WEIGHT = float(os.environ.get("SHIPROCKET_DEFAULT_WEIGHT_KG", "1.5"))
SR_DEFAULT_L = float(os.environ.get("SHIPROCKET_DEFAULT_LENGTH_CM", "25"))
SR_DEFAULT_B = float(os.environ.get("SHIPROCKET_DEFAULT_BREADTH_CM", "25"))
SR_DEFAULT_H = float(os.environ.get("SHIPROCKET_DEFAULT_HEIGHT_CM", "40"))
SR_AUTO_SHIP = os.environ.get("SHIPROCKET_AUTO_SHIP", "true").lower() == "true"


class ShiprocketError(Exception):
    pass


_token_cache = {"token": None, "expires_at": 0}


def _is_configured() -> bool:
    return bool(SR_EMAIL and SR_PASSWORD)


def _get_token(force: bool = False) -> str:
    if not _is_configured():
        raise ShiprocketError("Shiprocket credentials not configured")
    now = time.time()
    if not force and _token_cache["token"] and now < _token_cache["expires_at"]:
        return _token_cache["token"]
    r = requests.post(
        f"{BASE_URL}/auth/login",
        json={"email": SR_EMAIL, "password": SR_PASSWORD},
        timeout=15,
    )
    if r.status_code != 200:
        raise ShiprocketError(f"Shiprocket auth failed: {r.status_code} {r.text[:200]}")
    data = r.json()
    token = data.get("token")
    if not token:
        raise ShiprocketError(f"Shiprocket auth returned no token: {data}")
    _token_cache["token"] = token
    _token_cache["expires_at"] = now + 9 * 24 * 3600  # 9 days
    logger.info("Shiprocket token refreshed")
    return token


def _headers() -> Dict[str, str]:
    return {"Authorization": f"Bearer {_get_token()}", "Content-Type": "application/json"}


def list_pickup_locations() -> List[Dict[str, Any]]:
    """Return list of pickup locations available on the account."""
    r = requests.get(f"{BASE_URL}/settings/company/pickup", headers=_headers(), timeout=15)
    if r.status_code != 200:
        raise ShiprocketError(f"Failed to fetch pickup locations: {r.status_code} {r.text[:200]}")
    data = r.json()
    return data.get("data", {}).get("shipping_address", []) or []


def _build_order_payload(order: Dict[str, Any]) -> Dict[str, Any]:
    """Convert a Venus Order document into Shiprocket's create-order payload."""
    addr = order["address"]
    items = order["items"]
    order_items = [
        {
            "name": it["name"],
            "sku": it["product_id"][:32],
            "units": it["qty"],
            "selling_price": str(it["price"]),
        }
        for it in items
    ]
    # Split full_name into first + last
    name_parts = addr["full_name"].strip().split(maxsplit=1)
    first_name = name_parts[0]
    last_name = name_parts[1] if len(name_parts) > 1 else "."

    return {
        "order_id": order["id"][:32],  # Shiprocket max 50 but keep short
        "order_date": order["created_at"].strftime("%Y-%m-%d %H:%M") if hasattr(order["created_at"], "strftime") else str(order["created_at"])[:16].replace("T", " "),
        "pickup_location": SR_PICKUP_LOCATION,
        "billing_customer_name": first_name,
        "billing_last_name": last_name,
        "billing_address": addr["line1"],
        "billing_address_2": addr.get("line2") or "",
        "billing_city": addr["city"],
        "billing_pincode": addr["pincode"],
        "billing_state": addr["state"],
        "billing_country": addr.get("country", "India"),
        "billing_email": order["email"],
        "billing_phone": addr["phone"],
        "shipping_is_billing": True,
        "order_items": order_items,
        "payment_method": "Prepaid",
        "sub_total": float(order["subtotal"]),
        "length": SR_DEFAULT_L,
        "breadth": SR_DEFAULT_B,
        "height": SR_DEFAULT_H,
        "weight": SR_DEFAULT_WEIGHT,
    }


def create_shipment(order: Dict[str, Any]) -> Dict[str, Any]:
    """Create a Shiprocket order and assign the cheapest AWB.
    Returns dict with: shiprocket_order_id, shipment_id, awb_code, courier_name, tracking_url.
    """
    if not _is_configured():
        raise ShiprocketError("Shiprocket credentials not configured")

    payload = _build_order_payload(order)
    r = requests.post(
        f"{BASE_URL}/orders/create/adhoc",
        headers=_headers(),
        json=payload,
        timeout=20,
    )
    if r.status_code == 401:
        # Token expired mid-flight; retry once
        _get_token(force=True)
        r = requests.post(f"{BASE_URL}/orders/create/adhoc", headers=_headers(), json=payload, timeout=20)
    if r.status_code not in (200, 201):
        raise ShiprocketError(f"Order create failed: {r.status_code} {r.text[:500]}")
    data = r.json()
    sr_order_id = data.get("order_id")
    shipment_id = data.get("shipment_id")
    if not shipment_id:
        raise ShiprocketError(f"No shipment_id returned: {data}")

    # Assign AWB (cheapest courier)
    awb_code = None
    courier_name = None
    try:
        awb_r = requests.post(
            f"{BASE_URL}/courier/assign/awb",
            headers=_headers(),
            json={"shipment_id": shipment_id},
            timeout=20,
        )
        if awb_r.status_code in (200, 201):
            awb_data = awb_r.json().get("response", {}).get("data") or awb_r.json().get("data") or {}
            awb_code = awb_data.get("awb_code")
            courier_name = awb_data.get("courier_name")
        else:
            logger.warning(f"AWB assign returned {awb_r.status_code}: {awb_r.text[:200]}")
    except Exception as e:
        logger.warning(f"AWB assign failed: {e}")

    tracking_url = f"https://shiprocket.co/tracking/{awb_code}" if awb_code else None

    return {
        "shiprocket_order_id": sr_order_id,
        "shipment_id": shipment_id,
        "awb_code": awb_code,
        "courier_name": courier_name,
        "tracking_url": tracking_url,
    }
