export const MOCK_PRODUCTS = [
  // Khai vị
  { id: 1, name: "Súp Miso", price: 35000, category: "Khai vị", img: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400" },
  { id: 2, name: "Edamame (Đậu nành)", price: 45000, category: "Khai vị", img: "https://images.unsplash.com/photo-1528750955925-53f5b3ec074d?w=400" },
  { id: 3, name: "Salad Rong Biển", price: 65000, category: "Khai vị", img: "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=400" },
  { id: 4, name: "Tempura Tôm", price: 125000, category: "Khai vị", img: "https://images.unsplash.com/photo-1562607311-20964177726e?w=400" },
  
  // Sushi
  { id: 5, name: "Sushi Cá Hồi", price: 150000, category: "Sushi", img: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400" },
  { id: 6, name: "Sushi Lươn Nhật", price: 180000, category: "Sushi", img: "https://images.unsplash.com/photo-1553621042-f6e147245754?w=400" },
  { id: 7, name: "Sushi Tôm", price: 130000, category: "Sushi", img: "https://images.unsplash.com/photo-1583623025817-d180a2221d0a?w=400" },
  { id: 8, name: "Sushi Trứng Cá", price: 160000, category: "Sushi", img: "https://images.unsplash.com/photo-1559466273-d95e72debaf8?w=400" },
  
  // Sashimi
  { id: 9, name: "Sashimi Cá Hồi", price: 250000, category: "Sashimi", img: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400" },
  { id: 10, name: "Sashimi Cá Cừ", price: 280000, category: "Sashimi", img: "https://images.unsplash.com/photo-1544641619-35a14c330f80?w=400" },
  { id: 11, name: "Sashimi Bạch Tuộc", price: 220000, category: "Sashimi", img: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400" },
  
  // Mì & Cơm
  { id: 12, name: "Mì Ramen Hải Sản", price: 145000, category: "Mì & Cơm", img: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400" },
  { id: 13, name: "Mì Udon Thịt Bò", price: 135000, category: "Mì & Cơm", img: "https://images.unsplash.com/photo-1582953586381-450f3830499d?w=400" },
  { id: 14, name: "Cơm Lươn Nhật", price: 210000, category: "Mì & Cơm", img: "https://images.unsplash.com/photo-1579523622126-5a70d8c46329?w=400" },
  
  // Đồ uống
  { id: 15, name: "Trà Xanh Nhật Bản", price: 30000, category: "Đồ uống", img: "https://images.unsplash.com/photo-1582793988951-9aed55099991?w=400" },
  { id: 16, name: "Rượu Sake", price: 250000, category: "Đồ uống", img: "https://images.unsplash.com/photo-1582718100582-76348633c7b3?w=400" },
  { id: 17, name: "Nước Ép Cam", price: 45000, category: "Đồ uống", img: "https://images.unsplash.com/photo-1613478223719-2ab802602423?w=400" },
];

export const MOCK_CATEGORIES = ["Tất cả", "Khai vị", "Sushi", "Sashimi", "Mì & Cơm", "Đồ uống"];

export const MOCK_TABLES = [
  { id: 1, name: "Bàn 1", status: "available" },
  { id: 2, name: "Bàn 2", status: "occupied" },
  { id: 3, name: "Bàn 3", status: "reserved" },
  { id: 4, name: "Bàn 4", status: "available" },
  { id: 5, name: "Bàn 5", status: "available" },
  { id: 6, name: "Bàn 6", status: "occupied" },
  { id: 7, name: "Bàn 7", status: "available" },
  { id: 8, name: "Bàn 8", status: "available" },
  { id: 9, name: "Bàn 9", status: "occupied" },
  { id: 10, name: "Bàn 10", status: "available" },
  { id: 11, name: "Bàn 11", status: "reserved" },
  { id: 12, name: "Bàn 12", status: "available" },
];

export const MOCK_BOOKINGS = [
  { id: 1, name: "Nguyễn Văn A", phone: "0912345678", date: "2026-01-14", time: "18:00", guests: 4, status: "pending" },
  { id: 2, name: "Trần Thị B", phone: "0987654321", date: "2026-01-14", time: "19:30", guests: 2, status: "confirmed" },
  { id: 3, name: "Lê Văn C", phone: "0905123456", date: "2026-01-15", time: "11:30", guests: 6, status: "pending" },
  { id: 4, name: "Phạm Thị D", phone: "0912999888", date: "2026-01-15", time: "12:00", guests: 3, status: "pending" },
];

export const MOCK_BEST_SELLERS = [
  { name: "Sushi Cá Hồi", price: 150000, sold_count: 150, image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400" },
  { name: "Sashimi Cá Hồi", price: 250000, sold_count: 85, image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400" },
  { name: "Mì Ramen Hải Sản", price: 145000, sold_count: 120, image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400" },
  { name: "Tempura Tôm", price: 125000, sold_count: 95, image: "https://images.unsplash.com/photo-1562607311-20964177726e?w=400" },
];

export const MOCK_DASHBOARD_STATS = {
  revenue: {
    total: 45200000,
    cash: 22500000,
    transfer: 22700000,
    orders: 156
  },
  bookings: MOCK_BOOKINGS,
  best_sellers: MOCK_BEST_SELLERS
};

export const MOCK_ORDERS = [
  {
    tableId: 2,
    table: "Bàn 2",
    status: "serving",
    items: [
      { id: 5, name: "Sushi Cá Hồi", price: 150000, quantity: 2, note: "Không cay", img: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400" },
      { id: 15, name: "Trà Xanh Nhật Bản", price: 30000, quantity: 2, note: "Ít đá", img: "https://images.unsplash.com/photo-1582793988951-9aed55099991?w=400" }
    ],
    total: 360000,
    time: "2026-01-14T18:30:00"
  },
  {
    tableId: 6,
    table: "Bàn 6",
    status: "preparing",
    items: [
      { id: 12, name: "Mì Ramen Hải Sản", price: 145000, quantity: 1, note: "", img: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400" },
      { id: 4, name: "Tempura Tôm", price: 125000, quantity: 1, note: "", img: "https://images.unsplash.com/photo-1562607311-20964177726e?w=400" }
    ],
    total: 270000,
    time: "2026-01-14T19:00:00"
  },
  {
    tableId: 9,
    table: "Bàn 9",
    status: "ready",
    items: [
      { id: 9, name: "Sashimi Cá Hồi", price: 250000, quantity: 1, note: "Wasabi riêng", img: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400" },
      { id: 16, name: "Rượu Sake", price: 250000, quantity: 1, note: "Hâm nóng", img: "https://images.unsplash.com/photo-1582718100582-76348633c7b3?w=400" }
    ],
    total: 500000,
    time: "2026-01-14T19:15:00"
  }
];

export const MOCK_EMPLOYEES = [
  { id: 1, name: "Nguyễn Văn Hùng", role: "Quản lý", phone: "0912345678", email: "hung@uminoo.com", status: "active" },
  { id: 2, name: "Trần Thị Mai", role: "Thu ngân", phone: "0987654321", email: "mai@uminoo.com", status: "active" },
  { id: 3, name: "Lê Văn Tám", role: "Đầu bếp", phone: "0905123456", email: "tam@uminoo.com", status: "active" },
  { id: 4, name: "Phạm Thị Lan", role: "Phục vụ", phone: "0912999888", email: "lan@uminoo.com", status: "active" },
  { id: 5, name: "Hoàng Văn Nam", role: "Phục vụ", phone: "0977888999", email: "nam@uminoo.com", status: "inactive" },
];
