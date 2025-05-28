// PaymentSelector.jsx
// import React from 'react';

// PaymentSelector.jsx
export function PaymentSelector({ options, register, error }) {
  return (
    <fieldset className='mb-4'>
      {options.map(opt => (
        <div key={opt.value} className='form-check mb-2'>
          <input
            {...register('payment', { required: '請選擇付款方式' })}
            className='form-check-input'
            type='radio'
            id={`payment-${opt.value}`}
            value={opt.value}
          />
          <label className='form-check-label' htmlFor={`payment-${opt.value}`}>
            {opt.label}
          </label>
        </div>
      ))}
      {error && <p className='text-danger'>{error.message}</p>}
    </fieldset>
  );
}
