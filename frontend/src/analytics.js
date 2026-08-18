// Lightweight GA4 helper. gtag() is injected in public/index.html.

const gtag = (...args) => {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag(...args);
  }
};

export const trackPageView = (path, title) => {
  gtag("event", "page_view", {
    page_path: path,
    page_title: title || document.title,
    page_location: window.location.href,
  });
};

export const trackViewItem = (product) => {
  gtag("event", "view_item", {
    currency: "INR",
    value: product.price,
    items: [
      {
        item_id: product.id,
        item_name: product.name,
        item_category: product.category,
        price: product.price,
        quantity: 1,
      },
    ],
  });
};

export const trackAddToCart = (product, qty = 1) => {
  gtag("event", "add_to_cart", {
    currency: "INR",
    value: product.price * qty,
    items: [
      {
        item_id: product.id,
        item_name: product.name,
        item_category: product.category,
        price: product.price,
        quantity: qty,
      },
    ],
  });
};

export const trackBeginCheckout = (items, subtotal) => {
  gtag("event", "begin_checkout", {
    currency: "INR",
    value: subtotal,
    items: items.map((i) => ({
      item_id: i.id,
      item_name: i.name,
      price: i.price,
      quantity: i.qty,
    })),
  });
};

export const trackPurchase = (order) => {
  gtag("event", "purchase", {
    transaction_id: order.id,
    currency: order.currency || "INR",
    value: order.total,
    shipping: order.shipping || 0,
    items: (order.items || []).map((i) => ({
      item_id: i.product_id,
      item_name: i.name,
      price: i.price,
      quantity: i.qty,
    })),
  });
};

export const trackSignUp = (method = "email") => {
  gtag("event", "sign_up", { method });
};

export const trackLogin = (method = "email") => {
  gtag("event", "login", { method });
};
