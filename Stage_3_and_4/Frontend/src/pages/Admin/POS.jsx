import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import "./POS.css";
import { fetchMenuData } from "../../services/menuService";
import {
  submitOrder,
  getOrderDetails,
  checkoutTable,
  cancelOrder,
} from "../../services/orderService";
import { fetchTables } from "../../services/tableService";
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from "../../mockData.js";

import BillSection from "../../Components/Admin/POS/BillSection";
import TableGrid from "../../Components/Admin/POS/TableGrid";
import MenuGrid from "../../Components/Admin/POS/MenuGrid";
import PaymentPanel from "../../Components/Admin/POS/PaymentPanel";
import PrintableBill from "../../Components/Admin/POS/PrintableBill";

/**
 * Component POS (Point of Sale) - Trung tâm xử lý bán hàng.
 * Chức năng: Chọn bàn, Gọi món, Xem hóa đơn tạm tính, Hủy đơn và Thanh toán.
 */
const POS = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const role = localStorage.getItem("role"); // Quyền của người dùng (ADMIN/STAFF)
  const [activeTab, setActiveTab] = useState("table"); // Tab hiện tại (table/menu/payment)

  // Dữ liệu Menu
  const [products, setProducts] = useState(MOCK_PRODUCTS || []);
  const [categories, setCategories] = useState(MOCK_CATEGORIES || ["Tất cả"]);
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");

  // Giỏ hàng và trạng thái bàn
  const [cart, setCart] = useState([]); // Các món đang chọn (chưa gửi bếp)
  const [notes, setNotes] = useState({}); // Ghi chú món ăn
  const [orderedItems, setOrderedItems] = useState([]); // Các món đã gọi thành công

  const [selectedTable, setSelectedTable] = useState(null); // Bàn đang được chọn
  const [loading, setLoading] = useState(false);
  const [tables, setTables] = useState([]); // Danh sách các bàn

  // Thông tin thanh toán
  const [discount, setDiscount] = useState(0);
  const [surcharge, setSurcharge] = useState(0);
  const [customerPaid, setCustomerPaid] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("Tiền mặt");

  /**
   * Tải danh sách bàn từ server.
   */
  const loadTablesData = async () => {
    try {
      const tableData = await fetchTables();
      const tableList = Array.isArray(tableData)
        ? tableData
        : tableData.results || [];
      if (tableList.length > 0) setTables(tableList);
      return tableList;
    } catch (e) {
      console.error("Failed to fetch tables", e);
      return [];
    }
  };

  // Khởi tạo dữ liệu và thiết lập tự động cập nhật trạng thái bàn mỗi 5 giây
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        try {
          const menuData = await fetchMenuData();
          if (menuData?.products) {
            setProducts(menuData.products);
            if (menuData.categories)
              setCategories(["Tất cả", ...menuData.categories]);
          }
        } catch (e) {
          console.warn("Menu load failed, using mock");
        }

        const currentTables = await loadTablesData();

        // Xử lý nếu đi từ link thông báo (có tableId trên URL)
        const tableIdParam = searchParams.get("tableId");
        if (tableIdParam && currentTables.length > 0) {
          const targetTable = currentTables.find(
            (t) => String(t.id) === String(tableIdParam),
          );
          if (targetTable) {
            handleTableClick(targetTable);
            setSearchParams({}, { replace: true });
          }
        }
      } catch (err) {
        // Fallback dữ liệu mẫu nếu API lỗi
        setTables(
          Array.from({ length: 24 }, (_, i) => ({
            id: i + 1,
            number: `Bàn ${i + 1}`,
            status: i === 0 ? "occupied" : i === 4 ? "reserved" : "available",
            duration: i === 0 ? "1h 30p" : "",
            current_order_total: i === 0 ? 640000 : 0,
          })),
        );
      }
    };

    loadInitialData();
    const intervalId = setInterval(loadTablesData, 5000);

    return () => clearInterval(intervalId);
  }, []);

  /**
   * Trả về class CSS tương ứng với trạng thái bàn.
   */
  const getTableStatusClass = (status) => {
    switch (status) {
      case "occupied":
        return "active";
      case "reserved":
        return "reserved";
      default:
        return "empty";
    }
  };

  const filteredProducts = products.filter((p) => {
    if (selectedCategory === "Tất cả") return true;
    return (p.category || p.phan_loai) === selectedCategory;
  });

  /**
   * Tải chi tiết đơn hàng hiện tại của bàn (các món đã gọi).
   */
  const loadCurrentOrder = async (tableId) => {
    try {
      const orderData = await getOrderDetails(tableId);
      setOrderedItems(orderData?.items || []);
    } catch (error) {
      setOrderedItems([]);
    }
  };

  /**
   * Xử lý khi click vào một bàn.
   */
  const handleTableClick = async (table) => {
    setSelectedTable(table.id);
    setCart([]);
    setOrderedItems([]);
    setNotes({});
    setActiveTab("menu");

    if (table.status === "occupied") {
      setLoading(true);
      await loadCurrentOrder(table.id);
      setLoading(false);
    }
  };

  /**
   * Thêm/Bớt số lượng món ăn trong giỏ hàng tạm.
   */
  const updateCardQty = (product, amount) => {
    const existItem = cart.find((x) => x.id === product.id);
    if (existItem) {
      const newQty = existItem.qty + amount;
      if (newQty <= 0) setCart(cart.filter((x) => x.id !== product.id));
      else
        setCart(
          cart.map((x) => (x.id === product.id ? { ...x, qty: newQty } : x)),
        );
    } else if (amount > 0) {
      setCart([
        ...cart,
        { ...product, qty: 1, image: product.image || product.img },
      ]);
    }
  };

  const removeItem = (id) => setCart(cart.filter((x) => x.id !== id));

  /**
   * Tính tổng tiền (Gồm món mới chọn + món đã gọi).
   */
  const calculateTotal = () => {
    const totalNew = cart.reduce(
      (acc, item) => acc + (item.price || 0) * item.qty,
      0,
    );
    const totalOrdered = orderedItems.reduce(
      (acc, item) => acc + (item.price || 0) * (item.quantity || 0),
      0,
    );
    return totalNew + totalOrdered;
  };

  /**
   * Tổng tiền sau khi trừ chiết khấu và cộng phụ phí.
   */
  const finalTotal = () => {
    const subTotal = calculateTotal();
    return subTotal - subTotal * (discount / 100) + surcharge;
  };

  /**
   * Gửi danh sách món đang chọn xuống bếp/server.
   */
  const handleSendOrder = async () => {
    if (!selectedTable || cart.length === 0) return;
    setLoading(true);
    try {
      await submitOrder({
        tableId: selectedTable,
        items: cart.map((i) => ({
          itemId: i.id,
          quantity: i.qty,
          note: notes[i.id] || "",
        })),
      });
      await loadCurrentOrder(selectedTable);
      setCart([]);
      await loadTablesData();
      alert("Gửi thực đơn thành công!");
    } catch (e) {
      // Mockup behavior nếu API lỗi
      setOrderedItems([
        ...orderedItems,
        ...cart.map((i) => ({ ...i, quantity: i.qty, note: notes[i.id] })),
      ]);
      setCart([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Hủy toàn bộ đơn hàng của bàn (Yêu cầu quyền ADMIN).
   */
  const handleCancelOrder = async () => {
    if (!selectedTable) return;

    if (orderedItems.length > 0) {
      if (role?.toUpperCase() !== "ADMIN") {
        alert("Chỉ quản trị viên mới được hủy đơn đã đặt!");
        return;
      }
      if (
        !window.confirm(
          "Bạn có chắc chắn muốn hủy toàn bộ đơn của bàn này? Hành động này không thể hoàn tác.",
        )
      ) {
        return;
      }

      setLoading(true);
      try {
        await cancelOrder(selectedTable);
        alert("Đã hủy đơn thành công!");
        // Reset trạng thái về ban đầu
        setCart([]);
        setOrderedItems([]);
        setDiscount(0);
        setSurcharge(0);
        setActiveTab("table");
        setSelectedTable(null);
        await loadTablesData();
      } catch (e) {
        alert(e.message || "Hủy đơn thất bại!");
      } finally {
        setLoading(false);
      }
    } else {
      // Nếu chưa gọi món nào thì chỉ việc bỏ chọn bàn
      setCart([]);
      setSelectedTable(null);
      setActiveTab("table");
    }
  };

  /**
   * Điều hướng đến màn hình thanh toán hoặc thực hiện thanh toán.
   */
  const handleMainPaymentButton = () => {
    if (!selectedTable) {
      alert("Vui lòng chọn bàn trước!");
      return;
    }
    if (activeTab !== "payment") {
      setActiveTab("payment");
      setCustomerPaid(finalTotal());
    } else {
      handleFinalPayment();
    }
  };

  /**
   * Xác nhận thanh toán và in hóa đơn (Yêu cầu quyền ADMIN).
   */
  const handleFinalPayment = async () => {
    if (role?.toUpperCase() !== "ADMIN") {
      alert("Chỉ quản trị viên mới có quyền thanh toán!");
      return;
    }

    setLoading(true);
    try {
      const methodMap = {
        "Tiền mặt": "cash",
        "Chuyển khoản": "transfer",
        Thẻ: "card",
      };

      await checkoutTable(selectedTable, methodMap[paymentMethod] || "cash");

      window.print(); // TODO: Mở comment dòng này khi chạy thực tế để in hóa đơn
      setCart([]);
      setOrderedItems([]);
      setDiscount(0);
      setSurcharge(0);
      setActiveTab("table");
      setSelectedTable(null);
      await loadTablesData();
      alert("Thanh toán thành công!");
    } catch (e) {
      alert(e.message || "Thanh toán thất bại!");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Gom tất cả các món (đã đặt + đang chọn) để hiển thị trên hóa đơn in.
   */
  const allItemsToPrint = [
    ...orderedItems.map((i) => ({
      ...i,
      name: i.name,
      price: i.price,
      qty: i.quantity,
      total: i.price * i.quantity,
    })),
    ...cart.map((i) => ({
      ...i,
      name: i.name,
      price: i.price,
      qty: i.qty,
      total: i.price * i.qty,
    })),
  ];

  return (
    <>
      <div className="pos-layout">
        <BillSection
          cart={cart}
          orderedItems={orderedItems}
          removeItem={removeItem}
          notes={notes}
          calculateTotal={calculateTotal}
          handleSendOrder={handleSendOrder}
          handleMainPaymentButton={handleMainPaymentButton}
          handleCancelOrder={handleCancelOrder}
          activeTab={activeTab}
          loading={loading}
          setSelectedTable={setSelectedTable}
          setCart={setCart}
          setActiveTab={setActiveTab}
        />

        <div className="pos-selection-section">
          <div className="pos-tabs">
            <button
              className={`pos-tab-btn ${activeTab === "table" ? "active" : ""}`}
              onClick={() => setActiveTab("table")}
            >
              Chọn bàn
            </button>
            <button
              className={`pos-tab-btn ${activeTab === "menu" ? "active" : ""}`}
              onClick={() => setActiveTab("menu")}
            >
              Thực đơn
            </button>
          </div>

          <div className="pos-content-area">
            {activeTab === "table" && (
              <TableGrid
                tables={tables}
                selectedTable={selectedTable}
                onTableClick={handleTableClick}
                getTableStatusClass={getTableStatusClass}
              />
            )}

            {activeTab === "menu" && (
              <MenuGrid
                categories={categories}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                filteredProducts={filteredProducts}
                cart={cart}
                updateCardQty={updateCardQty}
                notes={notes}
                setNotes={setNotes}
              />
            )}

            {activeTab === "payment" && (
              <PaymentPanel
                selectedTable={selectedTable}
                calculateTotal={calculateTotal}
                discount={discount}
                setDiscount={setDiscount}
                surcharge={surcharge}
                setSurcharge={setSurcharge}
                finalTotal={finalTotal}
                customerPaid={customerPaid}
                setCustomerPaid={setCustomerPaid}
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
              />
            )}
          </div>
        </div>
      </div>

      <PrintableBill
        selectedTable={selectedTable}
        allItemsToPrint={allItemsToPrint}
        calculateTotal={calculateTotal}
        discount={discount}
        surcharge={surcharge}
        finalTotal={finalTotal}
        customerPaid={customerPaid}
      />
    </>
  );
};

export default POS;
