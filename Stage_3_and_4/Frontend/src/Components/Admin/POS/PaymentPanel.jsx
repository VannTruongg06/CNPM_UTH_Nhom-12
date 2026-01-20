import React from 'react';

const PaymentPanel = ({ 
  selectedTable, 
  calculateTotal, 
  discount, 
  setDiscount, 
  surcharge, 
  setSurcharge, 
  finalTotal, 
  customerPaid, 
  setCustomerPaid, 
  paymentMethod, 
  setPaymentMethod 
}) => {
  return (
    <div className="pos-payment-panel">
      <div style={{ textAlign: "center", marginBottom: "15px", color: "#555" }}>
        THÔNG TIN THANH TOÁN - <b>BÀN {selectedTable}</b>
      </div>
      <div className="pay-row">
        <span className="pay-label">TỔNG THÀNH TIỀN</span>
        <span className="pay-value">
          {calculateTotal().toLocaleString()} VND
        </span>
      </div>
      <div className="pay-row">
        <span className="pay-label">GIẢM GIÁ</span>
        <div className="pay-input-group">
          <input
            type="number"
            value={discount}
            onChange={(e) => setDiscount(Number(e.target.value))}
            className="pay-input-small"
          />
          <span>%</span>
        </div>
      </div>
      <div className="pay-row">
        <span className="pay-label">PHỤ THU</span>
        <div className="pay-input-group">
          <input
            type="number"
            value={surcharge}
            onChange={(e) => setSurcharge(Number(e.target.value))}
            className="pay-input-medium"
          />
          <span>VND</span>
        </div>
      </div>
      <hr className="pay-divider" />
      <div className="pay-row highlight">
        <span className="pay-label">TỔNG CỘNG</span>
        <span className="pay-value red">
          {finalTotal().toLocaleString()} VND
        </span>
      </div>
      <div className="pay-row">
        <span className="pay-label">TIỀN KHÁCH TRẢ</span>
        <div className="pay-input-group">
          <input
            type="number"
            value={customerPaid}
            onChange={(e) => setCustomerPaid(Number(e.target.value))}
            className="pay-input-large"
          />
          <span>VND</span>
        </div>
      </div>
      <hr className="pay-divider" />
      <div className="pay-method-area">
        <div className="pay-row">
          <select
            className="pay-select-method"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <option value="Tiền mặt">Tiền mặt</option>
            <option value="Chuyển khoản">Chuyển khoản</option>
          </select>
          <span className="pay-value">
            {customerPaid.toLocaleString()} VND
          </span>
        </div>
        <div className="pay-row" style={{ marginTop: "15px" }}>
          <span className="pay-label">TIỀN THỪA</span>
          <span className="pay-value">
            {(customerPaid - finalTotal() > 0
              ? customerPaid - finalTotal()
              : 0
            ).toLocaleString()}{" "}
            VND
          </span>
        </div>
      </div>
    </div>
  );
};

export default PaymentPanel;
