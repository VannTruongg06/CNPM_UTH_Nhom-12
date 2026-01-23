// Menu.jsx
import React, { useState, useEffect } from "react";
import "./Menu.css";
import logo from "../../../assets/images/Uminoo-logo.png";

// Data giả lập (fallback)
import {
  MOCK_PRODUCTS as FALLBACK_PRODUCTS,
  MOCK_CATEGORIES as FALLBACK_CATEGORIES,
} from "../../../mockData.js";
import { fetchMenuData } from "../../../services/menuService.js";

/**
 * Màn hình Thực đơn (Menu) dành cho khách hàng chọn món.
 * Bao gồm lọc theo danh mục, tăng giảm số lượng và thêm ghi chú cho từng món.
 */
const Menu = ({ onBack, cart, updateCart, notes, updateNotes }) => {
  const [activeCategory, setActiveCategory] = useState("Tất cả");
  const [showNoteInput, setShowNoteInput] = useState({}); // State để ẩn/hiện ô nhập ghi chú
  const [products, setProducts] = useState(FALLBACK_PRODUCTS); // Danh sách sản phẩm từ API
  const [categories, setCategories] = useState(FALLBACK_CATEGORIES); // Danh sách danh mục từ API
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Tải dữ liệu thực đơn khi vào trang
  useEffect(() => {
    const loadMenuData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchMenuData();



        // Xử lý dữ liệu sản phẩm
        if (data.products && Array.isArray(data.products)) {
          setProducts(data.products);

        } else {
          console.warn("No products in response or products is not an array");
        }

        // Xử lý dữ liệu danh mục
        if (data.categories && Array.isArray(data.categories)) {
          setCategories(["Tất cả", ...data.categories]);

        } else if (data.products && Array.isArray(data.products)) {
          // Tự động tạo danh mục từ products nếu backend không trả về mảng categories riêng
          const uniqueCategories = [
            ...new Set(data.products.map((p) => p.category).filter(Boolean)),
          ];
          setCategories(["Tất cả", ...uniqueCategories]);

        } else {
          console.warn("No categories found and cannot generate from products");
        }

        setError(null);
      } catch (err) {
        console.error("Failed to load menu data:", err);
        const errorMessage =
          err.message ||
          "Không thể tải dữ liệu menu. Đang sử dụng dữ liệu mặc định.";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadMenuData();
  }, []);

  /**
   * Cập nhật ghi chú cho một món ăn cụ thể.
   */
  const updateNote = (id, note) => {
    updateNotes({ ...notes, [id]: note });
  };

  /**
   * Ẩn/Hiện ô nhập ghi chú của món ăn.
   */
  const toggleNoteInput = (id) => {
    setShowNoteInput((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  /**
   * Tăng hoặc giảm số lượng món ăn trong giỏ hàng.
   * Nếu số lượng về 0, món ăn sẽ bị xóa khỏi giỏ.
   */
  const updateQuantity = (id, delta) => {
    const currentQty = cart[id] || 0;
    const newQty = currentQty + delta;
    if (newQty <= 0) {
      const { [id]: _, ...rest } = cart; // Xoá món nếu về 0
      updateCart(rest);
    } else {
      updateCart({ ...cart, [id]: newQty });
    }
  };

  const totalItems = Object.values(cart).reduce((a, b) => a + b, 0);

  return (
    <div className="menu-screen">
      {/* 1. Header */}
      <div className="menu-header">
        <div className="cart__header-action" style={{ position: "relative" }}>
          {/* 3. Gắn sự kiện onClick vào nút */}
          <button className="btn-back" onClick={onBack}>
            Quay lại
          </button>
          {/* back menu */}
        </div>
        <div className="logo-area">
          {/* logo Uminoo */}
          <img src={logo} alt="Logo Uminoo" />
        </div>
      </div>

      {/* 2. Danh mục (Categories) */}
      <div className="category-bar">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`cat-item ${activeCategory === cat ? "active" : ""}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Loading state */}
      {loading && (
        <div style={{ padding: "20px", textAlign: "center" }}>
          <p>Đang tải menu...</p>
        </div>
      )}

      {/* Error message */}
      {error && !loading && (
        <div style={{ padding: "10px", textAlign: "center", color: "orange" }}>
          <p>{error}</p>
        </div>
      )}

      {/* 3. Danh sách món (Product List) */}
      <div className="product-list">
        {!loading &&
          products
            .filter(
              (product) =>
                activeCategory === "Tất cả" ||
                product.category === activeCategory
            )
            .map((product) => {
              const quantity = cart[product.id] || 0;
              const isSelected = quantity > 0;

              return (
                <div
                  key={product.id}
                  className={`product-card ${isSelected ? "selected" : ""}`}
                  onClick={() => !isSelected && updateQuantity(product.id, 1)}
                >
                  {isSelected ? (
                    <div className="card-content">
                      <img
                        src={product.img}
                        alt={product.name}
                        className="prod-img"
                      />
                      <div className="prod-info">
                        <h3 className="prod-name">{product.name}</h3>
                        <p className="prod-price">
                          {product.price.toLocaleString()} VND
                        </p>
                      </div>
                      <div className="qty-control">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            updateQuantity(product.id, -1);
                          }}
                        >
                          -
                        </button>
                        <span>{quantity}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            updateQuantity(product.id, 1);
                          }}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="card-content">
                      <img
                        src={product.img}
                        alt={product.name}
                        className="prod-img"
                      />
                      <div className="prod-info">
                        <h3 className="prod-name">{product.name}</h3>
                        <p className="prod-price">
                          {product.price.toLocaleString()} VND
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Phần Ghi chú chỉ hiện khi đã chọn món */}
                  {isSelected && (
                    <div className="card-footer">
                      <button
                        className="note-btn"
                        onClick={() => toggleNoteInput(product.id)}
                      >
                        📝 Ghi Chú {notes[product.id] ? "(Có)" : ""}
                      </button>
                      {showNoteInput[product.id] && (
                        <input
                          type="text"
                          className="note-input"
                          placeholder="Nhập ghi chú..."
                          value={notes[product.id] || ""}
                          onChange={(e) =>
                            updateNote(product.id, e.target.value)
                          }
                        />
                      )}
                    </div>
                  )}
                </div>
              );
            })}
        {/* Khoảng trống để không bị footer che mất món cuối */}
        <div style={{ height: "80px" }}></div>
      </div>

      {/* 4. Footer Floating Bar */}
      {totalItems > 0 && (
        <div className="floating-footer">
          <button className="btn-checkout" onClick={onBack}>
            Chọn {totalItems} món
          </button>
        </div>
      )}
    </div>
  );
};

export default Menu;
