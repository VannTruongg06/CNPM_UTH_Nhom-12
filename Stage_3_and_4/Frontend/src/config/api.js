// API Configuration
export const API_BASE_URL = "https://kyson-wearish-myung.ngrok-free.dev";

export const API_ENDPOINTS = {
  MENU: "/api/menu/",
  TABLES: "/api/tables/",
  ITEMS: "/api/items/",
  CATEGORIES: "/api/categories/",
  ORDER: "/api/orders/create/",
  DASHBOARD_STATS: "/api/dashboard/stats/",
  BOOKING_CREATE: "/api/booking/create/",
  BOOKING_DELETE: (id) => `/api/booking/delete/${id}/`,
  CHECKOUT: (id) => `/api/tables/${id}/checkout/`,
  PAYMENT_REQUEST: "/api/tables/request-payment/",
  NOTIFICATIONS: "/api/notifications/",
};

export const USE_MOCK_DATA = false;
