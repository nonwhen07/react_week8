import { useLocation, Link } from 'react-router-dom';

export default function CheckoutSuccessPage() {
  // const location = useLocation();
  // const order = location.state?.order;
  const { order } = useLocation().state || {};
  if (!order) {
    return (
      <div className='text-center mt-5'>
        <h2>找不到訂單資料</h2>
        <Link to='/' className='btn btn-outline-dark mt-3'>
          回首頁
        </Link>
      </div>
    );
  }

  return (
    <div className='container-fluid'>
      <div className='position-relative d-flex'>
        <div
          className='container d-flex flex-column'
          style={{ minHeight: '100vh' }}
        >
          <nav className='navbar navbar-expand-lg navbar-light px-0'>
            <ul className='list-unstyled mb-0 ms-md-auto d-flex align-items-center justify-content-between justify-content-md-start w-100 mt-md-0 mt-4'>
              <li className='me-md-6 me-3 position-relative custom-step-line'>
                <i className='fas fa-check-circle d-md-inline d-block text-center'></i>
                <span className='text-nowrap fw-bold'>Checkout-Form</span>
              </li>
              <li className='me-md-6 me-3 position-relative custom-step-line'>
                <i className='fas fa-check-circle d-md-inline d-block text-center'></i>
                <span className='text-nowrap'>Checkout-Payment</span>
              </li>
              <li>
                <i className='fas fa-check-circle d-md-inline d-block text-center'></i>
                <span className='text-nowrap'>Checkout-Success</span>
              </li>
            </ul>
          </nav>

          <div className='row mt-6 pb-2'>
            <div className='col-md-4 d-flex flex-column'>
              <div className='my-auto'>
                <h2 className='fw-bold text-center'>
                  訂單完成，感謝您的支持！
                </h2>
                <div className='mx-auto mt-4' style={{ maxWidth: '600px' }}>
                  <p>
                    <strong>訂單編號：</strong>
                    {order.id}
                  </p>
                  <p>
                    <strong>顧客姓名：</strong>
                    {order.user.name}
                  </p>
                  <p>
                    <strong>總金額：</strong>NT${order.total}
                  </p>
                  <p>
                    <strong>下單時間：</strong>
                    {order.createdAt}
                  </p>
                </div>
                <div className='text-center mt-4'>
                  <Link to='/orders' className='btn btn-outline-dark'>
                    查看歷史訂單
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className='w-md-50 w-100 position-absolute opacity-1'
          style={{
            zIndex: -1,
            minHeight: '100vh',
            right: 0,
            backgroundImage:
              'url(https://images.unsplash.com/photo-1480399129128-2066acb5009e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80)',
            backgroundPosition: 'center center',
          }}
        ></div>
      </div>
    </div>
  );
}
