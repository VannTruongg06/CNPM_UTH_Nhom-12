import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ClientBooking from "./pages/Visitor/ClientBooking.jsx";
import Login from "./pages/Auth/login.jsx";
import StaffHome from "./pages/Staff/StaffHome.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 1. Trang chủ (Khách online) */}
        <Route path="/" element={<ClientBooking />} />
        {/* 2. Trang Order (Khách tại quán) */}

        {/* 3. Trang Login */}
        <Route path="/login" element={<Login />} />

        {/* 4. Trang dành cho Quản lý (Admin) */}

        {/* 5. Trang dành cho Nhân viên */}
        <Route path="/staff/order-taking" element={<StaffHome />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
