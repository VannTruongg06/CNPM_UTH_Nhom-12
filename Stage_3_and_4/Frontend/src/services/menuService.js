import { API_BASE_URL, API_ENDPOINTS, USE_MOCK_DATA } from "../config/api.js";
import { MOCK_PRODUCTS } from "../mockData.js";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Lấy dữ liệu Menu đầy đủ (Sản phẩm và Danh mục).
 * @returns {Promise<Object>} - Object chứa { products: [], categories: [] }.
 */
export const fetchMenuData = async () => {
  if (USE_MOCK_DATA) {
    console.log("Using Mock Data for Menu");
    await delay(500);
    return { products: MOCK_PRODUCTS, categories: [] };
  }

  const url = `${API_BASE_URL}${API_ENDPOINTS.MENU}`;
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
      },
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    if (data.products) return data;
    if (Array.isArray(data)) return { products: data, categories: [] };
    return { products: [], categories: [] };
  } catch (error) {
    console.error("Error fetching menu data:", error);
    return { products: [], categories: [] };
  }
};

/**
 * Lấy danh sách items (món ăn) từ API.
 * Thường dùng cho trang quản lý sản phẩm.
 * @returns {Promise<Array>} - Mảng danh sách các món ăn.
 */
export const fetchItems = async () => {
  if (USE_MOCK_DATA) {
    console.log("Using Mock Data for Items");
    await delay(500);
    return MOCK_PRODUCTS;
  }

  const url = `${API_BASE_URL}${API_ENDPOINTS.ITEMS}`;
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
      },
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();

    if (Array.isArray(data)) return data;
    if (data.results && Array.isArray(data.results)) return data.results;
    if (data.products && Array.isArray(data.products)) return data.products;

    return [];
  } catch (error) {
    console.error("Error fetching items:", error);
    return [];
  }
};

/**
 * Lưu thông tin sản phẩm (Thêm mới hoặc Cập nhật).
 * @param {Object} product - Thông tin sản phẩm.
 * @returns {Promise<Object>} - Kết quả từ server.
 */
export const saveProduct = async (product) => {
  if (USE_MOCK_DATA) {
    console.log("Mock Save Product:", product);
    await delay(500);
    return { success: true, data: product };
  }

  const token =
    localStorage.getItem("token") || localStorage.getItem("accessToken");
  const isEdit = product.isEdit && product.id;

  const baseUrl = `${API_BASE_URL}${API_ENDPOINTS.ITEMS}`;
  const url = isEdit ? `${baseUrl}${product.id}/` : baseUrl;

  const method = isEdit ? "PATCH" : "POST";
  const payload = {
    name: product.name,
    price: parseInt(product.price),
    img: product.img || product.image,
  };

  try {
    const response = await fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "ngrok-skip-browser-warning": "true",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.detail || `HTTP error! status: ${response.status}`,
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error saving product:", error);
    throw error;
  }
};

/**
 * Xóa sản phẩm theo ID.
 * @param {string|number} id - ID sản phẩm.
 * @returns {Promise<boolean>} - True nếu xóa thành công.
 */
export const deleteProduct = async (id) => {
  if (USE_MOCK_DATA) {
    console.log("Mock Delete Product ID:", id);
    await delay(300);
    return true;
  }
  const token =
    localStorage.getItem("token") || localStorage.getItem("accessToken");
  // Use centralized endpoint
  const url = `${API_BASE_URL}${API_ENDPOINTS.ITEMS}${id}/`;
  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "ngrok-skip-browser-warning": "true",
      },
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return true;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};
