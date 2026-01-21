import React, { useState, useEffect } from "react";
import "./EmployeeManager.css";
import {
  getEmployees,
  saveEmployee,
  deleteEmployee,
} from "../../services/employeeService";
import EmployeeForm from "../../Components/Admin/Employee/EmployeeForm";
import EmployeeTable from "../../Components/Admin/Employee/EmployeeTable";

/**
 * Trang Quản lý nhân viên.
 * Cho phép Admin xem danh sách, thêm tài khoản mới, đổi mật khẩu hoặc xóa nhân viên.
 */
const EmployeeManager = () => {
  // State quản lý màn hình (Danh sách vs Form)
  const [isFormOpen, setIsFormOpen] = useState(false);

  // State danh sách nhân viên
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);

  // State lưu trữ thông tin khi nhập liệu trên form
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    user: "",
    pass: "",
    confirmPass: "",
    role: "staff", // Mặc định là nhân viên (staff)
  });

  /**
   * Tải danh sách nhân viên từ API.
   */
  const loadEmployees = async () => {
    setLoading(true);
    try {
      const data = await getEmployees();
      setEmployees(data);
    } catch (error) {
      console.error("Lỗi tải danh sách nhân viên:", error);
    } finally {
      setLoading(false);
    }
  };

  // Load dữ liệu khi vào trang lần đầu
  useEffect(() => {
    loadEmployees();
  }, []);

  /**
   * Cập nhật formData khi người dùng nhập liệu.
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  /**
   * Xử lý gửi Form (Thêm hoặc Sửa thông tin nhân viên).
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra tính hợp lệ của dữ liệu
    if (formData.pass !== formData.confirmPass) {
      alert("Mật khẩu nhập lại không khớp!");
      return;
    }

    if (!formData.user || (!formData.id && !formData.pass) || !formData.name) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    try {
      await saveEmployee(formData);
      alert(
        formData.id ? "Cập nhật thành công!" : "Thêm nhân viên thành công!",
      );
      handleCloseForm();
      loadEmployees();
    } catch (error) {
      alert("Lỗi: " + error.message);
    }
  };

  /**
   * Mở form thêm mới nhân viên (reset data).
   */
  const handleAddNew = () => {
    setFormData({
      id: null,
      name: "",
      user: "",
      pass: "",
      confirmPass: "",
      role: "staff",
    });
    setIsFormOpen(true);
  };

  /**
   * Mở form chỉnh sửa cho một nhân viên cụ thể.
   */
  const handleEdit = (emp) => {
    setFormData({
      id: emp.id,
      name: emp.name,
      user: emp.user,
      pass: "", // Không hiển thị mật khẩu cũ vì lý do bảo mật
      confirmPass: "",
      role: emp.role || "staff",
    });
    setIsFormOpen(true);
  };

  /**
   * Xử lý xóa nhân viên.
   */
  const handleDelete = async (id) => {
    if (window.confirm("Bạn chắc chắn muốn xóa tài khoản này?")) {
      try {
        await deleteEmployee(id);
        loadEmployees();
      } catch (error) {
        alert("Lỗi khi xóa nhân viên: " + error.message);
      }
    }
  };

  /**
   * Đóng form và reset dữ liệu tạm.
   */
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setFormData({
      id: null,
      name: "",
      user: "",
      pass: "",
      confirmPass: "",
      role: "staff",
    });
  };

  return (
    <div className="emp-container">
      <div className="emp-header-bar">
        <h2 className="emp-title">
          {isFormOpen
            ? formData.id
              ? "Cập nhật thông tin nhân viên"
              : "Thêm nhân viên mới"
            : "Quản lý nhân viên"}
        </h2>

        {!isFormOpen && (
          <button className="btn-add-emp" onClick={handleAddNew}>
            + Thêm nhân viên
          </button>
        )}

        {isFormOpen && (
          <button className="btn-back btn-back-admin" onClick={handleCloseForm}>
            Quay lại
          </button>
        )}
      </div>

      <div className="emp-body-wrapper">
        {loading ? (
          <div style={{ textAlign: "center", padding: "50px", color: "#666" }}>
            Đang tải dữ liệu...
          </div>
        ) : isFormOpen ? (
          <EmployeeForm
            formData={formData}
            onChange={handleInputChange}
            onSubmit={handleSubmit}
          />
        ) : (
          <EmployeeTable
            employees={employees}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
};

export default EmployeeManager;
