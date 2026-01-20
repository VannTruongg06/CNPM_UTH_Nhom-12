import React, { useState } from "react";

const ProductForm = ({
  formData,
  setFormData,
  categories,
  onSave,
}) => {
  const [showNewGroupInput, setShowNewGroupInput] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "group" && value === "ADD_NEW") {
      setShowNewGroupInput(true);
      setFormData({ ...formData, group: "" });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="add-emp-section"> 
      <form className="add-emp-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label>Tên hàng hóa</label>
            <input
              name="name"
              type="text"
              className="input-field"
              placeholder="VD: Sushi Cá Hồi"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Hình ảnh</label>
            <div className="image-input-container" style={{ position: "relative", display: "flex", alignItems: "center" }}>
              <input
                name="image"
                type="text"
                className="input-field"
                placeholder="Dán link ảnh hoặc chọn file..."
                value={formData.image || ""}
                onChange={handleInputChange}
                style={{ paddingRight: "45px", flex: 1 }}
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                id="image-upload"
                style={{ display: "none" }}
              />
              <button
                type="button"
                className="image-upload-icon-btn"
                onClick={() => document.getElementById("image-upload").click()}
                style={{
                  position: "absolute",
                  right: "5px",
                  background: "#eee",
                  border: "none",
                  borderRadius: "4px",
                  width: "35px",
                  height: "35px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  fontSize: "18px"
                }}
                title="Chọn ảnh từ máy"
              >
                📷
              </button>
            </div>
            {formData.image && (
              <div className="image-preview-container" style={{ marginTop: "10px", display: "flex", alignItems: "center", gap: "10px" }}>
                <img
                  src={formData.image}
                  alt="preview"
                  style={{ width: "60px", height: "45px", borderRadius: "4px", objectFit: "cover", border: "1px solid #ddd" }}
                  onError={(e) => { 
                    e.target.onerror = null; 
                    e.target.src = "data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%2260%22%20height%3D%2245%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22%23eee%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20font-family%3D%22Arial%22%20font-size%3D%2210%22%20fill%3D%22%23999%22%20text-anchor%3D%22middle%22%20dy%3D%22.3em%22%3ELoi%20anh%3C%2Ftext%3E%3C%2Fsvg%3E"; 
                  }}
                />
                <span style={{ fontSize: "12px", color: "#555" }}>Xem trước ảnh</span>
              </div>
            )}
          </div>

          <div className="form-group">
            <label>Giá bán (VNĐ)</label>
            <input
              name="price"
              type="number"
              className="input-field"
              placeholder="VD: 150000"
              value={formData.price}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Nhóm món</label>
            {!showNewGroupInput ? (
              <select
                name="group"
                className="input-field"
                value={formData.group}
                onChange={handleInputChange}
              >
                {categories.map((cat, idx) => (
                  <option key={idx} value={cat}>
                    {cat}
                  </option>
                ))}
                <option value="ADD_NEW">+ Thêm nhóm mới...</option>
              </select>
            ) : (
              <div style={{ display: "flex", gap: "10px" }}>
                <input
                  name="group"
                  type="text"
                  className="input-field"
                  placeholder="Tên nhóm mới..."
                  value={formData.group}
                  onChange={(e) =>
                    setFormData({ ...formData, group: e.target.value })
                  }
                  autoFocus
                />
                <button
                  type="button"
                  className="btn-back"
                  style={{ height: "45px", marginTop: "0", whiteSpace: "nowrap" }}
                  onClick={() => setShowNewGroupInput(false)}
                >
                  Hủy
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-submit-add">
            {formData.isEdit ? "Lưu thay đổi" : "Lưu hàng hóa"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;