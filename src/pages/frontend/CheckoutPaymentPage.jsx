import { Link } from 'react-router-dom';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { pushMessage } from '../../redux/toastSlice';
import { formatPrice } from '../../utils/format';
import { useCallback, useEffect, useState } from 'react';

export default function CheckoutPaymentPage() {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const API_PATH = import.meta.env.VITE_API_PATH;

  const dispatch = useDispatch();
  const { state } = useLocation(); // 取得從上一頁帶過來的 user + message + carts
  const navigate = useNavigate();

  const [payment, setPayment] = useState('現金支付');
  const [isScreenLoading, setIsScreenLoading] = useState(false);

  const handlePlaceOrder = async () => {
    setIsScreenLoading(true);
    try {
      const orderData = {
        data: {
          user: state.user,
          message: state.message,
          carts: state.carts,
          // API 規範不需要 payment，但你可以備註在 message 裡
        },
      };

      await axios.post(`${BASE_URL}/v2/api/${API_PATH}/order`, orderData);
      dispatch(pushMessage({ text: '已送出訂單', status: 'success' }));
      navigate('/checkout-success');
    } catch (error) {
      handleError(error, '發生錯誤，已送出訂單失敗');
    } finally {
      setIsScreenLoading(false);
    }
  };
  // 錯誤處理共用函式、錯誤訊息統一處理，如有多筆資訊就'、'串接
  const handleError = (error, fallback = '操作失敗，請稍後再試') => {
    const rawMessage = error.response?.data?.message;
    const errorMessage = Array.isArray(rawMessage)
      ? rawMessage.join('、')
      : rawMessage || fallback;
    dispatch(pushMessage({ text: errorMessage, status: 'failed' }));
  };

  // const handlePayment = payment => {
  //   setPayment(payment);
  // };
  // 使用 useCallback 來記住 handlePayment 函數的引用
  const handlePayment = useCallback(payment => {
    setPayment(payment);
  }, []); // 這裡的空數組意味著只在組件首次渲染時創建一次函數，之後保持不變

  useEffect(() => {
    setIsScreenLoading(true);
    // console.log('🔥 useLocation state：', state);
    setTimeout(() => {
      setIsScreenLoading(false);
    }, 1000);
  }, []);

  if (!state || !state.user || !state.carts) {
    return (
      <div className='container text-center mt-5'>
        <h5 className='text-danger'>
          無法取得訂單資訊，請從結帳頁面重新操作。
        </h5>
        <Link to='/checkout-form' className='btn btn-dark mt-3'>
          返回結帳頁
        </Link>
      </div>
    );
  } else {
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
                  <i className='fas fa-check-circle d-md-inline d-block text-center'></i>
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
            <h3 className='fw-bold mb-4 pt-3'>Checkout-Payment</h3>
          </div>
        </div>
        <div className='row flex-row-reverse justify-content-center pb-5'>
          <div className='col-md-4'>
            <div className='border p-4 mb-4'>
              {state.carts?.length > 0 ? (
                state.carts.map(cartItem => (
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
                      {formatPrice(
                        state.carts.reduce(
                          (total, cart) => total + cart.total,
                          0
                        )
                      )}
                    </td>
                  </tr>
                  <tr>
                    <th
                      scope='row'
                      className='border-0 px-0 pt-0 pb-4 font-weight-normal'
                    >
                      Payment
                    </th>
                    <td className='text-end border-0 px-0 pt-0 pb-4'>
                      {payment}
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className='d-flex justify-content-between mt-4'>
                <p className='mb-0 h4 fw-bold'>Total</p>
                <p className='mb-0 h4 fw-bold'>
                  {formatPrice(
                    state.carts.reduce((total, cart) => total + cart.total, 0)
                  )}
                </p>
              </div>
            </div>
          </div>
          <div className='col-md-6'>
            <div className='accordion' id='accordionExample'>
              <div className='card rounded-0'>
                <div
                  onClick={() => handlePayment('現金支付')}
                  className='card-header bg-white border-0 py-3'
                  id='headingOne'
                  data-bs-toggle='collapse'
                  data-bs-target='#collapseOne'
                  aria-expanded='true'
                  aria-controls='collapseOne'
                >
                  <p className='mb-0 position-relative custom-checkout-label'>
                    現金支付
                  </p>
                </div>
                <div
                  id='collapseOne'
                  className='collapse show'
                  aria-labelledby='headingOne'
                  data-bs-parent='#accordionExample'
                >
                  {/* 內容留空也可，或完全拿掉這層 <div className='card-body'>
                  Bootstrap 允許這樣作法，不會壞掉，只是沒有視覺上的內容。開合動作仍正常，且可收合其他區塊。  */}
                  {/* <div className='card-body bg-light ps-5 py-4'>
                    <p className='text-muted mb-1'>
                      選擇此付款方式，無需填寫額外資訊
                    </p>
                  </div> */}
                </div>
              </div>
              <div className='card rounded-0'>
                <div
                  onClick={() => handlePayment('Apple Pay')}
                  className='card-header bg-white border-0 py-3 collapsed'
                  id='headingTwo'
                  data-bs-toggle='collapse'
                  data-bs-target='#collapseTwo'
                  aria-expanded='true'
                  aria-controls='collapseTwo'
                >
                  <p className='mb-0 position-relative custom-checkout-label'>
                    Apple Pay
                  </p>
                </div>
                <div
                  id='collapseTwo'
                  className='collapse'
                  aria-labelledby='headingTwo'
                  data-bs-parent='#accordionExample'
                >
                  <div className='card-body bg-light ps-5 py-4'>
                    <div className='mb-2'>
                      <label htmlFor='Lorem ipsum1' className='text-muted mb-0'>
                        信用卡號
                      </label>
                      <input
                        type='text'
                        className='form-control'
                        id='Lorem ipsum1'
                        placeholder='XXXX-XXXX-XXXX-XXXX'
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className='card rounded-0'>
                <div
                  onClick={() => handlePayment('Line Pay')}
                  className='card-header bg-white border-0 py-3 collapsed'
                  id='headingThree'
                  data-bs-toggle='collapse'
                  data-bs-target='#collapseThree'
                  aria-expanded='true'
                  aria-controls='collapseThree'
                >
                  <p className='mb-0 position-relative custom-checkout-label'>
                    Line Pay
                  </p>
                </div>
                <div
                  id='collapseThree'
                  className='collapse'
                  aria-labelledby='headingThree'
                  data-bs-parent='#accordionExample'
                >
                  {/* <div className='card-body bg-light ps-5 py-4'>
                    <div className='mb-2'>
                      <label htmlFor='Lorem ipsum1' className='text-muted mb-0'>
                        Lorem ipsum
                      </label>
                      <input
                        type='text'
                        className='form-control'
                        id='Lorem ipsum1'
                        placeholder='Lorem ipsum'
                      />
                    </div>
                    <div className='mb-0'>
                      <label htmlFor='Lorem ipsum2' className='text-muted mb-0'>
                        Lorem ipsum
                      </label>
                      <input
                        type='text'
                        className='form-control'
                        id='Lorem ipsum2'
                        placeholder='Lorem ipsum'
                      />
                    </div>
                  </div> */}
                </div>
              </div>
            </div>
            <div className='d-flex flex-column-reverse flex-md-row mt-4 justify-content-between align-items-md-center align-items-end w-100'>
              <Link to='/checkout-form' className='text-dark mt-md-0 mt-3'>
                <i className='fas fa-chevron-left me-2'></i> Return to
                Checkout-Form
              </Link>
              {/* <Link to='/checkout-success' className='btn btn-dark py-3 px-7'>
                Place Order
              </Link> */}
              <button
                type='submit'
                onClick={handlePlaceOrder}
                className='btn btn-dark py-3 px-7'
              >
                Place Order
              </button>
              {/* <button
                type='submit'
                className='btn btn-dark py-3 px-7'
                disabled={isScreenLoading}
              >
                {isScreenLoading ? '處理中...' : 'Place Order'}
              </button> */}
            </div>
          </div>
        </div>

        {/* ScreenLoading */}
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
            <ReactLoading
              type='spin'
              color='black'
              width='4rem'
              height='4rem'
            />
          </div>
        )}
      </div>
    );
  }
}
