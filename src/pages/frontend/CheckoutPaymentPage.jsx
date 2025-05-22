import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { pushMessage } from '../..//redux/toastSlice';
import { formatPrice } from '../..//utils/format';
import ReactLoading from 'react-loading';

export default function CheckoutPaymentPage() {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const API_PATH = import.meta.env.VITE_API_PATH;
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [orderState, setOrderState] = useState(null);
  const [orderId, setOrderId] = useState(null);
  const [carts, setCarts] = useState([]);
  const [isScreenLoading, setIsScreenLoading] = useState(false);

  useEffect(() => {
    const recoveredState =
      location.state || JSON.parse(sessionStorage.getItem('checkoutData'));
    if (!recoveredState) {
      dispatch(
        pushMessage({ text: '找不到結帳資訊，請重新操作', status: 'failed' })
      );
      navigate('/checkout');
      return;
    }
    setOrderState(recoveredState);
  }, []);

  useEffect(() => {
    const fetchCarts = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/v2/api/${encodeURIComponent(API_PATH)}/cart`
        );
        setCarts(res.data.data.carts);
      } catch (error) {
        dispatch(pushMessage({ text: '購物車載入失敗', status: 'failed' }));
        navigate('/cart');
      }
    };
    fetchCarts();
  }, []);

  const handlePlaceOrder = async () => {
    if (!orderState?.user) {
      dispatch(pushMessage({ text: '使用者資訊不完整', status: 'failed' }));
      return;
    }

    setIsScreenLoading(true);
    try {
      const orderRes = await axios.post(
        `${BASE_URL}/v2/api/${encodeURIComponent(API_PATH)}/order`,
        {
          data: {
            user: orderState.user,
            message: orderState.message || '',
          },
        }
      );
      dispatch(pushMessage({ text: '訂單已完成', status: 'success' }));

      const orderId = orderRes.data.orderId;
      setOrderId(orderId);
      // const payRes = await axios.post(
      //   `${BASE_URL}/v2/api/${encodeURIComponent(API_PATH)}/pay/${orderId}`
      // );
      // const paidOrder = payRes.data.order;

      // const orderList = JSON.parse(localStorage.getItem('orderList')) || [];
      // const newOrder = {
      //   id: paidOrder.id,
      //   user: paidOrder.user,
      //   total: paidOrder.total,
      //   products: paidOrder.products,
      //   createdAt: new Date().toLocaleString('zh-TW', { hour12: false }),
      // };
      // localStorage.setItem(
      //   'orderList',
      //   JSON.stringify([newOrder, ...orderList])
      // );

      // dispatch(
      //   pushMessage({ text: '該付款成功', status: 'success' })
      // );
      sessionStorage.removeItem('checkoutData');
      // navigate('/checkout-success', { state: { order: newOrder } });
      navigate('/checkout-success');
    } catch (err) {
      const msg = err.response?.data?.message || '送出訂單或付款失敗';
      dispatch(pushMessage({ text: msg, status: 'failed' }));
    } finally {
      setIsScreenLoading(false);
    }
  };

  return (
    <div className='container py-5'>
      <div className='row justify-content-center'>
        <div className='col-lg-8'>
          <h2 className='fw-bold text-center mb-4'>確認付款</h2>

          <div className='border p-4 rounded mb-4 bg-light-subtle'>
            <h5 className='fw-bold mb-3'>顧客資訊</h5>
            <p className='mb-1'>姓名：{orderState?.user.name}</p>
            <p className='mb-1'>Email：{orderState?.user.email}</p>
            <p className='mb-1'>電話：{orderState?.user.tel}</p>
            <p className='mb-1'>地址：{orderState?.user.address}</p>
            {orderState?.message && (
              <p className='mb-0'>備註：{orderState.message}</p>
            )}
          </div>

          <div className='border p-4 rounded mb-4'>
            <h5 className='fw-bold mb-3'>訂單明細</h5>
            {carts.length > 0 ? (
              <ul className='list-group list-group-flush'>
                {carts.map(item => (
                  <li
                    key={item.id}
                    className='list-group-item d-flex justify-content-between'
                  >
                    <span>
                      {item.product.title} x{item.qty}
                    </span>
                    <span>NT${formatPrice(item.total)}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className='text-muted'>目前購物車為空</p>
            )}

            <div className='d-flex justify-content-between mt-3 fw-bold border-top pt-3'>
              <span>總金額</span>
              <span>
                NT$
                {formatPrice(carts.reduce((sum, item) => sum + item.total, 0))}
              </span>
            </div>
          </div>

          <div className='text-center'>
            <button
              className='btn btn-dark btn-lg px-5'
              onClick={handlePlaceOrder}
              disabled={isScreenLoading}
            >
              {isScreenLoading ? '處理中...' : '送出訂單並付款'}
            </button>
          </div>
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
