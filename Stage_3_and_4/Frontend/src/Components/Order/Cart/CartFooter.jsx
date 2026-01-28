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
  orderedCart,
  notes,
  products,
  tableId,
  tableNumber,
  staffName,
  onOrderSuccess,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const hasItems = Object.keys(cart).length > 0;
  const hasOrderedItems = orderedCart && Object.keys(orderedCart).length > 0;

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

    // Hàm thực hiện gửi đơn hàng lên Backend
    const performSubmit = async (lat = null, lon = null) => {
      try {
        setIsSubmitting(true);
        const orderData = formatOrderData(
          tableId,
          cart,
          notes,
          products,
          staffName,
        );

        // Gửi tọa độ kèm đơn hàng luôn (Backend sẽ tự check khoảng cách)
        await submitOrder(orderData, lat, lon);

        alert("Đã gửi đơn hàng thành công!");
        if (onOrderSuccess) onOrderSuccess();
      } catch (error) {
        // Hiển thị lỗi từ Backend (ví dụ: "Bạn đang ở quá xa")
        alert("Lỗi: " + error.message);
      } finally {
        setIsSubmitting(false);
      }
    };

    // NẾU LÀ NHÂN VIÊN GỌI (Có staffName) -> KHÔNG CẦN GPS
    if (staffName) {
      await performSubmit();
      return;
    }

    // NẾU LÀ KHÁCH HÀNG -> BẮT BUỘC LẤY VỊ TRÍ
    if (!navigator.geolocation) {
      alert(
        "Trình duyệt của bạn không hỗ trợ định vị. Vui lòng liên hệ nhân viên!",
      );
      return;
    }

    setIsSubmitting(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        await performSubmit(latitude, longitude);
      },
      (error) => {
        setIsSubmitting(false);
        if (error.code === error.PERMISSION_DENIED) {
          alert(
            " Bạn đã chặn quyền truy cập vị trí!\nVui lòng bấm vào biểu tượng ổ khóa 🔒 trên thanh địa chỉ -> Bật 'Location' (Vị trí) lên để đặt món.",
          );
        } else {
          alert(
            "Không thể lấy vị trí. Vui lòng bật GPS trên điện thoại và thử lại.",
          );
        }
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  /**
   * Gửi thông báo yêu cầu thanh toán tới quản trị viên/thu ngân.
   */
  const handleRequestPayment = async () => {
    if (!hasOrderedItems) {
      alert("Bàn chưa có món đã gọi. Không thể yêu cầu thanh toán!");
      return;
    }
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
          disabled={!hasOrderedItems}
          style={{ opacity: hasOrderedItems ? 1 : 0.5 }}
        >
          Yêu cầu thanh toán
        </button>
      )}
    </div>
  );
};

export default CartFooter;
