import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API_BASE = `${BACKEND_URL}/api`;

export const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("venus_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Turn `/api/static/...` (backend-relative) into a full URL for <img src>.
export const imgUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${BACKEND_URL}${path}`;
};

export const formatINR = (n) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

// Public
export const fetchProducts = (params = {}) => api.get("/products", { params }).then((r) => r.data);
export const fetchProduct = (id) => api.get(`/products/${id}`).then((r) => r.data);
export const fetchConfig = () => api.get("/config").then((r) => r.data);

// Auth
export const registerApi = (payload) => api.post("/auth/register", payload).then((r) => r.data);
export const loginApi = (payload) => api.post("/auth/login", payload).then((r) => r.data);
export const meApi = () => api.get("/auth/me").then((r) => r.data);

// Orders
export const createOrderApi = (payload) => api.post("/orders", payload).then((r) => r.data);
export const verifyPaymentApi = (payload) => api.post("/orders/verify", payload).then((r) => r.data);
export const getOrderApi = (id) => api.get(`/orders/${id}`).then((r) => r.data);
export const myOrdersApi = () => api.get("/my/orders").then((r) => r.data);

// Admin
export const adminListProducts = () => api.get("/admin/products").then((r) => r.data);
export const adminCreateProduct = (p) => api.post("/admin/products", p).then((r) => r.data);
export const adminUpdateProduct = (id, p) => api.patch(`/admin/products/${id}`, p).then((r) => r.data);
export const adminDeleteProduct = (id) => api.delete(`/admin/products/${id}`).then((r) => r.data);
export const adminListOrders = () => api.get("/admin/orders").then((r) => r.data);
export const adminUpdateOrder = (id, body) => api.patch(`/admin/orders/${id}`, body).then((r) => r.data);
export const adminStats = () => api.get("/admin/stats").then((r) => r.data);
export const adminUpload = (file) => {
  const fd = new FormData();
  fd.append("file", file);
  return api.post("/admin/upload", fd, { headers: { "Content-Type": "multipart/form-data" } }).then((r) => r.data);
};
