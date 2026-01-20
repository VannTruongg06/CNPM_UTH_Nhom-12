import React, { useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import "./AdminLayout.css";
import logo from "../assets/images/Uminoo-logo.png";
import { getNotifications } from "../services/adminService";

const AdminLayout = () => {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const loadNotifications = async () => {
    try {
      const serverNotifs = await getNotifications();
      const dismissedIds = JSON.parse(
        localStorage.getItem("dismissed_notifications") || "[]",
      );

      // Filter out dismissed notifications
      const validNotifs = Array.isArray(serverNotifs)
        ? serverNotifs.filter((n) => !dismissedIds.includes(n.id))
        : [];

      const formatted = validNotifs.map((n) => {
        // Fallback: Nếu backend không trả về table_id, thử tách số từ tableName (VD: "Bàn 5" -> 5)
        let extractedId = n.tableId || n.table_id;
        if (!extractedId && n.tableName) {
          const match = n.tableName.match(/\d+/);
          if (match) extractedId = parseInt(match[0]);
        }

        return {
          id: n.id,
          tableId: extractedId,
          table: n.tableName || `Bàn ${extractedId || "?"}`,
          message:
            n.type === "PAYMENT_REQUEST"
              ? "yêu cầu thanh toán"
              : "có thông báo mới",
          status: n.status,
        };
      });
      setNotifications(formatted);
    } catch (e) {
      console.error("Lỗi đọc thông báo:", e);
      setNotifications([]);
    }
  };

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("fullName");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  const handleConfirmNotification = (id, tableId) => {
    const dismissedIds = JSON.parse(
      localStorage.getItem("dismissed_notifications") || "[]",
    );
    if (!dismissedIds.includes(id)) {
      localStorage.setItem(
        "dismissed_notifications",
        JSON.stringify([...dismissedIds, id]),
      );
    }

    setNotifications(notifications.filter((n) => n.id !== id));
    setShowNotifications(false);

    if (tableId) {
      navigate(`/admin/pos?tableId=${tableId}`);
    }
  };

  return (
    <div className="admin-container">
      <header className="admin-header">
        <div className="header-left">
          <div className="brand-box">
            <img src={logo} alt="Uminoo Logo" className="logo-img" />
          </div>
        </div>

        <nav className="header-nav">
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) =>
              "nav-item" + (isActive ? " active" : "")
            }
          >
            Tổng quan
          </NavLink>
          <NavLink
            to="/admin/pos"
            className={({ isActive }) =>
              "nav-item" + (isActive ? " active" : "")
            }
          >
            Thu ngân
          </NavLink>
          <NavLink
            to="/admin/employees"
            className={({ isActive }) =>
              "nav-item" + (isActive ? " active" : "")
            }
          >
            Nhân Viên
          </NavLink>
          <NavLink
            to="/admin/products"
            className={({ isActive }) =>
              "nav-item" + (isActive ? " active" : "")
            }
          >
            Hàng hóa
          </NavLink>
        </nav>

        <div className="header-right">
          <div className="notification-wrapper">
            <div
              className="notification-btn"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <span style={{ fontSize: "24px" }}>🔔</span>
              {notifications.length > 0 && (
                <span className="badge">{notifications.length}</span>
              )}
            </div>

            {showNotifications && (
              <div className="notification-dropdown">
                {notifications.length === 0 ? (
                  <div className="notif-empty">Không có thông báo mới</div>
                ) : (
                  notifications.map((notif) => (
                    <div key={notif.id} className="notif-item">
                      <div className="notif-text">
                        <strong>{notif.table}</strong>
                        <span className="red-text"> {notif.message}</span>
                      </div>
                      <button
                        className="btn-confirm-notif"
                        onClick={() =>
                          handleConfirmNotification(notif.id, notif.tableId)
                        }
                        title="Đã xử lý"
                      >
                        OK
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          <button
            onClick={handleLogout}
            style={{
              marginLeft: "15px",
              background: "rgba(255,255,255,0.2)",
              border: "none",
              color: "white",
              padding: "5px 10px",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "12px",
            }}
          >
            Đăng xuất
          </button>
        </div>
      </header>

      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
