import React, { useState } from "react";
import "./CartFooter.css";
import {
  submitOrder,
  formatOrderData,
  requestPayment,
} from "../../../services/orderService.js";

const CartFooter = ({
  cart,
  notes,
  products,
  tableId,
  tableNumber,
  staffName,
  onOrderSuccess,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const hasItems = Object.keys(cart).length > 0;

  const handleSubmitOrder = async () => {
    if (!hasItems) {
      alert("Vui lòng chọn món trước khi gửi!");
      return;
    }
    if (!tableId) {
      alert("Không tìm thấy thông tin bàn. Vui lòng quét lại mã QR!");
      return;
    }
    try {
      setIsSubmitting(true);
      const orderData = formatOrderData(
        tableId,
        cart,
        notes,
        products,
        staffName
      );
      await submitOrder(orderData);
      alert("Đã gửi đơn hàng thành công!");
      if (onOrderSuccess) onOrderSuccess();
    } catch (error) {
      alert("Lỗi: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRequestPayment = async () => {
    if (!tableId) {
      alert("Không tìm thấy thông tin bàn. Vui lòng quét lại mã QR!");
      return;
    }
    try {
      await requestPayment(tableId, tableNumber || `Bàn ${tableId}`);
      alert("Yêu cầu thanh toán đã được gửi! Nhân viên sẽ đến ngay.");
    } catch (error) {
      alert("Lỗi gửi yêu cầu: " + error.message);
    }
  };

  return (
    <div className="cartFooter cartFooter--fixed">
      {hasItems ? (
        <button
          className="cartFooter__action-btn btn-send-order"
          onClick={handleSubmitOrder}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Đang gửi..." : "Gửi thực đơn"}
        </button>
      ) : (
        <button
          className="cartFooter__action-btn btn-request-payment"
          onClick={handleRequestPayment}
        >
          Yêu cầu thanh toán
        </button>
      )}
    </div>
  );
};

export default CartFooter;
