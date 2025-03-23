import { Link } from 'react-router-dom';

export default function CheckoutSuccessPage() {
  return (
    <div className='container-fluid'>
      <div className='position-relative d-flex'>
        <div
          className='container d-flex flex-column'
          style={{ minHeight: '100vh' }}
        >
          {/* <nav className='navbar navbar-expand-lg navbar-light px-0'>
            <a className='navbar-brand' href='./index.html'>
              Navbar
            </a>
          </nav> */}
          {/* <nav className='navbar navbar-expand-lg navbar-light px-0'>
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
          </nav> */}

          <div className='row my-auto pb-7'>
            <div className='col-md-4 d-flex flex-column'>
              <div className='my-auto'>
                <h2>訂單完成，感謝您的支持！</h2>
                <p>
                  我們已收到您的訂單，將盡快為您安排處理。
                  <br />
                  期待為您送上溫暖香氣的咖啡與甜點。
                </p>
                <Link to={'/'} className='btn btn-dark mt-4 px-5'>
                  Back To Home
                </Link>
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
