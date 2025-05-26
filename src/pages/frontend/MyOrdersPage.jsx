import { useEffect, useState } from 'react';
import axios from 'axios';
import ReactLoading from 'react-loading';
import { formatPrice } from '@/utils/format';
import { useDispatch } from 'react-redux';
import { pushMessage } from '@/redux/toastSlice';

export default function MyOrdersPage() {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const API_PATH = import.meta.env.VITE_API_PATH;
  const dispatch = useDispatch();

  const [orders, setOrders] = useState([]);
  const [isScreenLoading, setIsScreenLoading] = useState(false);

  useEffect(() => {
    setIsScreenLoading(true);
    const fetchOrders = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/v2/api/${encodeURIComponent(API_PATH)}/orders`
        );
        setOrders(res.data.orders);
      } catch (error) {
        console.error('取得訂單失敗:', error);
        // fallback 回 localStorage
        const fallbackOrders =
          JSON.parse(localStorage.getItem('orderList')) || [];
        if (fallbackOrders.length > 0) {
          dispatch(
            pushMessage({ text: '從本地紀錄載入訂單', status: 'warning' })
          );
          setOrders(fallbackOrders);
        } else {
          dispatch(pushMessage({ text: '無法取得訂單紀錄', status: 'failed' }));
        }
      } finally {
        setIsScreenLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handlePay = async orderId => {
    try {
      await axios.post(`${BASE_URL}/v2/api/${API_PATH}/pay/${orderId}`);
      // 不再從 res.data 拿 order，直接用 orderId 去更新本地 state
      const updatedOrders = orders.map(o =>
        o.id === orderId ? { ...o, is_paid: true } : o
      );
      setOrders(updatedOrders);
      localStorage.setItem('orderList', JSON.stringify(updatedOrders));

      dispatch(pushMessage({ text: '付款成功！', status: 'success' }));
    } catch (error) {
      console.error('取得訂單失敗:', error);
      dispatch(
        pushMessage({
          text: error.response?.data?.message || '付款失敗，請稍後再試',
          status: 'failed',
        })
      );
    }
  };

  return (
    <div className='container my-5'>
      <h2 className='fw-bold text-center mb-4'>我的訂單紀錄</h2>
      {orders.length === 0 ? (
        <p className='text-center text-muted'>目前尚無任何訂單紀錄</p>
      ) : (
        <div className='table-responsive'>
          <table className='table table-hover text-center align-middle'>
            <thead>
              <tr>
                <th>訂單編號</th>
                <th>顧客姓名</th>
                <th>總金額</th>
                <th>付款狀態</th>
                <th>下單時間</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.user?.name}</td>
                  <td>NT${formatPrice(order.total)}</td>
                  <td>{order.is_paid ? '已付款' : '未付款'}</td>
                  <td>{order.createdAt}</td>
                  <td>
                    {!order.is_paid ? (
                      <button
                        className='btn btn-sm btn-outline-dark'
                        onClick={() => handlePay(order.id)}
                      >
                        前往付款
                      </button>
                    ) : (
                      <span className='text-muted'>-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
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
          <ReactLoading type='spin' color='black' width='4rem' height='4rem' />
        </div>
      )}
    </div>
  );
}
