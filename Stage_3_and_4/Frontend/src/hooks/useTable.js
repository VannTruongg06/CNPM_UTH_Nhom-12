import { useState, useEffect } from "react";
import { getTableById } from "../services/tableService.js";

/**
 * Hook xác định bàn hiện tại dựa trên URL params hoặc props.
 * Hỗ trợ các format URL như: ?tableId=1, ?table=1, ?id=1.
 * 
 * @param {string|number} initialTableId - ID bàn khởi tạo (nếu có).
 * @returns {Object} - { tableId, tableNumber, ... }
 */
export const useTable = (initialTableId) => {
  const parseTableIdFromUrl = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const id =
      urlParams.get("tableId") || urlParams.get("table") || urlParams.get("id");
    return id ? parseInt(id) : null;
  };

  const [tableId, setTableId] = useState(
    () => initialTableId || parseTableIdFromUrl()
  );
  
  const [tableNumber, setTableNumber] = useState(() =>
    tableId ? `Bàn ${tableId}` : null
  );

  useEffect(() => {
    const loadTableInfo = async () => {
      const targetId = tableId || initialTableId || parseTableIdFromUrl();
      if (targetId) {
        setTableId(targetId);
        try {
          const table = await getTableById(targetId);
          if (table) {
            setTableNumber(table.number);
          } else {
            setTableNumber(`Bàn ${targetId}`);
          }
        } catch (e) {
          setTableNumber(`Bàn ${targetId}`);
        }
      }
    };
    loadTableInfo();
  }, [initialTableId]);

  return { tableId, setTableId, tableNumber, setTableNumber };
};
