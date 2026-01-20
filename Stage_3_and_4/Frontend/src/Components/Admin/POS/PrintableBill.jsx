import React from 'react';

const PrintableBill = ({ 
  selectedTable, 
  allItemsToPrint, 
  calculateTotal, 
  discount, 
  surcharge, 
  finalTotal, 
  customerPaid 
}) => {
  return (
    <div id="printable-bill" className="printable-bill-area">
      <div className="bill-header-print">
        <div className="print-shop-name">UMINO</div>
        <div className="print-shop-phone">SĐT: 0123.456.789</div>
        <div className="print-dash-line">
          ------------------------------------------
        </div>
        <div className="print-title">HÓA ĐƠN BÁN HÀNG</div>
        <div className="print-bill-id">
          Số: HD{Date.now().toString().slice(-6)}
        </div>
        <div className="print-date">
          Ngày: {new Date().toLocaleString("vi-VN")}
        </div>
      </div>
      <div className="bill-info-print">
        <div className="print-row">
          <span>Khách hàng:</span> <span>Khách lẻ</span>
        </div>
        <div className="print-row">
          <span>Thu ngân:</span> <span>Admin</span>
        </div>
        <div className="print-row">
          <span>Bàn:</span> <span>{selectedTable || "Mang về"}</span>
        </div>
      </div>
      <div className="print-dash-line">
        ------------------------------------------
      </div>
      <table className="bill-table-print">
        <thead>
          <tr>
            <th className="text-left">Tên hàng</th>
            <th className="text-right">ĐG</th>
            <th className="text-center">SL</th>
            <th className="text-right">TT</th>
          </tr>
        </thead>
        <tbody>
          {allItemsToPrint.map((item, idx) => (
            <tr key={idx}>
              <td className="text-left">{item.name}</td>
              <td className="text-right">
                {(item.price || 0).toLocaleString()}
              </td>
              <td className="text-center">{item.qty || item.quantity}</td>
              <td className="text-right">
                {(
                  (item.price || 0) * (item.qty || item.quantity || 0)
                ).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="print-dash-line">
        ------------------------------------------
      </div>
      <div className="bill-totals-print">
        <div className="print-row">
          <span>Tổng thành tiền:</span>{" "}
          <span>{calculateTotal().toLocaleString()}</span>
        </div>
        <div className="print-row">
          <span>Chiết khấu:</span> <span>{discount}%</span>
        </div>
        <div className="print-row">
          <span>Phụ thu:</span> <span>{surcharge.toLocaleString()}</span>
        </div>
        <div className="print-row bold size-l">
          <span>Tổng cộng:</span> <span>{finalTotal().toLocaleString()}</span>
        </div>
        <div className="print-row">
          <span>Tiền khách trả:</span>{" "}
          <span>{customerPaid.toLocaleString()}</span>
        </div>
        <div className="print-row">
          <span>Tiền thừa:</span>{" "}
          <span>
            {(customerPaid - finalTotal() > 0
              ? customerPaid - finalTotal()
              : 0
            ).toLocaleString()}
          </span>
        </div>
      </div>
      <div className="print-dash-line">
        ------------------------------------------
      </div>
      <div className="bill-footer-print">
        <div className="text-center font-bold">
          Xin cám ơn, hẹn gặp lại quý khách
        </div>
        <div className="text-center font-bold">Powered by UMINO POS</div>
      </div>
    </div>
  );
};

export default PrintableBill;
