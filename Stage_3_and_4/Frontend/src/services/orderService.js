import { API_BASE_URL, API_ENDPOINTS, USE_MOCK_DATA } from "../config/api.js";
import { MOCK_ORDERS, MOCK_PRODUCTS } from "../mockData.js";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Hàm định dạng dữ liệu đơn hàng
export const formatOrderData = (
  tableId,
  cart,
  notes,
  products,
  staffName = "",
) => {
  const items = Object.entries(cart).map(([productId, quantity]) => {
    const product = products.find((p) => String(p.id) === String(productId));
    return {
      product_id: parseInt(productId),
      quantity: quantity,
      price: product ? product.price : 0,
      note: notes[productId] || "",
    };
  });

  return {
    table_id: parseInt(tableId),
    items: items,
    staff_name: staffName,
    order_time: new Date().toISOString(),
  };
};

// Hàm gửi đơn hàng
export const submitOrder = async (orderData) => {
  if (USE_MOCK_DATA) {
    console.log("Mock Submit Order:", orderData);
    await delay(800);
    return { success: true, order_id: Math.floor(Math.random() * 1000) };
  }

  const url = `${API_BASE_URL}${API_ENDPOINTS.ORDER}`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "true",
    },
    body: JSON.stringify(orderData),
  });

  if (!response.ok) {
    throw new Error(`Lỗi gửi đơn hàng: ${response.status}`);
  }
  return response.json();
};

// Hàm lấy chi tiết đơn hàng cho một bàn (CẦN THIẾT CHO POS)
export const getOrderDetails = async (tableId) => {
  if (USE_MOCK_DATA) {
    await delay(500);
    // Tìm đơn hàng giả lập cho bàn này
    const order = MOCK_ORDERS.find(
      (o) => o.table === `Bàn ${tableId}` || o.tableId === tableId,
    );
    if (order) return order;

    // Nếu bàn "occupied" nhưng không thấy order trong MOCK_ORDERS, trả về một ít dữ liệu mẫu
    return {
      items: [
        {
          name: "Sushi Cá Hồi",
          price: 150000,
          quantity: 2,
          img: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=200",
        },
        {
          name: "Trà Xanh Nhật Bản",
          price: 30000,
          quantity: 1,
          img: "https://images.unsplash.com/photo-1582793988951-9aed55099991?w=200",
        },
      ],
    };
  }

  const url = `${API_BASE_URL}/api/orders/table/${tableId}/`;
  const response = await fetch(url, {
    headers: { "ngrok-skip-browser-warning": "true" },
  });
  if (!response.ok) return { items: [] };

  const data = await response.json();
  // Fix: Map itemId to id so frontend uses Product ID correctly
  if (data && data.items && Array.isArray(data.items)) {
    data.items = data.items.map((item) => ({
      ...item,
      id: item.itemId || item.id,
      orderLineId: item.id,
    }));
  }
  return data;
};

export const getOrders = async () => {
  if (USE_MOCK_DATA) {
    await delay(500);
    return MOCK_ORDERS;
  }
  return [];
};

export const requestPayment = async (tableId, tableName) => {
  if (USE_MOCK_DATA) {
    console.log(`Mock Request Payment for ${tableName}`);
    await delay(500);

    const notification = {
      id: Date.now(),
      type: "PAYMENT_REQUEST",
      tableId,
      tableName: tableName || `Bàn ${tableId}`,
      time: new Date().toLocaleTimeString(),
      status: "unread",
    };

    const existing = JSON.parse(
      localStorage.getItem("uminoo_notifications") || "[]",
    );
    localStorage.setItem(
      "uminoo_notifications",
      JSON.stringify([...existing, notification]),
    );
    window.dispatchEvent(new Event("storage"));

    return { success: true };
  }

  const url = `${API_BASE_URL}${API_ENDPOINTS.PAYMENT_REQUEST}`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "true",
    },
    body: JSON.stringify({ table_id: parseInt(tableId) }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Lỗi gửi yêu cầu: ${response.status}`);
  }

  return response.json();
};

export const checkoutTable = async (tableId, paymentMethod) => {
  const url = `${API_BASE_URL}${API_ENDPOINTS.CHECKOUT(tableId)}`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "true",
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
    body: JSON.stringify({ payment_method: paymentMethod }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Thanh toán thất bại");
  }
  return response.json();
};

export const cancelOrder = async (tableId) => {
  const url = `${API_BASE_URL}/api/orders/cancel/`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "true",
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
    body: JSON.stringify({ table_id: parseInt(tableId) }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Hủy đơn thất bại");
  }
  return response.json();
};
