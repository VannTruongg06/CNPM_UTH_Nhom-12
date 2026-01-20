import React from 'react';

const BillSection = ({
  cart,
  orderedItems,
  removeItem,
  notes,
  calculateTotal,
  handleSendOrder,
  handleMainPaymentButton,
  handleCancelOrder,
  activeTab,
  loading,
  setSelectedTable,
  setCart,
  setActiveTab
}) => {
  return (
    <div className="pos-bill-section">
      <div className="pos-bill-header">
        <div className="pos-col-h-name">Mặt hàng</div>
        <div className="pos-col-h-qty">SL</div>
        <div className="pos-col-h-price">Đơn giá</div>
        <div className="pos-col-h-total">Thành tiền</div>
      </div>

      <div className="pos-bill-body">
        {/* List items new */}
        {cart.map((item) => (
          <div key={"new-" + item.id} className="pos-item-block new">
            <div className="pos-item-main">
              <img
                src={item.image || item.img || "https://via.placeholder.com/50"}
                alt={item.name}
                className="pos-item-img"
              />
              <div className="pos-item-name">{item.name}</div>
            </div>
            <div className="pos-item-qty">
              <span className="pos-qty-val">{item.qty}</span>
            </div>
            <div className="pos-item-price">
              {item.price.toLocaleString()}đ
            </div>
            <div className="pos-item-total">
              {(item.price * item.qty).toLocaleString()}đ
            </div>
            <button
              className="pos-item-remove"
              onClick={() => removeItem(item.id)}
            >
              X
            </button>
            {notes[item.id] && (
              <div className="pos-item-note" style={{ fontSize: "12px", color: "#666", gridColumn: "1 / -1", marginTop: "4px" }}>
                📝
              </div>
            )}
          </div>
        ))}
        {/* List items ordered */}
        {orderedItems.map((item, idx) => (
          <div key={"ord-" + idx} className="pos-item-block ordered">
            <div className="pos-item-main">
              <img
                src={item.image || item.img || "https://via.placeholder.com/50"}
                alt={item.name}
                className="pos-item-img"
              />
              <div className="pos-item-name">
                {item.name}{" "}
                <span className="pos-badge-ordered">Đã đặt</span>
              </div>
            </div>
            <div className="pos-item-qty">
              <span className="pos-qty-val">{item.quantity}</span>
            </div>
            <div className="pos-item-price">
              {(item.price || 0).toLocaleString()}đ
            </div>
            <div className="pos-item-total">
              {((item.price || 0) * (item.quantity || 0)).toLocaleString()}đ
            </div>
            <div className="pos-item-status">✔</div>
          </div>
        ))}
        {cart.length === 0 && orderedItems.length === 0 && (
          <div className="pos-empty-msg">Chưa có mặt hàng.</div>
        )}
      </div>

      <div className="pos-footer">
        <div className="pos-summary">
          <span>Tổng cộng ({cart.length + orderedItems.length} món)</span>
          <span className="pos-total-val">
            {calculateTotal().toLocaleString()}đ
          </span>
        </div>
        <div className="pos-actions">
          {cart.length > 0 ? (
            <button className="pos-btn-send" onClick={handleSendOrder}>
              Gửi Thực Đơn
            </button>
          ) : (
            <button
              className="pos-btn-clear"
              onClick={handleCancelOrder}
            >
              {orderedItems.length > 0 ? "Hủy Đơn" : "Xóa thực đơn"}
            </button>
          )}
          <button
            className="pos-btn-pay"
            onClick={handleMainPaymentButton}
            disabled={loading}
          >
            {activeTab === "payment"
              ? loading
                ? "..."
                : "Xác nhận & In"
              : "Thanh Toán"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BillSection;
