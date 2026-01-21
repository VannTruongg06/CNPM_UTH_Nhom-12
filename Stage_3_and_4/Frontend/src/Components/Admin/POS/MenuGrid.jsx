import React from 'react';

/**
 * Component hiển thị danh sách thực đơn lọc theo danh mục cho POS.
 */
const MenuGrid = ({ 
  categories, // Danh sách các nhóm món ăn (Sushi, Drink, ...)
  selectedCategory, // Danh mục đang được chọn
  setSelectedCategory, // Hàm thay đổi danh mục lọc
  filteredProducts, // Danh sách sản phẩm đã được lọc
  cart, // Giỏ hàng tạm hiện tại
  updateCardQty, // Hàm tăng/giảm số lượng món
  notes, // State ghi chú
  setNotes // Hàm cập nhật ghi chú
}) => {
  return (
    <div className="pos-menu-container">
      <div className="pos-menu-cats">
        {categories.map((cat, idx) => (
          <button
            key={idx}
            className={`pos-cat-pill ${selectedCategory === cat ? "active" : ""}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>
      <div className="pos-menu-list">
        {filteredProducts.map((prod) => {
          const qty = cart.find((x) => x.id === prod.id)?.qty || 0;
          const isSelected = qty > 0;
          return (
            <div
              key={prod.id}
              className={`pos-menu-card ${isSelected ? "selected" : ""}`}
            >
              <div
                className="pos-menu-card-row"
                onClick={() => !isSelected && updateCardQty(prod, 1)}
              >
                <img
                  src={prod.image || prod.img}
                  alt={prod.name}
                  className="pos-menu-img"
                />
                <div className="pos-menu-info">
                  <div className="pos-menu-name">{prod.name}</div>
                  <div className="pos-menu-price">
                    {(prod.price || 0).toLocaleString()}đ
                  </div>
                </div>
                {isSelected && (
                  <div className="pos-menu-controls" onClick={(e) => e.stopPropagation()} style={{ display: "flex", flexDirection: "column", gap: "5px", alignItems: "flex-end" }}>
                    <div className="pos-menu-qty-control">
                      <button onClick={() => updateCardQty(prod, -1)}>-</button>
                      <span>{qty}</span>
                      <button onClick={() => updateCardQty(prod, 1)}>+</button>
                    </div>
                    <input
                      type="text"
                      placeholder="Ghi chú..."
                      value={notes[prod.id] || ""}
                      onChange={(e) => setNotes({ ...notes, [prod.id]: e.target.value })}
                      style={{ width: "80px", fontSize: "11px", padding: "2px 5px", border: "1px solid #ccc", borderRadius: "3px" }}
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MenuGrid;
