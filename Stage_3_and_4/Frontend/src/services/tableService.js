import { API_BASE_URL, API_ENDPOINTS, USE_MOCK_DATA } from "../config/api.js";
import { MOCK_TABLES } from "../mockData.js";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchTables = async () => {
  if (USE_MOCK_DATA) {
    await delay(400);
    return MOCK_TABLES;
  }
  const url = `${API_BASE_URL}${API_ENDPOINTS.TABLES}`;
  const response = await fetch(url, {
    headers: { "ngrok-skip-browser-warning": "true" }
  });
  if (!response.ok) throw new Error("Lỗi tải danh sách bàn");
  return response.json();
};

export const getTableById = async (id) => {
  if (USE_MOCK_DATA) {
    await delay(200);
    // Tìm bàn trong dữ liệu mock
    const table = MOCK_TABLES.find(t => String(t.id) === String(id));
    return table || { id: id, name: `Bàn ${id}`, number: `Bàn ${id}`, status: "available" };
  }
  
  const url = `${API_BASE_URL}/api/tables/${id}/`;
  const response = await fetch(url, {
    headers: { "ngrok-skip-browser-warning": "true" }
  });
  if (!response.ok) return null;
  return response.json();
};