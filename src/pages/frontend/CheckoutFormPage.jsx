import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import ReactLoading from 'react-loading';
import axios from 'axios';
import { pushMessage } from '@/redux/toastSlice';
import { formatPrice } from '@/utils/format';
import { formFields } from '@/utils/formFields';

export default function CheckoutFormPage() {
  // 常數、Router、Redux
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const API_PATH = import.meta.env.VITE_API_PATH;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // state：carts + loading
  const [carts, setCarts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // ───────── render ─────────
  const subtotal = carts.reduce((s, c) => s + c.total, 0);

  // form setup：defaultValues 從 sessionStorage 拿
  const saved = JSON.parse(sessionStorage.getItem('checkoutData') || '{}');
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: formFields.reduce(
      (acc, f) => ({
        ...acc,
        [f.name]: saved[f.name] || '',
      }),
      {}
    ),
  });

  // 載入購物車
  useEffect(() => {
    getCarts();
  }, []);

  //取得cart
  const getCarts = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/cart`);
      setCarts(res.data.data.carts);
    } catch (error) {
      handleError(error, '發生錯誤，取得購物車失敗');
    } finally {
      setIsLoading(false);
    }
  };

  // mount 時把 sessionStorage 帶回表單
  useEffect(() => {
    if (saved && Object.keys(saved).length) {
      // 只有 user/message 欄位
      reset(
        formFields.reduce(
          (acc, f) => ({
            ...acc,
            [f.name]: saved[f.name] || '',
          }),
          {}
        )
      );
    }
  }, [reset]);

  // onSubmit：驗證 → 存 sessionStorage → 跳 PaymentPage
  const onSubmit = data => {
    if (!carts.length) {
      dispatch(pushMessage({ text: '購物車是空的', status: 'failed' }));
      return;
    }
    // 準備 snapshot：user data + carts 快照 + total
    const total = carts.reduce((s, c) => s + c.total, 0);
    const products = carts.map(c => ({
      id: c.id,
      title: c.product.title,
      imageUrl: c.product.imageUrl,
      qty: c.qty,
      total: c.total,
    }));
    const formData = { user: { ...data }, products, total };

    sessionStorage.setItem('checkoutData', JSON.stringify(formData));
    navigate('/checkout-payment', { state: formData });
  };

  // 錯誤處理共用函式、錯誤訊息統一處理，如有多筆資訊就'、'串接
  const handleError = (error, fallback = '操作失敗，請稍後再試') => {
    const rawMessage = error.response?.data?.message;
    const errorMessage = Array.isArray(rawMessage)
      ? rawMessage.join('、')
      : rawMessage || fallback;
    dispatch(pushMessage({ text: errorMessage, status: 'failed' }));
  };

  return (
    <div className='container'>
      <div className='row justify-content-center'>
        <div className='col-md-10'>
          <nav className='navbar navbar-expand-lg navbar-light px-0'>
            <ul className='list-unstyled mb-0 ms-md-auto d-flex align-items-center justify-content-between justify-content-md-end w-100 mt-md-0 mt-4'>
              <li className='me-md-6 me-3 position-relative custom-step-line'>
                <i className='fas fa-check-circle d-md-inline d-block text-center'></i>
                <span className='text-nowrap fw-bold'>Checkout-Form</span>
              </li>
              <li className='me-md-6 me-3 position-relative custom-step-line'>
                <i className='fas fa-dot-circle d-md-inline d-block text-center'></i>
                <span className='text-nowrap'>Checkout-Payment</span>
              </li>
              <li>
                <i className='fas fa-dot-circle d-md-inline d-block text-center'></i>
                <span className='text-nowrap'>Checkout-Success</span>
              </li>
            </ul>
          </nav>
        </div>
      </div>
      <div className='row justify-content-center'>
        <div className='col-md-10'>
          <h3 className='fw-bold mb-4 pt-3'>Checkout</h3>
        </div>
      </div>
      <div className='row flex-row-reverse justify-content-center pb-5'>
        <div className='col-md-4'>
          <div className='border p-4 mb-4'>
            <h4 className='fw-bold mb-4'>Order Detail</h4>
            {carts?.length > 0 ? (
              carts.map(cartItem => (
                <div key={cartItem.id} className='d-flex mt-2'>
                  <img
                    src={cartItem.product.imageUrl}
                    alt={cartItem.product.title}
                    className='me-2'
                    style={{
                      width: '48px',
                      height: '48px',
                      objectFit: 'cover',
                    }}
                  />
                  <div className='w-100'>
                    <div className='d-flex justify-content-between'>
                      <p className='mb-0 fw-bold'>{cartItem.product.title}</p>
                      <p className='mb-0'>{formatPrice(cartItem.total)}</p>
                    </div>
                    <p className='mb-0 fw-bold'>x{cartItem.qty}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className='text-center text-muted'>購物車是空的</p>
            )}

            <table className='table mt-4 border-top border-bottom text-muted'>
              <tbody>
                <tr>
                  <th
                    scope='row'
                    className='border-0 px-0 pt-4 font-weight-normal'
                  >
                    Subtotal
                  </th>
                  <td className='text-end border-0 px-0 pt-4'>
                    {formatPrice(subtotal)}
                  </td>
                </tr>
              </tbody>
            </table>
            <div className='d-flex justify-content-between mt-4'>
              <p className='mb-0 h4 fw-bold'>Total</p>
              <p className='mb-0 h4 fw-bold'>{formatPrice(subtotal)}</p>
            </div>
          </div>
        </div>
        <div className='col-md-6'>
          {/* orderFormTable */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <p>Contact information</p>
            {/* <div className='mb-0'>
              <label htmlFor='contactMail' className='text-muted mb-0'>
                Email
              </label>
              <input
                {...register('email', {
                  required: 'Email 欄位必填',
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: 'Email 格式錯誤',
                  },
                })}
                type='email'
                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                id='email'
                aria-describedby='emailHelp'
                placeholder='example@gmail.com'
              />
              {errors.email && (
                <p className='text-danger my-2'>{errors.email.message}</p>
              )}
            </div>
            <div className='mb-2'>
              <label htmlFor='name' className='text-muted mb-0'>
                Name
              </label>
              <input
                {...register('name', { required: '姓名 欄位必填' })}
                type='text'
                className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                id='name'
                placeholder='Carmen A. Rose'
              />
              {errors.name && (
                <p className='text-danger my-2'>{errors.name.message}</p>
              )}
            </div>
            <div className='mb-2'>
              <label htmlFor='tel' className='text-muted mb-0'>
                Phone
              </label>
              <input
                {...register('tel', {
                  required: '電話 欄位必填',
                  pattern: {
                    value: /^(0[2-8]\d{7}|09\d{8})$/,
                    message: '電話 格式錯誤',
                  },
                })}
                type='text'
                className={`form-control ${errors.tel ? 'is-invalid' : ''}`}
                id='tel'
                placeholder='Phone Number'
              />
              {errors.tel && (
                <p className='text-danger my-2'>{errors.tel.message}</p>
              )}
            </div>
            <div className='mb-2'>
              <label htmlFor='address' className='text-muted mb-0'>
                Address
              </label>
              <input
                {...register('address', { required: '地址 欄位必填' })}
                type='text'
                className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                id='address'
                placeholder='Carmen A. Rose'
              />
              {errors.address && (
                <p className='text-danger my-2'>{errors.address.message}</p>
              )}
            </div>
            <div className='mb-2'>
              <label htmlFor='message' className='text-muted mb-0'>
                Message
              </label>
              <textarea
                {...register('message')}
                className='form-control'
                rows='3'
                id='message'
                placeholder='message ... '
              ></textarea>
            </div> */}
            {formFields.map(f => (
              <div key={f.name} className='mb-3'>
                <label htmlFor={f.name} className='form-label'>
                  {f.label}
                </label>
                {f.type === 'textarea' ? (
                  <textarea
                    {...register(f.name, f.validation)}
                    id={f.name}
                    className={`form-control ${
                      errors[f.name] ? 'is-invalid' : ''
                    }`}
                    placeholder={f.placeholder}
                    rows={3}
                  />
                ) : (
                  <input
                    {...register(f.name, f.validation)}
                    type={f.type}
                    id={f.name}
                    className={`form-control ${
                      errors[f.name] ? 'is-invalid' : ''
                    }`}
                    placeholder={f.placeholder}
                  />
                )}
                {errors[f.name] && (
                  <div className='invalid-feedback'>
                    {errors[f.name].message}
                  </div>
                )}
              </div>
            ))}
            <div className='d-flex flex-column-reverse flex-md-row mt-4 justify-content-between align-items-md-center align-items-end w-100'>
              <Link to='/cart' className='text-dark mt-md-0 mt-3'>
                <i className='fas fa-chevron-left me-2'></i> Return to Shopping
                Cart
              </Link>
              <button
                type='submit'
                className='btn btn-dark py-3 px-7'
                disabled={isLoading}
              >
                {isLoading ? '處理中...' : 'Checkout-Payment'}
              </button>
              {/* <Link to='/checkout-payment' className='btn btn-dark py-3 px-7'>
              Checkout-Payment
            </Link> */}
            </div>
          </form>
        </div>
      </div>

      {/* ScreenLoading */}
      {isLoading && (
        <div
          className='d-flex justify-content-center align-items-center'
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(255,255,255,0.3)',
            zIndex: 999,
          }}
        >
          <ReactLoading type='spin' color='black' width='4rem' height='4rem' />
        </div>
      )}
    </div>
  );
}
