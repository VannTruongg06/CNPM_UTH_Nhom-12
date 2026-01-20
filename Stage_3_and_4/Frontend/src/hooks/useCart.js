import { useState } from "react";

export const useCart = () => {
  const [cart, setCart] = useState({});
  const [orderedCart, setOrderedCart] = useState({});
  const [notes, setNotes] = useState({});

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
