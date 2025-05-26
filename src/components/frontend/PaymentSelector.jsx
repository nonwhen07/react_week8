// PaymentSelector.jsx
import React from 'react';

// PaymentSelector.jsx
export function PaymentSelector({ options, selected, onChange }) {
  return (
    <fieldset className='mb-4'>
      {options.map(opt => (
        <div key={opt.value} className='form-check mb-2'>
          <input
            className='form-check-input'
            type='radio'
            name='payment'
            id={`payment-${opt.value}`}
            value={opt.value}
            checked={selected === opt.value}
            onChange={() => onChange(opt.value)}
          />
          <label className='form-check-label' htmlFor={`payment-${opt.value}`}>
            {opt.label}
          </label>
        </div>
      ))}
    </fieldset>
  );
}
