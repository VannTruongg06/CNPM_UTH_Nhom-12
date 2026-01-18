import React from "react";
import "./CartBody.css";

const CartBody = ({ cart, orderedCart = {}, products, updateCart, notes }) => {
  const removeItem = (id) => {
    const currentQty = cart[id] || 0;
    const newQty = currentQty - 1;
    if (newQty <= 0) {
      const { [id]: _, ...rest } = cart;
      updateCart(rest);
    } else {
      updateCart({ ...cart, [id]: newQty });
    }
  };

  // Tính tổng tiền (bao gồm món đang chọn và món đã đặt)
  const calculateTotal = (itemsMap) => {
    return Object.entries(itemsMap).reduce((sum, [id, qty]) => {
      const product = products.find((p) => p.id === parseInt(id));
      return sum + (product ? product.price * qty : 0);
    }, 0);
  };

  const totalNew = calculateTotal(cart);
  const totalOrdered = calculateTotal(orderedCart);
  const grandTotal = totalNew + totalOrdered;

  const renderItem = (id, qty, isOrdered) => {
    const item = products.find((p) => p.id === parseInt(id));
    if (!item) return null;

    return (
      <div
        key={`${isOrdered ? "ord" : "new"}-${id}`}
        className="cart-item"
        style={{
          borderLeft: isOrdered ? "4px solid #4caf50" : "4px solid #2196f3",
        }}
      >
        <img src={item.img} alt={item.name} className="cart-item-img" />
        <div className="cart-item-info">
          <h4>
            {item.name}{" "}
            {isOrdered && (
              <span
                style={{
                  fontSize: "1.3rem",
                  color: "#4caf50",
                  backgroundColor: "#e8f5e9",
                  padding: "2px 6px",
                  borderRadius: "10px",
                }}
              >
                Đã đặt
              </span>
            )}
          </h4>
          <p>{item.price.toLocaleString()} VND</p>
          <p>Số lượng: {qty}</p>
          {notes[id] && <p className="cart-item-note">Ghi chú: {notes[id]}</p>}
        </div>
        {!isOrdered && (
          <button className="cart-item-remove" onClick={() => removeItem(id)}>
            X
          </button>
        )}
      </div>
    );
  };

  const hasNewItems = Object.keys(cart).length > 0;
  const hasOrderedItems = Object.keys(orderedCart).length > 0;

  return (
    <div style={{ height: "100%", overflowY: "auto", paddingBottom: "100px" }}>
      {/* 1. Món mới đang chọn */}
      {hasNewItems && (
        <div className="cart__section">
          <h3
            style={{
              padding: "10px 0px 0px 10px",
              fontSize: "1.3rem",
              color: "#2196f3",
            }}
          >
            Món đang chọn
          </h3>
          <div className="cart__body-items">
            {Object.entries(cart).map(([id, qty]) =>
              renderItem(id, qty, false)
            )}
          </div>
        </div>
      )}

      {/* 2. Món đã gửi bếp */}
      {hasOrderedItems && (
        <div className="cart__section">
          <h3
            style={{
              padding: "10px 0px 0px 10px",
              fontSize: "1.3rem",
              color: "#4caf50",
            }}
          >
            Món đã đặt
          </h3>
          <div className="cart__body-items">
            {Object.entries(orderedCart).map(([id, qty]) =>
              renderItem(id, qty, true)
            )}
          </div>
        </div>
      )}

      {!hasNewItems && !hasOrderedItems && (
        <div className="cart__body-binding">
          <p className="cart__body-desc">
            Chưa có mặt hàng nào trong danh sách.
          </p>
        </div>
      )}

      <div className="cart__body-total">
        <p>
          Tổng cộng (
          {Object.keys(cart).length + Object.keys(orderedCart).length} món)
        </p>
        <p id="totalMoney">{grandTotal.toLocaleString()} đ</p>
      </div>
    </div>
  );
};

export default CartBody;
