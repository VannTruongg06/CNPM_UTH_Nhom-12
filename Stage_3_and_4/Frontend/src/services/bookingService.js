import { API_BASE_URL, API_ENDPOINTS, USE_MOCK_DATA } from "../config/api.js";
import { MOCK_BOOKINGS } from "../mockData.js";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Tạo mới một yêu cầu đặt bàn.
 * Hỗ trợ chế độ Mock Data để test UI mà không cần Backend.
 * 
 * @param {Object} bookingData - Thông tin đặt bàn (name, phone, time, people, note, ...).
 * @returns {Promise<Object>} - Phản hồi từ server hoặc dữ liệu giả lập.
 */
export const createBooking = async (bookingData) => {
  if (USE_MOCK_DATA) {

    await delay(800);
    
    // Lưu vào danh sách đặt bàn ảo trong localStorage
    const localBookings = JSON.parse(localStorage.getItem("uminoo_bookings") || "[]");
    const newBooking = { ...bookingData, id: Date.now(), status: "pending" };
    localStorage.setItem("uminoo_bookings", JSON.stringify([newBooking, ...localBookings]));
    
    // Bắn thông báo về Admin
    const notification = {
      id: Date.now(),
      type: "BOOKING_REQUEST",
      tableName: bookingData.name,
      message: `đặt bàn vào ${bookingData.time}`,
      status: "unread"
    };
    const existingNotifs = JSON.parse(localStorage.getItem("uminoo_notifications") || "[]");
    localStorage.setItem("uminoo_notifications", JSON.stringify([...existingNotifs, notification]));
    window.dispatchEvent(new Event("storage"));
    
    return { success: true };
  }

  const url = `${API_BASE_URL}${API_ENDPOINTS.BOOKING_CREATE}`;
  const response = await fetch(url, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "true" 
    },
    body: JSON.stringify(bookingData)
  });
  return response.json();
};

/**
 * Lấy danh sách tất cả các đơn đặt bàn.
 * 
 * @returns {Promise<Array>} - Mảng chứa các đơn đặt bàn.
 */
export const fetchBookings = async () => {
  if (USE_MOCK_DATA) {
    await delay(500);
    const localBookings = JSON.parse(localStorage.getItem("uminoo_bookings") || "[]");
    // Gộp dữ liệu mặc định và dữ liệu từ localStorage
    return [...localBookings, ...MOCK_BOOKINGS];
  }
  // URL giả định cho backend
  const response = await fetch(`${API_BASE_URL}/api/bookings/`, {
    headers: { "ngrok-skip-browser-warning": "true" }
  });
};