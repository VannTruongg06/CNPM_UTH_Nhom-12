import React from "react";
import "./CartHeader.css";

const CartHeader = ({ onGoToMenu, tableNumber, onBack }) => {
  return (
    <div className="cart__header">
      <div 
        className="cart__header-desk" 
        onClick={onBack}
        style={{ cursor: onBack ? 'pointer' : 'default' }}
      >
        {tableNumber || "Chưa chọn bàn"}
      </div>
      <div className="cart__header-action" style={{ position: "relative" }}>
        <button className="cart__header-button" onClick={onGoToMenu}>
          Thực đơn
        </button>
      </div>
    </div>
  );
};

export default CartHeader;
