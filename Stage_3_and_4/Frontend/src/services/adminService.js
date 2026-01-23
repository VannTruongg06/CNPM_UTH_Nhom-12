import { API_BASE_URL, API_ENDPOINTS } from "../config/api.js";

/**
 * Lấy số liệu thống kê cho Dashboard (Doanh thu, Đơn hàng, v.v.)
 * @param {string} timeRange - Khoảng thời gian (ví dụ: 'today', 'week', 'month'). Mặc định là 'today'.
 * @returns {Promise<Object>} - Dữ liệu thống kê từ server.
 * @throws {Error} - Nếu API trả về lỗi hoặc không kết nối được.
 */
export const getDashboardStats = async (timeRange = 'today') => {
  const baseUrl = `${API_BASE_URL}${API_ENDPOINTS.DASHBOARD_STATS}`;
  // Đảm bảo URL kết thúc bằng / trước khi thêm ?range=
  const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  const url = `${cleanBaseUrl}?range=${timeRange}`;



  const token = localStorage.getItem('token') || localStorage.getItem('accessToken');

  try {
    const headers = {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "true",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      method: "GET",
      headers: headers,
      cache: "no-store",
    });

    if (!response.ok) {
        // Nếu lỗi 500, có thể do backend không hỗ trợ 'quarter' hoặc 'yesterday'
        // Chúng ta ném lỗi để hiển thị ở UI
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Server Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    throw error; 
  }
};

/**
 * Xóa một yêu cầu đặt bàn theo ID.
 * @param {string|number} id - ID của yêu cầu đặt bàn cần xóa.
 * @returns {Promise<Object>} - Kết quả từ server sau khi xóa thành công.
 * @throws {Error} - Lỗi nếu không có token, không đủ quyền, hoặc lỗi server.
 */
export const deleteBooking = async (id) => {
  const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
  
  if (!token) {
    alert("Bạn chưa đăng nhập!");
    throw new Error("No token found");
  }

  try {
    // Sử dụng endpoint cấu trúc /api/booking/delete/{id}/
    const url = `${API_BASE_URL}${API_ENDPOINTS.BOOKING_DELETE(id)}`;


    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        "ngrok-skip-browser-warning": "true",
      },
    });

    if (!response.ok) {
      if (response.status === 401) throw new Error("Hết phiên đăng nhập (Token lỗi)");
      if (response.status === 403) throw new Error("Bạn không có quyền xóa (Cần quyền Admin)");
      if (response.status === 404) throw new Error("Đơn này không tồn tại hoặc đã bị xóa");
      throw new Error(`Lỗi Server: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Lỗi xóa booking:", error);
    throw error;
  }
};

/**
 * Lấy danh sách thông báo mới nhất.
 * @returns {Promise<Array>} - Mảng các thông báo. Trả về mảng rỗng nếu lỗi.
 */
export const getNotifications = async () => {
  const url = `${API_BASE_URL}${API_ENDPOINTS.NOTIFICATIONS}`;
  try {
    const response = await fetch(url, {
      headers: {
        "ngrok-skip-browser-warning": "true",
      },
    });
    if (!response.ok) return [];
    return await response.json();
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return [];
  }
};
