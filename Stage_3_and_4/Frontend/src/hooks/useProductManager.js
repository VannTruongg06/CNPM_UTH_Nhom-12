import { useState, useEffect } from "react";
import {
  fetchMenuData,
  saveProduct,
  deleteProduct as apiDeleteProduct,
} from "../services/menuService";

export const useProductManager = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    group: "Sushi",
    price: 0,
    image: "https://via.placeholder.com/80",
    isEdit: false,
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await fetchMenuData();
      if (data) {
        if (data.products) setProducts(data.products);
        if (data.categories && data.categories.length > 0) {
          setCategories(data.categories.map((c) => c.name || c));
        } else if (data.products) {
          const uniqueGroups = [
            ...new Set(data.products.map((p) => p.category)),
          ].filter(Boolean);
          setCategories(uniqueGroups);
        }
      }
    } catch (error) {
      console.error("Lỗi tải hàng hóa:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddNew = () => {
    setFormData({
      id: Date.now(),
      name: "",
      group: categories[0] || "Khác",
      price: 0,
      image: "",
      isEdit: false,
    });
    setIsFormOpen(true);
  };

  const handleEdit = (item) => {
    setFormData({
      id: item.id,
      name: item.name,
      group: item.category,
      price: item.price,
      image: item.img,
      isEdit: true,
    });
    setIsFormOpen(true);
  };

  const handleSave = async (dataToSave) => {
    const productPayload = {
      id: dataToSave.id,
      name: dataToSave.name,
      category: dataToSave.group,
      price: parseInt(dataToSave.price),
      img: dataToSave.image,
    };

    try {
      const result = await saveProduct(productPayload);
      if (result) {
        alert(dataToSave.isEdit ? "Cập nhật thành công!" : "Thêm mới thành công!");
        setIsFormOpen(false);
        loadData();
      }
    } catch (error) {
      console.error("Lỗi lưu:", error);
      alert(`Lỗi: ${error.message}`);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa món này?")) {
      try {
        await apiDeleteProduct(id);
        loadData();
      } catch (error) {
        console.error("Lỗi xóa:", error);
      }
    }
  };

  return {
    products,
    categories,
    loading,
    isFormOpen,
    setIsFormOpen,
    formData,
    setFormData,
    handleAddNew,
    handleEdit,
    handleSave,
    handleDelete,
  };
};
