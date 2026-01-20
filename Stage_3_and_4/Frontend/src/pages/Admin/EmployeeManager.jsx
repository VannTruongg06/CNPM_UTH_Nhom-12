import React, { useState, useEffect } from "react";
import "./EmployeeManager.css";
import {
  getEmployees,
  saveEmployee,
  deleteEmployee,
} from "../../services/employeeService";
import EmployeeForm from "../../Components/Admin/Employee/EmployeeForm";
import EmployeeTable from "../../Components/Admin/Employee/EmployeeTable";

const EmployeeManager = () => {
  // State quản lý màn hình (Danh sách vs Form)
  const [isFormOpen, setIsFormOpen] = useState(false);

  // State danh sách nhân viên
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);

  // State form data
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    user: "",
    pass: "",
    confirmPass: "",
    role: "staff", // Mặc định là nhân viên
  });

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

  // Load dữ liệu khi vào trang
  useEffect(() => {
    loadEmployees();
  }, []);

  // Xử lý nhập liệu
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Xử lý Submit (Thêm hoặc Sửa)
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate mật khẩu
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

  // Mở form Thêm mới
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

  const handleEdit = (emp) => {
    setFormData({
      id: emp.id,
      name: emp.name,
      user: emp.user,
      pass: "",
      confirmPass: "",
      role: emp.role || "staff",
    });
    setIsFormOpen(true);
  };

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
