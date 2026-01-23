import { API_BASE_URL, USE_MOCK_DATA } from "../config/api.js";
import { MOCK_EMPLOYEES } from "../mockData.js";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Lấy danh sách nhân viên.
 * @returns {Promise<Array>} - Mảng danh sách nhân viên.
 * @throws {Error} - Nếu không tải được danh sách.
 */
export const getEmployees = async () => {
  if (USE_MOCK_DATA) {
    await delay(500);
    return MOCK_EMPLOYEES;
  }
  const token = localStorage.getItem("token");
  const url = `${API_BASE_URL}/api/employees/`;
  const response = await fetch(url, {
    headers: {
      "ngrok-skip-browser-warning": "true",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error("Lỗi tải danh sách nhân viên");
  return response.json();
};

/**
 * Lưu thông tin nhân viên (Thêm mới hoặc Cập nhật).
 * @param {Object} employee - Object nhân viên. Nếu có id là cập nhật, ngược lại là thêm mới.
 * @returns {Promise<Object>} - Kết quả từ API.
 */
export const saveEmployee = async (employee) => {
  if (USE_MOCK_DATA) {

    await delay(500);
    return { success: true, data: employee };
  }

  const token = localStorage.getItem("token");
  const isEdit = employee.id;
  const url = isEdit
    ? `${API_BASE_URL}/api/employees/${employee.id}/`
    : `${API_BASE_URL}/api/employees/`;

  const method = isEdit ? "PUT" : "POST";
  const response = await fetch(url, {
    method: method,
    headers: {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "true",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(employee),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("API Error Response:", errorText);
    try {
      const errorData = JSON.parse(errorText);
      throw new Error(errorData.error || `Lỗi: ${response.status}`);
    } catch (e) {
      throw new Error(`Lỗi Server (${response.status}): ${errorText.slice(0, 100)}...`);
    }
  }
  return response.json();
};

/**
 * Xóa nhân viên theo ID.
 * @param {string|number} id - ID nhân viên cần xóa.
 * @returns {Promise<boolean>} - True nếu thành công.
 */
export const deleteEmployee = async (id) => {
  if (USE_MOCK_DATA) {

    await delay(300);
    return true;
  }

  const token = localStorage.getItem("token");
  const url = `${API_BASE_URL}/api/employees/${id}/`;
  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      "ngrok-skip-browser-warning": "true",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Lỗi xóa nhân viên");
  }
  return true;
};