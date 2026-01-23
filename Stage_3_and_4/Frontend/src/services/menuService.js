import { API_BASE_URL, API_ENDPOINTS, USE_MOCK_DATA } from "../config/api.js";
import { MOCK_PRODUCTS } from "../mockData.js";

// Hàm giả lập delay mạng để test UI
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Lấy dữ liệu Menu đầy đủ (Sản phẩm và Danh mục).
 * Logic: Gọi API /api/items/, chuẩn hóa đường dẫn ảnh và tự động trích xuất danh mục từ sản phẩm.
 * @returns {Promise<Object>} - Object chứa { products: [], categories: [] }.
 */
export const fetchMenuData = async () => {
  if (USE_MOCK_DATA) {
    await delay(500);
    return { products: MOCK_PRODUCTS, categories: [] };
  }

  // GỌI API GỐC /api/items/ ĐỂ ĐỒNG BỘ DỮ LIỆU VỚI ADMIN
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

    const rawData = await response.json();
    let productList = [];
    if (Array.isArray(rawData)) productList = rawData;
    else if (rawData.results) productList = rawData.results;

    // Chuẩn hóa dữ liệu: Xử lý đường dẫn ảnh tuyệt đối và map lại tên danh mục
    const processedProducts = productList.map((p) => {
      let imageUrl = p.img || p.image || "";
      // Nếu ảnh là đường dẫn tương đối, nối thêm domain của Backend
      if (imageUrl && imageUrl.startsWith("/")) {
        imageUrl = `${API_BASE_URL}${imageUrl}`;
      }
      return {
        ...p,
        category: p.category_name || p.category || "Khác",
        img: imageUrl,
      };
    });

    // Tự động tạo danh sách danh mục duy nhất từ các sản phẩm đã tải
    const categories = [
      ...new Set(processedProducts.map((p) => p.category)),
    ].filter(Boolean);

    return { products: processedProducts, categories: categories };
  } catch (error) {
    console.error("Error fetching menu data:", error);
    return { products: [], categories: [] };
  }
};

/**
 * Lấy danh sách hàng hóa (items) dành cho trang quản lý Admin.
 * @returns {Promise<Array>} - Mảng danh sách các món ăn.
 */
export const fetchItems = async () => {
  const token = localStorage.getItem("token") || localStorage.getItem("accessToken");
  const url = `${API_BASE_URL}${API_ENDPOINTS.ITEMS}`;
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "ngrok-skip-browser-warning": "true",
      },
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return Array.isArray(data) ? data : data.results || [];
  } catch (error) {
    console.error("Error fetching items:", error);
    return [];
  }
};

/**
 * Lưu thông tin món ăn (Thêm mới hoặc Cập nhật).
 * @param {Object} product - Thông tin sản phẩm từ Form.
 * @returns {Promise<Object>} - Kết quả từ Backend.
 */
export const saveProduct = async (product) => {
  if (USE_MOCK_DATA) {
    await delay(500);
    return { success: true, data: product };
  }

  const token = localStorage.getItem("token") || localStorage.getItem("accessToken");
  const isEdit = product.isEdit && product.id;

  const baseUrl = `${API_BASE_URL}${API_ENDPOINTS.ITEMS}`;
  const url = isEdit ? `${baseUrl}${product.id}/` : baseUrl;

  const method = isEdit ? "PATCH" : "POST";
  
  // Format payload theo đúng yêu cầu của Backend Django
  const payload = {
    name: product.name,
    price: parseInt(product.price),
    category: product.group || product.category,
    image: product.image || product.img, 
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
      const errorMessage = errorData.detail || JSON.stringify(errorData);
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    console.error("Error saving product:", error);
    throw error;
  }
};

/**
 * Xóa một món ăn khỏi hệ thống theo ID.
 * @param {number|string} id - ID của món ăn cần xóa.
 * @returns {Promise<boolean>} - Trả về true nếu xóa thành công.
 */
export const deleteProduct = async (id) => {
  if (USE_MOCK_DATA) {
    await delay(300);
    return true;
  }
  const token = localStorage.getItem("token") || localStorage.getItem("accessToken");
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
