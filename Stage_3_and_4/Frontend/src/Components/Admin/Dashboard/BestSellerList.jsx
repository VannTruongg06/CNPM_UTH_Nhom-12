import React from "react";
import { API_BASE_URL } from "../../../config/api";

const BestSellerList = ({ topItems, formatMoney }) => {
  const getImageUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http") || path.startsWith("data:")) return path;
    if (path.startsWith("/")) return `${API_BASE_URL}${path}`;
    return path;
  };

  return (
    <div className="panel-section">
      <div className="panel-header">
        <h3>🔥 Món bán chạy</h3>
      </div>
      <div className="best-seller-list">
        {topItems.length > 0 ? (
          topItems.map((item, index) => (
            <div key={index} className={`seller-item rank-${index + 1}`}>
              <div className="seller-rank">{index + 1}</div>
              <div className="seller-img">
                <img
                  src={getImageUrl(item.image || item.img)}
                  alt={item.name}
                  onError={(e) => (e.target.style.display = "none")}
                />
              </div>
              <div className="seller-info">
                <div className="seller-name">{item.name}</div>
                <div className="seller-price">{formatMoney(item.price)}</div>
              </div>
              <div className="seller-stats">
                <span className="sold-count">{item.sold_count}</span>
                <span className="sold-label">đã bán</span>
              </div>
            </div>
          ))
        ) : (
          <div style={{ padding: "20px", textAlign: "center", color: "#666" }}>
            Chưa có dữ liệu món bán chạy
          </div>
        )}
      </div>
    </div>
  );
};

export default BestSellerList;
