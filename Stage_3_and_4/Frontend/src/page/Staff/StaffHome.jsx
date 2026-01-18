import React, { useState, useEffect } from "react";
import "./StaffHome.css";
import ClientOrder from "../Client/ClientOrder.jsx";
import { fetchTables } from "../../services/tableService";

const StaffHome = () => {
  const [currentScreen, setCurrentScreen] = useState("TABLE_SELECT");
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [staffName, setStaffName] = useState("Nhân viên");

  const loadTablesData = async () => {
    try {
      const tableData = await fetchTables();
      if (tableData && Array.isArray(tableData.results)) {
        setTables(tableData.results);
      } else if (Array.isArray(tableData)) {
        setTables(tableData);
      }
    } catch (e) {
      console.error("Lỗi tải danh sách bàn:", e);
    }
  };

  useEffect(() => {
    const user = localStorage.getItem("fullName");
    if (user) setStaffName(user);
    loadTablesData();
  }, []);

  useEffect(() => {
    if (currentScreen === "TABLE_SELECT") {
      loadTablesData();
    }
  }, [currentScreen]);

  // --- LOGIC TÍNH TOÁN THỐNG KÊ ---
  const activeTablesCount = tables.filter(
    (t) => t.status === "occupied"
  ).length;
  const totalActiveRevenue = tables.reduce((sum, t) => {
    return sum + (t.status === "occupied" ? t.current_order_total || 0 : 0);
  }, 0);
  // -------------------------------------

  const handleSelectTable = (table) => {
    setSelectedTable(table);
    setCurrentScreen("ORDER_FLOW");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("fullName");
    localStorage.removeItem("role"); 
    localStorage.removeItem("userId");
    window.location.href = "/login";
  };

  if (currentScreen === "ORDER_FLOW" && selectedTable) {
    return (
      <ClientOrder
        initialTableId={selectedTable.id}
        staffName={staffName}
        onBack={() => {
          setSelectedTable(null);
          setCurrentScreen("TABLE_SELECT");
        }}
      />
    );
  }

  return (
    <div className="staff-container table-view">
      <div className="staff-header-simple">
        <div className="staff-text">
          Nhân Viên
          <br />
          {staffName}
        </div>
        <button className="btn-back-home" onClick={handleLogout}>
          Đăng xuất
        </button>
      </div>

      <div className="staff-info-bar">
        <span>
          Hoạt động: {activeTablesCount}/{tables.length} bàn
        </span>
        <span style={{ color: "#d32f2f" }}>
          Tạm tính: {totalActiveRevenue.toLocaleString()}đ
        </span>
      </div>

      <div className="table-grid-wrapper">
        <div className="table-grid">
          {tables.map((table) => (
            <button
              key={table.id}
              className={`table-item ${table.status || "available"}`}
              onClick={() => handleSelectTable(table)}
            >
              <span className="t-name">{table.number}</span>
              {table.status === "occupied" ? (
                <>
                  <div className="t-time" style={{ fontSize: "11px", color: "#555", marginBottom: "2px" }}>
                    {table.duration || "0p"}
                  </div>
                  <span className="t-price">
                    {(table.current_order_total || 0).toLocaleString()}đ
                  </span>
                </>
              ) : (
                <span className="t-empty">Trống</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StaffHome;