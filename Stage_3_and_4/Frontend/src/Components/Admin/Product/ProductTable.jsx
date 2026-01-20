import React, { useState } from "react";

const ProductTable = ({ products, onEdit, onDelete }) => {
  const [hoveredRow, setHoveredRow] = useState(null);

  return (
    <div className="prod-list-container">
      {/* Header Row */}
      <div className="list-header-row">
        <div className="header-item col-img">Hình ảnh</div>
        <div className="header-item col-code">Mã</div>
        <div className="header-item col-name">Tên hàng hóa</div>
        <div className="header-item col-group">Nhóm hàng</div>
        <div className="header-item col-price">Giá bán</div>
        <div className="header-item col-actions">Thao tác</div>
      </div>

      {/* Body List */}
      <div className="list-body">
        {products.map((item) => (
          <div
            key={item.id}
            className="prod-item-row"
            onMouseEnter={() => setHoveredRow(item.id)}
            onMouseLeave={() => setHoveredRow(null)}
          >
            <div className="row-cell col-img">
              <img
                src={item.img || item.image}
                alt={item.name}
                className="prod-thumb"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%2260%22%20height%3D%2240%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22%23eee%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20font-family%3D%22Arial%22%20font-size%3D%2210%22%20fill%3D%22%23999%22%20text-anchor%3D%22middle%22%20dy%3D%22.3em%22%3ENo%20Img%3C%2Ftext%3E%3C%2Fsvg%3E";
                }}
              />
            </div>
            <div className="row-cell col-code">SP{item.id}</div>
            <div className="row-cell col-name">{item.name}</div>
            <div className="row-cell col-group">{item.category_name || item.category}</div>
            <div className="row-cell col-price">
              {(item.price || 0).toLocaleString()}đ
            </div>
            <div className="row-cell col-actions">
              <div
                style={{
                  visibility: hoveredRow === item.id ? "visible" : "hidden",
                  display: "flex",
                  gap: "10px",
                  justifyContent: "center",
                }}
              >
                <button className="btn-action btn-edit" onClick={() => onEdit(item)}>
                  Sửa
                </button>
                <button className="btn-action btn-action-delete" onClick={() => onDelete(item.id)}>
                  Xóa
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductTable;