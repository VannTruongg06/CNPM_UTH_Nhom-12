import React from 'react';

/**
 * Component hiển thị sơ đồ bàn dưới dạng lưới (Grid).
 * Mỗi ô đại diện cho một bàn với các trạng thái: trống, có khách, đã đặt trước.
 */
const TableGrid = ({ tables, selectedTable, onTableClick, getTableStatusClass }) => {
  return (
    <div className="pos-table-grid">
      {tables.map((table) => (
        <div
          key={table.id}
          className={`pos-table-card ${getTableStatusClass(table.status)} ${selectedTable === table.id ? "selected" : ""}`}
          onClick={() => onTableClick(table)}
        >
          <div className="pos-table-name">{table.number}</div>
          {/* Nếu bàn đang có khách (occupied), hiển thị thêm thời gian ngồi và số tiền tạm tính */}
          {table.status === "occupied" ? (
            <>
              <div className="pos-table-time" style={{ fontSize: "12px", color: "#333", marginBottom: "4px" }}>
                {table.duration || "0p"}
              </div>
              <div className="pos-table-money">
                {(table.current_order_total || 0).toLocaleString()}đ
              </div>
            </>
          ) : (
            <div className="pos-table-empty">Trống</div>
          )}
        </div>
      ))}
    </div>
  );
};

export default TableGrid;
