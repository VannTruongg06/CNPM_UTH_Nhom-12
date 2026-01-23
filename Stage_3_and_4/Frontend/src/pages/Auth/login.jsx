import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import logo from "../../assets/images/Logo.png";
import logo2 from "../../assets/images/logo2.png";
import VietNam from "../../assets/images/VietNam.png";
import Japan from "../../assets/images/Japan.png";
import { API_BASE_URL } from "../../config/api";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const inputUser = username.trim();
    const inputPass = password.trim();

    if (!inputUser || !inputPass) {
      alert("Vui lòng nhập tài khoản và mật khẩu!");
      return;
    }

    try {
      // Sử dụng API_BASE_URL từ config
      const response = await fetch(`${API_BASE_URL}/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true", // Thêm header này để tránh bị chặn
        },
        body: JSON.stringify({
          username: inputUser,
          password: inputPass,
        }),
      });

      const result = await response.json();

      if (response.ok && result.status === "success") {
        const serverData = result.data;

        // 1. Lưu Token
        const token = serverData.token || serverData.access;
        if (token) localStorage.setItem("token", token);

        // 2. Lấy thông tin User từ serverData
        const userData = {
          userId: serverData.userId,
          fullName: serverData.fullName,
          role: (serverData.role || "CUSTOMER").toUpperCase(),
        };

        // 3. Lưu vào LocalStorage
        localStorage.setItem("userId", userData.userId);
        localStorage.setItem("fullName", userData.fullName);
        localStorage.setItem("role", userData.role);

        alert(`Đăng nhập thành công!\nXin chào: ${userData.fullName}`);

        // 4. Điều hướng dựa trên Role
        if (userData.role === "ADMIN") {
          navigate("/admin/dashboard");
        } else if (userData.role === "STAFF") {
          navigate("/staff/order-taking");
        } else {
          navigate("/");
        }
      } else {
        alert(result.message || "Đăng nhập thất bại!");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Lỗi kết nối Server!");
    }
  };

  return (
    <div className="login-container">
      <div className="login-header booking-header">
        <img src={logo} alt="Uminoo Logo" className="logo-img-small" />
        <div className="flags">
          <img src={VietNam} alt="Vietnam Flag" className="flag-img" />
          <img src={Japan} alt="Japan Flag" className="flag-img" />
        </div>
      </div>

      <main className="login-body">
        <div className="brand-section">
          <img
            src={logo2}
            alt="Umi Hikari Big Logo"
            className="main-logo logo-img-large"
          />
        </div>

        <form className="login-form" onSubmit={handleLogin}>
          <div className="input-group">
            <label>TÊN ĐĂNG NHẬP</label>
            <input
              type="text"
              placeholder="Nhập tài khoản"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>MẬT KHẨU</label>
            <input
              type="password"
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="btn-login">
            ĐĂNG NHẬP
          </button>
        </form>
      </main>
    </div>
  );
};

export default Login;
