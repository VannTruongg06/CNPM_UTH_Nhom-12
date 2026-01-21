import React, { useState } from "react";
import "./CartFooter.css";
import {
  submitOrder,
  formatOrderData,
  requestPayment,
} from "../../../services/orderService.js";

/**
 * Thanh tác vụ dưới cùng của màn hình Giỏ hàng.
 * Tự động chuyển đổi giữa nút "Gửi thực đơn" (nếu có món mới) 
 * và nút "Yêu cầu thanh toán" (nếu giỏ hàng trống).
 */
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

  /**
   * Gửi danh sách các món đang chọn trong giỏ hàng xuống server.
   */
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

  /**
   * Gửi thông báo yêu cầu thanh toán tới quản trị viên/thu ngân.
   */
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
      {/* Hiển thị nút Gửi thực đơn nếu có món mới, ngược lại hiển thị nút Yêu cầu thanh toán */}
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
