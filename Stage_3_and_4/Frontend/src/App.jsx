import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ClientBooking from "./pages/Visitor/ClientBooking.jsx";
import ClientOrder from "./pages/Client/ClientOrder";
import Login from "./pages/Auth/login.jsx";
import StaffHome from "./pages/Staff/StaffHome.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";
import Dashboard from "./pages/Admin/Dashboard.jsx";
import ProductManager from "./pages/Admin/ProductManager.jsx";
import EmployeeManager from "./pages/Admin/EmployeeManager.jsx";
import POS from "./pages/Admin/POS.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 1. Trang chủ (Khách online) */}
        <Route path="/" element={<ClientBooking />} />

        {/* 2. Trang Order (Khách tại quán) */}
        <Route path="/order" element={<ClientOrder />} />

        {/* 3. Trang Login */}
        <Route path="/login" element={<Login />} />

        {/* 4. Trang dành cho Quản lý (Admin) */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="products" element={<ProductManager />} />
          <Route path="employees" element={<EmployeeManager />} />
          <Route path="pos" element={<POS />} />
        </Route>

        {/* 5. Trang dành cho Nhân viên */}
        <Route path="/staff/order-taking" element={<StaffHome />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
