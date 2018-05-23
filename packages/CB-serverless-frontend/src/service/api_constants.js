const API_BASE = 'http://localhost:3000';

export const GROCERY_INFO_URL = `${API_BASE}/grocery`;
export const GROCERIES_URL = `${API_BASE}/groceries`;
export const CATEGORY_URL = `${GROCERIES_URL}?category=`;
export const CART_URL = `${API_BASE}/cart`;
export const CART_DETAILS_URL = `${API_BASE}/cartDetails`;
export const PAYMENT_URL = `${API_BASE}/pay`;
export const ORDER_URL = `${API_BASE}/createOrder`;
export const ORDER_PENDING_URL = `${API_BASE}/getOrders`;
export const ORDER_CANCEL_URL = `${API_BASE}/cancelOrder`;
