import React, { useState, useEffect } from "react";
import "./ProductManager.css";
import {
  fetchItems,
  saveProduct,
  deleteProduct,
} from "../../services/menuService";
import ProductTable from "../../Components/Admin/Product/ProductTable";
import ProductForm from "../../Components/Admin/Product/ProductForm";

/**
 * Trang Quản lý hàng hóa (Món ăn) dành cho Admin.
 * Cho phép xem danh sách, thêm mới, sửa và xóa các món ăn trong thực đơn.
 */
const ProductManager = () => {
  // Trạng thái hiển thị (Danh sách món ăn hoặc Form nhập liệu)
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Lưu trữ dữ liệu tạm thời khi người dùng nhập trên Form
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    group: "Sushi",
    price: 0,
    image: "",
    isEdit: false,
  });

  /**
   * Tải danh sách món ăn từ API và cập nhật state.
   */
  const loadData = async () => {
    try {
      setLoading(true);
      const data = await fetchItems();

      if (Array.isArray(data)) {
        setProducts(data);
        // Trích xuất danh sách các nhóm món ăn duy nhất hiện có
        const uniqueGroups = [
          ...new Set(data.map((p) => p.category_name || p.category)),
        ].filter(Boolean);
        setCategories(uniqueGroups);
      }
    } catch (error) {
      console.error("Lỗi tải hàng hóa:", error);
    } finally {
      setLoading(false);
    }
  };

  // Tải dữ liệu lần đầu khi vào trang
  useEffect(() => {
    loadData();
  }, []);

  /**
   * Xử lý lưu thông tin sản phẩm từ Form xuống Backend.
   */
  const handleSave = async (dataToSave) => {
    const cleanPrice = dataToSave.price ? parseInt(dataToSave.price) : 0;

    // Ràng buộc giá trị tối đa để phù hợp với kiểu dữ liệu của Database
    if (cleanPrice > 2000000000) {
      alert("Giá quá lớn! Vui lòng nhập giá nhỏ hơn 2 tỷ VNĐ.");
      return;
    }

    const productPayload = {
      id: dataToSave.isEdit ? dataToSave.id : null,
      name: dataToSave.name,
      category: dataToSave.group,
      price: isNaN(cleanPrice) ? 0 : cleanPrice,
      img: dataToSave.image,
      isEdit: dataToSave.isEdit,
    };

    try {
      await saveProduct(productPayload);
      alert(
        dataToSave.isEdit
          ? "Cập nhật hàng hóa thành công!"
          : "Thêm hàng hóa mới thành công!",
      );
      setIsFormOpen(false);
      loadData(); // Tải lại danh sách sau khi lưu
    } catch (error) {
      alert("Lỗi khi lưu hàng hóa: " + error.message);
    }
  };

  /**
   * Chuẩn bị dữ liệu và mở Form để chỉnh sửa một món ăn.
   */
  const handleEdit = (item) => {
    setFormData({
      id: item.id,
      name: item.name,
      group: item.category_name || item.category || "Sushi",
      price: item.price,
      image: item.img || "",
      isEdit: true,
    });
    setIsFormOpen(true);
  };

  /**
   * Thực hiện xóa món ăn sau khi người dùng xác nhận.
   */
  const handleDelete = async (id) => {
    if (window.confirm("Xóa món này?")) {
      try {
        await deleteProduct(id);
        // Cập nhật giao diện ngay lập tức mà không cần tải lại toàn bộ
        setProducts(products.filter((p) => p.id !== id));
        alert("Đã xóa thành công!");
      } catch (error) {
        alert("Lỗi khi xóa hàng hóa: " + error.message);
      }
    }
  };

  /**
   * Mở Form trống để thêm món ăn mới.
   */
  const handleAddNew = () => {
    setFormData({
      id: "",
      name: "",
      group: categories[0] || "Khác",
      price: 0,
      image: "",
      isEdit: false,
    });
    setIsFormOpen(true);
  };

  return (
    <div className={`prod-container ${isFormOpen ? "bg-red" : "bg-gray"}`}>
      <div className="prod-header-bar">
        <h2 className="prod-title">
          {isFormOpen
            ? formData.isEdit
              ? "Cập nhật hàng hóa"
              : "Thêm hàng hóa mới"
            : "Quản lý hàng hóa"}
        </h2>
        {!isFormOpen ? (
          <button className="btn-add-prod" onClick={handleAddNew}>
            {" "}
            + Thêm hàng hóa{" "}
          </button>
        ) : (
          <button
            className="btn-back btn-back-admin"
            onClick={() => setIsFormOpen(false)}
          >
            Quay lại
          </button>
        )}
      </div>

      <div className="prod-body-wrapper">
        {loading ? (
          <div
            style={{
              textAlign: "center",
              padding: "50px",
              color: "#fff",
              fontWeight: "bold",
            }}
          >
            Đang tải dữ liệu...
          </div>
        ) : isFormOpen ? (
          <ProductForm
            formData={formData}
            setFormData={setFormData}
            categories={categories}
            onSave={handleSave}
          />
        ) : (
          <ProductTable
            products={products}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
};

export default ProductManager;
