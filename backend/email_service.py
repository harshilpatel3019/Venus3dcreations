import os
import smtplib
import logging
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Optional

logger = logging.getLogger(__name__)

GMAIL_USER = os.environ.get("GMAIL_USER", "")
GMAIL_PASS = os.environ.get("GMAIL_APP_PASSWORD", "")
ADMIN_EMAIL = os.environ.get("ADMIN_EMAIL", "")


def _send(to_email: str, subject: str, html: str) -> bool:
    if not GMAIL_USER or not GMAIL_PASS:
        logger.info(f"[EMAIL SKIPPED] to={to_email} subject={subject} (Gmail not configured)")
        return False
    try:
        msg = MIMEMultipart("alternative")
        msg["From"] = f"Venus 3D Creations <{GMAIL_USER}>"
        msg["To"] = to_email
        msg["Subject"] = subject
        msg.attach(MIMEText(html, "html"))
        with smtplib.SMTP_SSL("smtp.gmail.com", 465, timeout=15) as server:
            server.login(GMAIL_USER, GMAIL_PASS)
            server.sendmail(GMAIL_USER, [to_email], msg.as_string())
        logger.info(f"[EMAIL SENT] to={to_email} subject={subject}")
        return True
    except Exception as e:
        logger.error(f"[EMAIL FAILED] to={to_email}: {e}")
        return False


def _order_rows(items):
    rows = ""
    for it in items:
        rows += (
            f"<tr><td style='padding:12px;border-bottom:1px solid #eee'>{it['name']}</td>"
            f"<td style='padding:12px;border-bottom:1px solid #eee;text-align:center'>{it['qty']}</td>"
            f"<td style='padding:12px;border-bottom:1px solid #eee;text-align:right'>&#8377; {it['price']*it['qty']:,.2f}</td></tr>"
        )
    return rows


def send_order_confirmation(order: dict) -> bool:
    addr = order["address"]
    html = f"""
    <div style="font-family:Georgia,serif;max-width:640px;margin:0 auto;background:#FAF7F2;padding:40px 32px;color:#2A1D14">
      <div style="text-align:center;padding-bottom:24px;border-bottom:1px solid #E8DFD1">
        <h1 style="font-family:'Cormorant Garamond',Georgia,serif;font-weight:500;font-size:32px;margin:0;color:#A87456">Venus 3D Creations</h1>
        <p style="letter-spacing:3px;text-transform:uppercase;font-size:11px;color:#2A1D14;margin-top:8px">Order Confirmed</p>
      </div>
      <p style="font-size:16px;margin-top:32px">Dear {addr['full_name']},</p>
      <p style="line-height:1.7">Thank you for your order. Every piece is made-to-order in our studio and hand-finished before it ships. Your confirmation details are below.</p>
      <p style="font-size:13px;color:#A87456;letter-spacing:2px;text-transform:uppercase;margin-top:32px">Order #{order['id'][:8].upper()}</p>
      <table style="width:100%;border-collapse:collapse;margin-top:12px">
        <thead><tr>
          <th style="text-align:left;padding:12px;border-bottom:2px solid #2A1D14;font-size:11px;letter-spacing:2px">ITEM</th>
          <th style="text-align:center;padding:12px;border-bottom:2px solid #2A1D14;font-size:11px;letter-spacing:2px">QTY</th>
          <th style="text-align:right;padding:12px;border-bottom:2px solid #2A1D14;font-size:11px;letter-spacing:2px">TOTAL</th>
        </tr></thead>
        <tbody>{_order_rows(order['items'])}</tbody>
      </table>
      <table style="width:100%;margin-top:16px">
        <tr><td style="padding:6px 12px;color:#666">Subtotal</td><td style="padding:6px 12px;text-align:right">&#8377; {order['subtotal']:,.2f}</td></tr>
        <tr><td style="padding:6px 12px;color:#666">Shipping</td><td style="padding:6px 12px;text-align:right">{'Complimentary' if order['shipping']==0 else '&#8377; ' + format(order['shipping'], ',.2f')}</td></tr>
        <tr><td style="padding:12px;font-size:18px;font-family:'Cormorant Garamond',Georgia,serif;border-top:1px solid #E8DFD1">Total</td><td style="padding:12px;text-align:right;font-size:20px;font-family:'Cormorant Garamond',Georgia,serif;border-top:1px solid #E8DFD1">&#8377; {order['total']:,.2f}</td></tr>
      </table>
      <div style="margin-top:32px;padding:20px;background:#fff;border:1px solid #E8DFD1">
        <p style="font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#A87456;margin:0 0 8px">Shipping to</p>
        <p style="margin:0;line-height:1.6">{addr['full_name']}<br>{addr['line1']}{', ' + addr['line2'] if addr.get('line2') else ''}<br>{addr['city']}, {addr['state']} {addr['pincode']}<br>{addr['country']}<br>{addr['phone']}</p>
      </div>
      <p style="margin-top:32px;line-height:1.7">We'll email you again once your piece ships. If you have any questions, simply reply to this email.</p>
      <p style="margin-top:24px;font-style:italic;color:#A87456">— The Venus Studio</p>
      <div style="text-align:center;margin-top:40px;padding-top:24px;border-top:1px solid #E8DFD1;font-size:11px;color:#999;letter-spacing:2px;text-transform:uppercase">Venus 3D Creations · Made with care</div>
    </div>
    """
    return _send(order["email"], f"Order Confirmed — Venus 3D Creations #{order['id'][:8].upper()}", html)


def send_admin_order_notification(order: dict) -> bool:
    if not ADMIN_EMAIL:
        return False
    addr = order["address"]
    html = f"""
    <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;padding:24px">
      <h2 style="color:#A87456">New order received</h2>
      <p><strong>Order ID:</strong> {order['id']}<br>
         <strong>Customer:</strong> {addr['full_name']} &lt;{order['email']}&gt;<br>
         <strong>Phone:</strong> {addr['phone']}<br>
         <strong>Total:</strong> &#8377; {order['total']:,.2f} ({order['status']})</p>
      <table style="width:100%;border-collapse:collapse;margin-top:12px">
        <thead><tr><th style="text-align:left;padding:8px;border-bottom:1px solid #ccc">Item</th><th>Qty</th><th style="text-align:right">Total</th></tr></thead>
        <tbody>{_order_rows(order['items'])}</tbody>
      </table>
      <p style="margin-top:20px"><strong>Ship to:</strong><br>
        {addr['line1']}{', ' + addr['line2'] if addr.get('line2') else ''}<br>
        {addr['city']}, {addr['state']} {addr['pincode']}, {addr['country']}
      </p>
      {('<p><strong>Notes:</strong> ' + order['notes'] + '</p>') if order.get('notes') else ''}
    </div>
    """
    return _send(ADMIN_EMAIL, f"[Venus] New order — &#8377; {order['total']:,.0f}", html)
