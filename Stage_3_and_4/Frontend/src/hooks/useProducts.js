import { useState, useEffect } from "react";
import { MOCK_PRODUCTS as FALLBACK_PRODUCTS } from "../mockData.js";
import { fetchMenuData } from "../services/menuService.js";

/**
 * Hook lấy danh sách sản phẩm để hiển thị Menu cho Client.
 * Tự động fallback về dữ liệu mẫu (Data.js) nếu API lỗi.
 */
export const useProducts = () => {
  const [products, setProducts] = useState(FALLBACK_PRODUCTS);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchMenuData();
        if (data && data.products) {
          setProducts(data.products);
        } else if (Array.isArray(data)) {
          setProducts(data);
        }
      } catch (e) {
        console.error("Lỗi tải menu:", e);
      }
    };
    loadProducts();
  }, []);

  return { products };
};
