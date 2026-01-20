import React from 'react';

const StatCards = ({ stats, formatMoney }) => {
  return (
    <div className='stats-grid'>
      <div className='stat-card' style={{ borderBottom: '4px solid #2ecc71' }}>
        <div className='stat-icon-box' style={{ backgroundColor: '#2ecc7120', color: '#2ecc71' }}>
          <span className='icon-display'>💵</span>
        </div>
        <div className='stat-info'>
          <div className='stat-value'>{formatMoney(stats.revenue.total)}</div>
          <div className='stat-label'>Doanh thu</div>
        </div>
      </div>
      <div className='stat-card' style={{ borderBottom: '4px solid #f1c40f' }}>
        <div className='stat-icon-box' style={{ backgroundColor: '#f1c40f20', color: '#f1c40f' }}>
          <span className='icon-display'>💰</span>
        </div>
        <div className='stat-info'>
          <div className='stat-value'>{formatMoney(stats.revenue.cash)}</div>
          <div className='stat-label'>Tiền mặt</div>
        </div>
      </div>
      <div className='stat-card' style={{ borderBottom: '4px solid #3498db' }}>
        <div className='stat-icon-box' style={{ backgroundColor: '#3498db20', color: '#3498db' }}>
          <span className='icon-display'>💳</span>
        </div>
        <div className='stat-info'>
          <div className='stat-value'>{formatMoney(stats.revenue.other)}</div>
          <div className='stat-label'>Chuyển khoản</div>
        </div>
      </div>
      <div className='stat-card' style={{ borderBottom: '4px solid #e74c3c' }}>
        <div className='stat-icon-box' style={{ backgroundColor: '#e74c3c20', color: '#e74c3c' }}>
          <span className='icon-display'>📦</span>
        </div>
        <div className='stat-info'>
          <div className='stat-value'>{stats.ordersCount} đơn</div>
          <div className='stat-label'>Tổng đơn hàng</div>
        </div>
      </div>
    </div>
  );
};

export default StatCards;
