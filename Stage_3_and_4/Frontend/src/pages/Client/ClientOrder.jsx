import { useState, useEffect } from "react";
import CartHeader from "../../Components/Order/Cart/CartHeader.jsx";
import CartBody from "../../Components/Order/Cart/CartBody.jsx";
import CartFooter from "../../Components/Order/Cart/CartFooter.jsx";
import Menu from "../../Components/Order/Menu/Menu.jsx";
import { MOCK_PRODUCTS as FALLBACK_PRODUCTS } from "../../mockData.js";
import { fetchMenuData } from "../../services/menuService.js";
import { getTableById } from "../../services/tableService.js";
import { getOrderDetails } from "../../services/orderService.js";

/**
 * Component chính cho luồng gọi món của Khách hàng (hoặc Nhân viên dùng UI Client).
 * Gồm 2 màn hình chính: Giỏ hàng (cart) và Thực đơn chọn món (menu).
 */
function ClientOrder({ initialTableId, staffName, onBack }) {
  /**
   * Lấy ID bàn từ tham số trên URL (query string).
   */
  const parseTableIdFromUrl = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const id =
      urlParams.get("tableId") || urlParams.get("table") || urlParams.get("id");
    return id ? parseInt(id) : null;
  };

  const [tableId, setTableId] = useState(
    () => initialTableId || parseTableIdFromUrl()
  );
  const [currentScreen, setCurrentScreen] = useState("cart"); // Chuyển đổi giữa 'cart' và 'menu'
  const [cart, setCart] = useState({}); // Các món đang chọn nhưng chưa gửi bếp { prodId: quantity }
  const [orderedCart, setOrderedCart] = useState({}); // Các món đã gọi thành công từ trước
  const [notes, setNotes] = useState({}); // Ghi chú cho từng món ăn
  const [products, setProducts] = useState(FALLBACK_PRODUCTS); // Danh sách sản phẩm
  const [tableNumber, setTableNumber] = useState(() =>
    tableId ? `Bàn ${tableId}` : null
  );

  // Cập nhật thông tin số bàn khi tableId thay đổi
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
        } catch {
          setTableNumber(`Bàn ${targetId}`);
        }
      }
    };
    loadTableInfo();
  }, [initialTableId]);

  /**
   * Tải danh sách các món ăn bàn này đã gọi từ trước (từ server).
   */
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

  // Tải danh sách thực đơn (Menu)
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

  /**
   * Xử lý sau khi nhấn nút "Gọi món" thành công.
   * Chuyển các món từ giỏ hàng tạm sang danh sách đã gọi.
   */
  const handleOrderSuccess = () => {
    const newOrderedCart = { ...orderedCart };
    Object.entries(cart).forEach(([id, qty]) => {
      newOrderedCart[id] = (newOrderedCart[id] || 0) + qty;
    });
    setOrderedCart(newOrderedCart);
    setCart({});
  };

  // Render màn hình Thực đơn (Menu)
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

  // Render màn hình Giỏ hàng (Cart)
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
        orderedCart={orderedCart}
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
