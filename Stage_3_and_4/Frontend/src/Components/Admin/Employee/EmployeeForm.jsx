import React from "react";

const EmployeeForm = ({ formData, onChange, onSubmit }) => {
  return (
    <div className="add-emp-section">
      <form className="add-emp-form" onSubmit={onSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label>Họ và tên</label>
            <input
              name="name"
              type="text"
              className="input-field"
              placeholder="VD: Nguyễn Văn A"
              value={formData.name}
              onChange={onChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Tên đăng nhập (User)</label>
            <input
              name="user"
              type="text"
              className="input-field"
              placeholder="VD: staff01"
              value={formData.user}
              onChange={onChange}
              required
            />
          </div>

          <div className="form-group">
            <label>
              Mật khẩu {formData.id && "(Để trống nếu không đổi)"}
            </label>
            <input
              name="pass"
              type="password"
              className="input-field"
              placeholder="******"
              value={formData.pass}
              onChange={onChange}
              required={!formData.id}
            />
          </div>

          <div className="form-group">
            <label>Nhập lại mật khẩu</label>
            <input
              name="confirmPass"
              type="password"
              className="input-field"
              placeholder="******"
              value={formData.confirmPass}
              onChange={onChange}
              required={!formData.id || formData.pass !== ""}
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-submit-add">
            {formData.id ? "Lưu thay đổi" : "Lưu nhân viên"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeForm;
