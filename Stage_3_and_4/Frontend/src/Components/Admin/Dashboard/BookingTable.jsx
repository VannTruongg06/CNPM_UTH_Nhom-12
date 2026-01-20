import React from 'react';

const BookingTable = ({ bookings, onDelete }) => {
  return (
    <div className='panel-section'>
      <div className='panel-header'>
        <h3>📅 Lịch đặt bàn ({bookings.length})</h3>
      </div>
      <div className='table-container'>
        <table className='booking-table'>
          <thead>
            <tr>
              <th style={{ textAlign: 'left' }}>Tên khách</th>
              <th>SĐT</th>
              <th>Giờ</th>
              <th>Khách</th>
              <th>Xử lý</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length > 0 ? (
              bookings.map(booking => (
                <tr key={booking.id}>
                  <td style={{ textAlign: 'left' }}>{booking.name}</td>
                  <td>{booking.phone}</td>
                  <td style={{ fontWeight: 'bold', color: '#e67e22' }}>
                    {booking.time} - {booking.date}
                  </td>
                  <td>{booking.guests}</td>
                  <td style={{ textAlign: 'center' }}>
                    <button className='btn-delete' onClick={() => onDelete(booking.id)}>✖</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan='5' className='empty-state' style={{ textAlign: 'center', padding: '20px' }}>
                  Không có yêu cầu đặt bàn nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookingTable;
