import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import { getDashboardStats, deleteBooking } from '../../services/adminService';
import StatCards from '../../Components/Admin/Dashboard/StatCards';
import BookingTable from '../../Components/Admin/Dashboard/BookingTable';
import BestSellerList from '../../Components/Admin/Dashboard/BestSellerList';

/**
 * Trang Dashboard Quản trị.
 * Hiển thị tổng quan về doanh thu, số lượng đơn hàng, món ăn bán chạy và danh sách đặt bàn.
 */
const Dashboard = () => {
  // timeRange: Khoảng thời gian thống kê (today, week, month...)
  const [timeRange, setTimeRange] = useState('today');
  // stats: Lưu trữ dữ liệu thống kê từ API
  const [stats, setStats] = useState({
    revenue: { total: 0, cash: 0, other: 0 },
    ordersCount: 0,
    topItems: [],
    bookings: [],
  });
  const [loading, setLoading] = useState(false);

  /**
   * Định dạng số tiền sang định dạng tiền tệ Việt Nam (VNĐ).
   */
  const formatMoney = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  // Tải lại dữ liệu mỗi khi timeRange thay đổi
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getDashboardStats(timeRange);

        setStats({
          revenue: {
            total: data.revenue?.total || 0,
            cash: data.revenue?.cash || 0,
            other: data.revenue?.transfer || 0
          },
          ordersCount: data.revenue?.orders || 0,
          topItems: data.best_sellers || [],
          bookings: data.bookings || []
        });
      } catch (error) {
        console.error("Failed to load dashboard stats", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timeRange]);

  /**
   * Xử lý xóa một lịch đặt bàn.
   * @param {number|string} id - ID của lịch đặt bàn.
   */
  const handleDeleteBooking = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa lịch đặt này?')) {
      try {
        await deleteBooking(id);
        setStats(prev => ({
          ...prev,
          bookings: prev.bookings.filter(b => b.id !== id)
        }));
      } catch (error) {
        console.error("Delete booking error:", error);
        alert("Có lỗi xảy ra khi xóa đặt bàn!");
      }
    }
  };

  return (
    <div className='dashboard-wrapper'>
      <div className='dashboard-top-bar'>
        <h2 className='page-title'>Tổng quan hệ thống</h2>
        <div className='date-picker-wrapper'>
          <select className='date-select' value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
            <option value='today'>Hôm nay</option>
            <option value='yesterday'>Hôm qua</option>
            <option value='month'>Tháng này</option>
            <option value='quarter'>Quý này</option>
            <option value='year'>Năm nay</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>Đang tải dữ liệu...</div>
      ) : (
        <>
          <StatCards stats={stats} formatMoney={formatMoney} />

          <div className='content-split'>
            <BookingTable bookings={stats.bookings} onDelete={handleDeleteBooking} />
            <BestSellerList topItems={stats.topItems} formatMoney={formatMoney} />
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
