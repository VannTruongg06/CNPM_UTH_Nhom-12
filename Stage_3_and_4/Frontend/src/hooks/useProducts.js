import { useState, useEffect } from "react";
import { PRODUCTS as FALLBACK_PRODUCTS } from "../Data.js";
import { fetchMenuData } from "../services/menuService.js";

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
