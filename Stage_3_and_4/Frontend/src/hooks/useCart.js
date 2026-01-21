import { useState } from "react";

/**
 * Hook quản lý giỏ hàng của khách hàng.
 * @returns {Object} - Bao gồm state cart, orderedCart, notes và các hàm update.
 */
export const useCart = () => {
  // cart: Lưu các món đang chọn nhưng chưa gửi bếp { productId: quantity }
  const [cart, setCart] = useState({});
  // orderedCart: Lưu tổng số lượng các món đã được gửi bếp thành công
  const [orderedCart, setOrderedCart] = useState({});
  // notes: Ghi chú cho từng món ăn { productId: "ghi chú..." }
  const [notes, setNotes] = useState({});

  /**
   * Chuyển các món trong cart sang orderedCart sau khi gọi món thành công.
   * Reset cart về rỗng để khách chọn đợt tiếp theo.
   */
  const handleOrderSuccess = () => {
    const newOrderedCart = { ...orderedCart };
    Object.entries(cart).forEach(([id, qty]) => {
      newOrderedCart[id] = (newOrderedCart[id] || 0) + qty;
    });
    setOrderedCart(newOrderedCart);
    setCart({});
  };

  return {
    cart,
    setCart,
    orderedCart,
    setOrderedCart,
    notes,
    setNotes,
    handleOrderSuccess,
  };
};
