import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { pushMessage } from '@/redux/toastSlice';
import ReactLoading from 'react-loading';
import { formatPrice } from '@/utils/format';
import { paymentOptions } from '@/utils/paymentOptions';

export default function CheckoutPaymentPage() {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const API_PATH = encodeURIComponent(import.meta.env.VITE_API_PATH);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  // 2.2 state：orderState／carts／loading
  const [orderState, setOrderState] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const subtotal = (orderState?.products ?? []).reduce(
    (s, p) => s + p.total,
    0
  );

  // 2.3 form：react-hook-form 初始化 & 監聽
  const savedData = JSON.parse(sessionStorage.getItem('checkoutData') || '{}');
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      payment: savedData.payment || '現金支付',
      // 只把 extraFields 動態注入 default
      ...paymentOptions
        .find(o => o.value === (savedData.payment || '現金支付'))
        .extraFields.reduce(
          (acc, f) => ({
            ...acc,
            [f.name]: savedData[f.name] || '',
          }),
          {}
        ),
    },
  });
  const allValues = watch();
  const payment = allValues.payment;
  const current = paymentOptions.find(o => o.value === payment);

  // 2.4 effects:
  //   2.4.1 讀取 orderState
  useEffect(() => {
    const data = location.state || savedData;
    if (!data?.user) {
      dispatch(pushMessage({ text: '找不到結帳資訊', status: 'failed' }));
      navigate('/checkout-form');
      return;
    }
    setOrderState(data);
  }, [location.state, dispatch, navigate]);

  // 2.5 handler: onSubmit
  const onSubmit = async data => {
    setIsLoading(true);
    try {
      // 準備額外訊息
      let extraInfo = '';
      if (data.payment === 'Apple Pay') {
        extraInfo =
          `｜卡號：${data.cardNumber}` +
          `｜有效期限：${data.expiry}` +
          `｜CVC：${data.cvc}`;
      } else if (data.payment === 'Line Pay') {
        extraInfo = `｜Line Pay 電話：${data.linePhone}`;
      }
      // 組訊息
      const message =
        `${orderState.message || ''}` +
        `｜付款方式：${data.payment}` +
        extraInfo;

      // 建單
      const { orderId } = (
        await axios.post(`${BASE_URL}/v2/api/${API_PATH}/order`, {
          data: {
            user: orderState.user,
            // message: `${orderState.message || ''}｜付款方式：${data.payment}`,
            message,
          },
        })
      ).data;

      // 付款
      const payRes = await axios.post(
        `${BASE_URL}/v2/api/${API_PATH}/pay/${orderId}`
      );
      dispatch(pushMessage({ text: payRes.data.message, status: 'success' }));

      // 組 newOrder 並存 localStorage
      const fallback = JSON.parse(localStorage.getItem('orderList') || '[]');
      const newOrder = {
        id: orderId,
        user: orderState.user,
        products: orderState.products,
        total: orderState.total,
        ...data, // payment + extraFields
        is_paid: true,
        createdAt: new Date().toLocaleString('zh-TW', { hour12: false }),
      };
      localStorage.setItem(
        'orderList',
        JSON.stringify([newOrder, ...fallback])
      );

      // 清掉 sessionStorage & 導向成功頁
      sessionStorage.removeItem('checkoutData');
      navigate('/checkout-success', { state: { order: newOrder } });
    } catch (e) {
      dispatch(
        pushMessage({
          text: e.response?.data?.message || '送出訂單或付款失敗',
          status: 'failed',
        })
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!orderState) return null;

  return (
    <div className='container'>
      <div className='row justify-content-center'>
        <div className='col-md-10'>
          <nav className='navbar navbar-expand-lg navbar-light px-0'>
            <ul className='list-unstyled mb-0 ms-md-auto d-flex align-items-center justify-content-between justify-content-md-end w-100 mt-md-0 mt-4'>
              <li className='me-md-6 me-3 position-relative custom-step-line'>
                <i className='fas fa-check-circle d-md-inline d-block text-center'></i>
                <span className='text-nowrap'>Checkout-Form</span>
              </li>
              <li className='me-md-6 me-3 position-relative custom-step-line'>
                <i className='fas fa-dot-circle d-md-inline d-block text-center'></i>
                <span className='text-nowrap fw-bold'>Checkout-Payment</span>
              </li>
              <li>
                <i className='fas fa-dot-circle d-md-inline d-block text-center'></i>
                <span className='text-nowrap'>Checkout-Success</span>
              </li>
            </ul>
          </nav>
        </div>
      </div>
      <div className='row flex-row-reverse justify-content-center pb-5'>
        <div className='col-md-4'>
          <div className=' border border-secondary border-2 rounded-3 p-3 mb-4'>
            <h4 className='fw-bold mb-3'>Order Detail</h4>
            {(orderState?.products ?? []).length > 0 ? (
              orderState.products.map(item => (
                <div key={item.id} className='d-flex mt-2'>
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className='me-2'
                    style={{ width: 48, height: 48, objectFit: 'cover' }}
                  />
                  <div className='w-100'>
                    <div className='d-flex justify-content-between'>
                      <p className='mb-0 fw-bold'>{item.title}</p>
                      <p className='mb-0'>{formatPrice(item.total)}</p>
                    </div>
                    <p className='mb-0 text-muted'>x{item.qty}</p>
                  </div>
                </div>
              ))
            ) : (
              <p>沒有商品，請先到購物車。</p>
            )}

            <table className='table mt-4 border-top border-bottom text-muted'>
              <tbody>
                <tr>
                  <th className='border-0 px-0 pt-4'>Subtotal</th>
                  <td className='text-end border-0 px-0 pt-4'>
                    {formatPrice(subtotal)}
                  </td>
                </tr>
                <tr>
                  <th className='border-0 px-0 pt-0 pb-4'>Payment</th>
                  <td className='text-end border-0 px-0 pt-0 pb-4'>
                    {payment}
                  </td>
                </tr>
                {current.extraFields.map(field => (
                  <tr key={field.name}>
                    <th className='border-0 px-0 pt-0 pb-4'>{field.label}</th>
                    <td className='text-end border-0 px-0 pt-0 pb-4'>
                      {allValues[field.name] ?? '--'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className='d-flex justify-content-between mt-4'>
              <p className='mb-0 h4 fw-bold'>Total</p>
              <p className='mb-0 h4 fw-bold'>{formatPrice(subtotal)}</p>
            </div>
          </div>
        </div>
        <div className='col-md-6'>
          <div className='mx-auto mb-4 border border-secondary border-2 rounded-3 p-3'>
            <h4 className='fw-bold mb-3'>Customer Detail</h4>
            <p>
              <strong>email：</strong>
              {orderState.user.email}
            </p>
            <p>
              <strong>姓名：</strong>
              {orderState.user.name}
            </p>
            <p>
              <strong>電話：</strong>
              {orderState.user.tel}
            </p>
            <p>
              <strong>地址：</strong>
              {orderState.user.address}
            </p>
            <p>
              <strong>留言：</strong>
              {orderState.message || '無'}
            </p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className='mx-auto mb-4 border border-secondary border-2 rounded-3 p-3'>
              {/* Radio List */}
              {/* <PaymentSelector
                options={paymentOptions}
                register={register}
                error={errors.payment}
              /> */}

              {/* Radio List */}
              <fieldset className='mb-4'>
                {paymentOptions.map(opt => (
                  <div key={opt.value} className='form-check mb-2'>
                    <input
                      {...register('payment', {
                        required: '請選擇付款方式',
                      })}
                      className='form-check-input'
                      type='radio'
                      id={`payment-${opt.value}`}
                      value={opt.value}
                    />
                    <label
                      className='form-check-label'
                      htmlFor={`payment-${opt.value}`}
                    >
                      {opt.label}
                    </label>
                  </div>
                ))}
                {errors.payment && (
                  <p className='text-danger'>{errors.payment.message}</p>
                )}
              </fieldset>

              {/* 動態 extraFields */}
              {current.extraFields.map(field => (
                <div key={field.name} className='mb-3 ps-4'>
                  <label htmlFor={field.name} className='form-label'>
                    {field.label}
                  </label>
                  <input
                    {...register(field.name, field.validation)}
                    id={field.name}
                    type={field.type}
                    placeholder={field.placeholder}
                    className={`form-control ${
                      errors[field.name] ? 'is-invalid' : ''
                    }`}
                  />
                  {errors[field.name] && (
                    <div className='invalid-feedback'>
                      {errors[field.name].message}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* 3. 按鈕區 */}
            <div className='d-flex flex-column-reverse flex-md-row mt-4 justify-content-between align-items-md-center align-items-end w-100'>
              <Link to='/checkout-form' className='text-dark mt-md-0 mt-3'>
                <i className='fas fa-chevron-left me-2'></i> ← 回到填寫表單
              </Link>
              <button
                type='submit'
                className='btn btn-dark py-3 px-5'
                disabled={isLoading}
              >
                {isLoading ? '處理中...' : '送出訂單並付款'}
              </button>
            </div>
          </form>
        </div>
      </div>

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
          <ReactLoading type='spin' color='black' height='4rem' width='4rem' />
        </div>
      )}
    </div>
  );
}
