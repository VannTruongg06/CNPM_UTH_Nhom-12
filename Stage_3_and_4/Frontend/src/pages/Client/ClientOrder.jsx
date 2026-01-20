import { useState, useEffect } from "react";
import CartHeader from "../../Components/Order/Cart/CartHeader.jsx";
import CartBody from "../../Components/Order/Cart/CartBody.jsx";
import CartFooter from "../../Components/Order/Cart/CartFooter.jsx";
import Menu from "../../Components/Order/Menu/Menu.jsx";
import { PRODUCTS as FALLBACK_PRODUCTS } from "../../Data.js";
import { fetchMenuData } from "../../services/menuService.js";
import { getTableById } from "../../services/tableService.js";
import { getOrderDetails } from "../../services/orderService.js";

function ClientOrder({ initialTableId, staffName, onBack }) {
  const parseTableIdFromUrl = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const id =
      urlParams.get("tableId") || urlParams.get("table") || urlParams.get("id");
    return id ? parseInt(id) : null;
  };

  const [tableId, setTableId] = useState(
    () => initialTableId || parseTableIdFromUrl()
  );
  const [currentScreen, setCurrentScreen] = useState("cart");
  const [cart, setCart] = useState({});
  const [orderedCart, setOrderedCart] = useState({});
  const [notes, setNotes] = useState({});
  const [products, setProducts] = useState(FALLBACK_PRODUCTS);
  const [tableNumber, setTableNumber] = useState(() =>
    tableId ? `Bàn ${tableId}` : null
  );

  useEffect(() => {
    const loadTableInfo = async () => {
      const targetId = tableId || initialTableId || parseTableIdFromUrl();
      if (targetId) {
        setTableId(targetId);
        try {
          const table = await getTableById(targetId);
          if (table) {
            setTableNumber(table.number);
          } else {
            setTableNumber(`Bàn ${targetId}`);
          }
        } catch (e) {
          setTableNumber(`Bàn ${targetId}`);
        }
      }
    };
    loadTableInfo();
  }, [initialTableId]);

  // Load ordered items for this table
  useEffect(() => {
    const fetchExistingOrder = async () => {
      const targetId = tableId || initialTableId || parseTableIdFromUrl();
      if (!targetId) return;
      try {
        const data = await getOrderDetails(targetId);
        if (data && data.items && Array.isArray(data.items)) {
          const loadedCart = {};
          data.items.forEach((item) => {
            const prodId = item.id; 
            loadedCart[prodId] = (loadedCart[prodId] || 0) + item.quantity;
          });
          setOrderedCart(loadedCart);
        }
      } catch (err) {
        console.error("Failed to load existing order:", err);
      }
    };
    fetchExistingOrder();
  }, [tableId, initialTableId]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchMenuData();
        if (data && data.products) {
          setProducts(data.products);
        } else if (Array.isArray(data)) {
          setProducts(data);
        }
      } catch (e) {
        console.error("Lỗi tải menu:", e);
      }
    };
    loadProducts();
  }, []);

  const handleOrderSuccess = () => {
    const newOrderedCart = { ...orderedCart };
    Object.entries(cart).forEach(([id, qty]) => {
      newOrderedCart[id] = (newOrderedCart[id] || 0) + qty;
    });
    setOrderedCart(newOrderedCart);
    setCart({});
  };

  if (currentScreen === "menu") {
    return (
      <Menu
        onBack={() => setCurrentScreen("cart")}
        cart={cart}
        updateCart={setCart}
        notes={notes}
        updateNotes={setNotes}
      />
    );
  }

  return (
    <div
      className="client-order-wrapper"
      style={{
        position: "relative",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CartHeader
        onGoToMenu={() => setCurrentScreen("menu")}
        tableNumber={tableNumber}
        onBack={onBack}
      />
      <div style={{ flex: 1, overflowY: "auto" }}>
        <CartBody
          cart={cart}
          orderedCart={orderedCart}
          products={products}
          updateCart={setCart}
          notes={notes}
        />
      </div>
      <CartFooter
        cart={cart}
        notes={notes}
        products={products}
        tableId={tableId}
        tableNumber={tableNumber}
        staffName={staffName}
        onTableSelect={(id, number) => {
          setTableId(id);
          setTableNumber(number);
        }}
        onOrderSuccess={handleOrderSuccess}
      />
    </div>
  );
}

export default ClientOrder;
