// 統一版 CheckoutPaymentPage，結合 OldCheckoutPaymentPage 的版面與 CheckoutFormPage 的一致性邏輯
import { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { pushMessage } from '@/redux/toastSlice';
import { formatPrice } from '@/utils/format';
import { PaymentSelector } from '@/components/frontend/PaymentSelector';
import { paymentOptions } from '@/utils/paymentOptions';
import ReactLoading from 'react-loading';

export default function CheckoutPaymentPage() {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const API_PATH = encodeURIComponent(import.meta.env.VITE_API_PATH);

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [orderState, setOrderState] = useState(null);

  const [carts, setCarts] = useState([]);

  // 預設付款方式
  const [payment, setPayment] = useState('現金支付');
  // 儲存預設付款方式-額外欄位的輸入值
  const [formValues, setFormValues] = useState({});

  const [isScreenLoading, setIsScreenLoading] = useState(false);

  // 找到選中的那筆設定
  const current = paymentOptions.find(o => o.value === payment);

  // 額外欄位輸入
  const handleFieldChange = e => {
    setFormValues(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // const handlePayment = useCallback(
  //   paymentMethod => setPayment(paymentMethod),
  //   []
  // );

  useEffect(() => {
    let recoveredState = location.state;

    if (!recoveredState) {
      try {
        const saved = sessionStorage.getItem('checkoutData');
        if (saved) recoveredState = JSON.parse(saved);
      } catch (err) {
        console.err('err', err);
        recoveredState = null;
      }
    }
    if (!recoveredState || !recoveredState.user) {
      dispatch(
        pushMessage({ text: '找不到結帳資訊，請重新操作', status: 'failed' })
      );
      navigate('/checkout-form');
    } else {
      setOrderState(recoveredState);
    }
  }, []);

  useEffect(() => {
    // setIsScreenLoading(true);
    //畫面渲染後初步載入購物車
    getCarts();
  }, []);

  //取得cart
  const getCarts = async () => {
    setIsScreenLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/cart`);
      setCarts(res.data.data.carts);
    } catch (error) {
      const rawMessage = error.response?.data?.message;
      const errorMessage = Array.isArray(rawMessage)
        ? rawMessage.join('、')
        : rawMessage || '操作失敗，請稍後再試';
      dispatch(pushMessage({ text: errorMessage, status: 'failed' }));
    } finally {
      setIsScreenLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    setIsScreenLoading(true);
    try {
      // 1. 建單
      const res = await axios.post(`${BASE_URL}/v2/api/${API_PATH}/order`, {
        data: {
          user: orderState.user,
          message: `${orderState.message || ''}｜付款方式：${payment}`,
        },
      });
      const orderId = res.data.orderId;

      // 2. 付款
      const payRes = await axios.post(
        `${BASE_URL}/v2/api/${API_PATH}/pay/${orderId}`
      );
      // dispatch(pushMessage({ text: '訂單已完成', status: 'success' }));
      dispatch(pushMessage({ text: payRes.data.message, status: 'success' }));

      // 儲存order資訊提供給 CheckoutSuccessPage 使用
      // const orderList = JSON.parse(localStorage.getItem(carts)) || [];
      // const newOrder = {
      //   // id: orderState.id,
      //   user: orderState.user.user,
      //   total: orderState.total,
      //   products: orderState.products,
      //   createdAt: new Date().toLocaleString('zh-TW', { hour12: false }),
      // };
      // localStorage.setItem(
      //   'orderList',
      //   JSON.stringify([newOrder, ...orderList])
      // );

      // 3. 組出 newOrder
      const fallback = JSON.parse(localStorage.getItem('orderList') || '[]');
      const newOrder = {
        id: orderId,
        user: orderState.user,
        products: orderState.products, // 從 sessionStorage 讀到的 products
        total: orderState.total,
        is_paid: true,
        createdAt: new Date().toLocaleString('zh-TW', { hour12: false }),
      };
      localStorage.setItem(
        'orderList',
        JSON.stringify([newOrder, ...fallback])
      );

      // 4. 清掉暫存 & 導向成功頁（帶 order 資料）
      sessionStorage.removeItem('checkoutData');
      // navigate('/checkout-success');
      navigate('/checkout-success', { state: { order: newOrder } });
    } catch (error) {
      const msg = error.response?.data?.message || '送出訂單或付款失敗';
      dispatch(pushMessage({ text: msg, status: 'failed' }));
    } finally {
      setIsScreenLoading(false);
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
            {carts?.length > 0 ? (
              carts.map(item => (
                <div key={item.id} className='d-flex mt-2'>
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.title}
                    className='me-2'
                    style={{
                      width: '48px',
                      height: '48px',
                      objectFit: 'cover',
                    }}
                  />
                  <div className='w-100'>
                    <div className='d-flex justify-content-between'>
                      <p className='mb-0 fw-bold'>{item.product.title}</p>
                      <p className='mb-0'>{formatPrice(item.total)}</p>
                    </div>
                    <p className='mb-0 fw-bold'>x{item.qty}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className='text-muted text-center'>購物車是空的</p>
            )}
            <table className='table mt-4 border-top border-bottom text-muted'>
              <tbody>
                <tr>
                  <th className='border-0 px-0 pt-4'>Subtotal</th>
                  <td className='text-end border-0 px-0 pt-4'>
                    {formatPrice(carts.reduce((t, i) => t + i.total, 0))}
                  </td>
                </tr>
                <tr>
                  <th className='border-0 px-0 pt-0 pb-4'>Payment</th>
                  <td className='text-end border-0 px-0 pt-0 pb-4'>
                    {payment}
                  </td>
                </tr>
              </tbody>
            </table>
            <div className='d-flex justify-content-between mt-4'>
              <p className='mb-0 h4 fw-bold'>Total</p>
              <p className='mb-0 h4 fw-bold'>
                {formatPrice(carts.reduce((t, i) => t + i.total, 0))}
              </p>
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
          <form
            onSubmit={e => {
              e.preventDefault();
              handlePlaceOrder();
            }}
          >
            <div className='mx-auto mb-4 border border-secondary border-2 rounded-3 p-3'>
              {/* 1. 動態渲染 radio list */}
              <PaymentSelector
                options={paymentOptions}
                selected={payment}
                onChange={setPayment}
              />

              {/* 2. 動態渲染附加欄位 */}
              {current.extraFields.map(f => (
                <div key={f.name} className='mb-3 ps-4'>
                  <label htmlFor={f.name} className='form-label'>
                    {f.label}
                  </label>
                  <input
                    id={f.name}
                    name={f.name}
                    type={f.type}
                    placeholder={f.placeholder}
                    required={f.required}
                    value={formValues[f.name] || ''}
                    onChange={handleFieldChange}
                    className='form-control'
                  />
                </div>
              ))}
            </div>

            {/* 舊版accordion */}
            {/* <div className='accordion' id='accordionExample'>
              {['現金支付', 'Apple Pay', 'Line Pay'].map((method, i) => (
                <div className='card rounded-0' key={method}>
                  <div
                    onClick={() => handlePayment(method)}
                    className='card-header bg-white border-0 py-3'
                    data-bs-toggle='collapse'
                    data-bs-target={`#collapse${i}`}
                    aria-expanded='true'
                    aria-controls={`collapse${i}`}
                  >
                    <p className='mb-0 position-relative custom-checkout-label'>
                      {method}
                    </p>
                  </div>
                  <div
                    id={`collapse${i}`}
                    className={`collapse${i === 0 ? ' show' : ''}`}
                    data-bs-parent='#accordionExample'
                  ></div>
                </div>
              ))}
            </div> */}

            {/* 3. 按鈕區 */}
            <div className='d-flex flex-column-reverse flex-md-row mt-4 justify-content-between align-items-md-center align-items-end w-100'>
              <Link to='/checkout-form' className='text-dark mt-md-0 mt-3'>
                <i className='fas fa-chevron-left me-2'></i> 回到填寫表單
              </Link>
              <button
                type='submit'
                className='btn btn-dark py-3 px-7'
                disabled={isScreenLoading}
              >
                {isScreenLoading ? '處理中...' : '送出訂單並付款'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {isScreenLoading && (
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
