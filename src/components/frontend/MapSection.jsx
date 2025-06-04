// src/components/frontend/MapSection.jsx
import React from 'react';

export default function MapSection() {
  return (
    <div className='map-section container my-6'>
      <h4 className='text-center mb-4'>📍 門市資訊</h4>
      <div className='row align-items-center'>
        <div className='col-md-6 mb-3 mb-md-0'>
          <img
            src='/images/map-placeholder.png'
            alt='門市地圖'
            className='img-fluid rounded shadow-sm'
          />
        </div>
        <div className='col-md-6'>
          <h5 className='fw-bold'>Morning Bean Café — 台北永康店</h5>
          <p className='mb-1'>
            <i className='fas fa-map-marker-alt me-2'></i>台北市大安區永康街 45
            號
          </p>
          <p className='mb-1'>
            <i className='fas fa-clock me-2'></i>每日 10:00 - 19:00
          </p>
          <p className='mb-1'>
            <i className='fas fa-phone-alt me-2'></i>(02) 1234-5678
          </p>
        </div>
      </div>
    </div>
  );
}
