import { API_BASE_URL, API_ENDPOINTS, USE_MOCK_DATA } from "../config/api.js";
import { MOCK_PRODUCTS } from "../mockData.js";

// Hàm giả lập delay mạng
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchMenuData = async () => {
  if (USE_MOCK_DATA) {
    console.log("Using Mock Data for Menu");
    await delay(500);
    // Trả về format mà các component đang kỳ vọng
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

export const saveProduct = async (product) => {
  if (USE_MOCK_DATA) {
    console.log("Mock Save Product:", product);
    await delay(500);
    return { success: true, data: product };
  }

  const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
  const isEdit = product.isEdit && product.id;
  
  // Use centralized endpoint
  const baseUrl = `${API_BASE_URL}${API_ENDPOINTS.ITEMS}`;
  const url = isEdit
    ? `${baseUrl}${product.id}/`
    : baseUrl;

  const method = isEdit ? "PATCH" : "POST";
  const payload = {
    name: product.name,
    price: parseInt(product.price),
    // Fix: Prioritize 'img' from input, fallback to 'image' if needed
    img: product.img || product.image, 
  };

  try {
    const response = await fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        "ngrok-skip-browser-warning": "true",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error saving product:", error);
    throw error;
  }
};

export const deleteProduct = async (id) => {
  if (USE_MOCK_DATA) {
    console.log("Mock Delete Product ID:", id);
    await delay(300);
    return true;
  }
  const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
  // Use centralized endpoint
  const url = `${API_BASE_URL}${API_ENDPOINTS.ITEMS}${id}/`;
  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
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
