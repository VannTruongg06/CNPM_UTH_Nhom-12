import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './ClientBooking.css';
import logo from '../../assets/images/Uminoo-logo.png';
import logo2 from '../../assets/images/logo2.png';
import VietNam from '../../assets/images/VietNam.png';
import Japan from '../../assets/images/Japan.png';
import Facebook from '../../assets/images/FB-link.png';
import { createBooking } from '../../services/bookingService';

const ClientBooking = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    dateTime: '', 
    guests: 2,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const tableId = searchParams.get('tableId') || searchParams.get('table');
    if (tableId) {
      navigate(`/order?tableId=${tableId}`);
    }
  }, [searchParams, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const dateObj = new Date(formData.dateTime);
      const payload = {
        name: formData.name,
        phone: formData.phone,
        guests: formData.guests,
        date: dateObj.toISOString().split('T')[0], 
        time: dateObj.toTimeString().slice(0, 5),
      };

      await createBooking(payload);

      alert(`Cảm ơn ${formData.name}! Chúng tôi đã nhận yêu cầu đặt bàn.`);
      setFormData({ name: '', phone: '', dateTime: '', guests: 2 });
      setShowForm(false);
    } catch (error) {
      alert('Có lỗi xảy ra khi đặt bàn. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='booking-container'>
      <div className='booking-header'>
        <img src={logo} alt='Uminoo Logo' className='logo-img-small' />
        <div className='flags'>
          <img src={VietNam} alt='Vietnam Flag' className='flag-img' />
          <img src={Japan} alt='Japan Flag' className='flag-img' />
        </div>
      </div>

      <div className='logo-section'>
        <img src={logo2} alt='Uminoo Logo' className='logo-img-large' />
      </div>

      {!showForm ? (
        <>
          <div className='intro-text'>
            <p>Trải nghiệm trọn hương vị nguyên bản từ đại dương với thực đơn Sashimi tươi rói và Sushi tinh tế.</p>
            <br />
            <p>Chúng tôi mang tâm hồn ẩm thực Phù Tang đến bàn ăn của bạn.</p>
          </div>

          <div className='contact-info'>
            <div className='contact-item'>
              <span>📞</span>
              <a className='phone-link' href='tel:0978188201'>0978188201</a>
            </div>
            <div className='contact-item'>
              <img src={Facebook} alt='Facebook' className='facebook-icon' />
              <a className='facebook-link' href='https://www.facebook.com/vann.truongg.313482'>Uminoo Hikari</a>
            </div>
          </div>

          <button className='btn-primary' onClick={() => setShowForm(true)}>ĐẶT BÀN TRƯỚC</button>
        </>
      ) : (
        <form className='booking-form' onSubmit={handleSubmit}>
          <div className='form-row'>
            <div className='form-group'>
              <label>Thời gian</label>
              <input 
                type='datetime-local' 
                className='input-field' 
                required 
                onChange={(e) => setFormData({ ...formData, dateTime: e.target.value })} 
              />
            </div>
            <div className='form-group'>
              <label>Số người</label>
              <input 
                type='number' 
                className='input-field' 
                placeholder='VD: 2' 
                min='1' 
                value={formData.guests} 
                onChange={(e) => setFormData({ ...formData, guests: e.target.value })} 
              />
            </div>
          </div>

          <div className='form-group'>
            <label>Họ tên</label>
            <input type='text' className='input-field' placeholder='Nhập họ tên...' required onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
          </div>

          <div className='form-group'>
            <label>Số điện thoại</label>
            <input type='tel' className='input-field' placeholder='Nhập số điện thoại...' required onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '20px' }}>
            <button type='button' className='btn-primary' style={{ backgroundColor: '#888' }} onClick={() => setShowForm(false)}>Quay lại</button>
            <button type='submit' className='btn-primary' disabled={loading}>
              {loading ? 'Đang gửi...' : 'Xác nhận'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ClientBooking;
