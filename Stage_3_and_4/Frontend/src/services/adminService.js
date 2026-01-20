import { API_BASE_URL, API_ENDPOINTS } from "../config/api.js";

// Hàm lấy thống kê Dashboard từ API
export const getDashboardStats = async (timeRange = 'today') => {
  const baseUrl = `${API_BASE_URL}${API_ENDPOINTS.DASHBOARD_STATS}`;
  // Đảm bảo URL kết thúc bằng / trước khi thêm ?range=
  const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  const url = `${cleanBaseUrl}?range=${timeRange}`;

  console.log(`Fetching Dashboard Stats: ${url}`);

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

// Hàm xóa một yêu cầu đặt bàn - CẬP NHẬT THEO MẪU MỚI
export const deleteBooking = async (id) => {
  const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
  
  if (!token) {
    alert("Bạn chưa đăng nhập!");
    throw new Error("No token found");
  }

  try {
    // Sử dụng endpoint cấu trúc /api/booking/delete/{id}/
    const url = `${API_BASE_URL}${API_ENDPOINTS.BOOKING_DELETE(id)}`;
    console.log(`Deleting booking at: ${url}`);

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
