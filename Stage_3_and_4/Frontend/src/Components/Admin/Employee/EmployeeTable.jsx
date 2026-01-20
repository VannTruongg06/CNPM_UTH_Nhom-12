import React, { useState } from "react";

const EmployeeTable = ({ employees, onEdit, onDelete }) => {
  const [hoveredRow, setHoveredRow] = useState(null);

  return (
    <div className="emp-table-wrapper">
      <table className="emp-table">
        <thead>
          <tr>
            <th>Họ tên</th>
            <th>Tài khoản</th>
            <th>Vai trò</th>
            <th style={{ width: "180px", textAlign: "center" }}>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {employees.length > 0 ? (
            employees.map((emp) => (
              <tr
                key={emp.id}
                onMouseEnter={() => setHoveredRow(emp.id)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                <td>{emp.name}</td>
                <td>{emp.user}</td>
                <td>{emp.role === "staff" ? "Nhân viên" : "Khác"}</td>
                <td style={{ textAlign: "center" }}>
                  <div
                    style={{
                      visibility:
                        hoveredRow === emp.id ? "visible" : "hidden",
                      display: "flex",
                      gap: "10px",
                      justifyContent: "center",
                    }}
                  >
                    <button
                      className="btn-action btn-edit"
                      onClick={() => onEdit(emp)}
                    >
                      Sửa
                    </button>
                    <button
                      className="btn-action btn-action-delete"
                      onClick={() => onDelete(emp.id)}
                    >
                      Xóa
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="4"
                style={{ textAlign: "center", padding: "20px" }}
              >
                Chưa có nhân viên nào. Hãy thêm mới!
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeTable;
