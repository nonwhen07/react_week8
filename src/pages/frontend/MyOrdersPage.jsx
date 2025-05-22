import { useEffect, useState } from 'react';

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const orderList = JSON.parse(localStorage.getItem('orderList')) || [];
    setOrders(orderList);
  }, []);

  return (
    <div className='container my-5'>
      <h2 className='fw-bold text-center mb-4'>我的歷史訂單</h2>
      {orders.length === 0 ? (
        <p className='text-center text-muted'>目前尚無任何訂單紀錄</p>
      ) : (
        <div className='table-responsive'>
          <table className='table table-hover text-center align-middle'>
            <thead>
              <tr>
                <th>訂單編號</th>
                <th>顧客姓名</th>
                <th>電子郵件</th>
                <th>總金額</th>
                <th>下單時間</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={order.id || index}>
                  <td>{order.id}</td>
                  <td>{order.user?.name}</td>
                  <td>{order.user?.email}</td>
                  <td>NT${order.total}</td>
                  <td>{order.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
