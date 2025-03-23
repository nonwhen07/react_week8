import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
// import { useForm } from 'react-hook-form';
import ReactLoading from 'react-loading';
import axios from 'axios';

import { pushMessage } from '../../redux/toastSlice';
import { formatPrice } from '../../utils/format';
import { Link } from 'react-router-dom';

import Swiper from 'swiper';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';

export default function CartPage() {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const API_PATH = import.meta.env.VITE_API_PATH;

  // const {
  //   register,
  //   handleSubmit,
  //   formState: { errors },
  //   reset,
  // } = useForm();

  const dispatch = useDispatch();

  const swiperRef = useRef(null);

  const [carts, setCarts] = useState([]);
  const [isScreenLoading, setIsScreenLoading] = useState(false);

  useEffect(() => {
    setIsScreenLoading(true);
    //畫面渲染後初步載入購物車
    getCarts();

    new Swiper(swiperRef.current, {
      modules: [Autoplay],
      loop: true,
      autoplay: {
        delay: 3000,
        disableOnInteraction: false,
      },
      slidesPerView: 2,
      spaceBetween: 10,
      breakpoints: {
        767: {
          slidesPerView: 3,
          spaceBetween: 30,
        },
      },
    });
  }, []);

  //取得cart
  const getCarts = async () => {
    setIsScreenLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/cart`);
      setCarts(res.data.data.carts);
    } catch (error) {
      handleError(error, '發生錯誤，取得購物車失敗');
    } finally {
      setIsScreenLoading(false);
    }
  };
  //調整購物車品項
  const editCartItem = async (cart_id, product_id, qty = 1) => {
    setIsScreenLoading(true);
    // 如果 qty 小於 1，直接返回不做任何處理 作法A
    // if (qty < 1) { // 當 qty 小於 1 時，自動刪除該項目，但是可能造成使用者不理解品像突然消失，故不適用 作法B
    //   return deleCartItem(cart_id);
    // }
    if (qty < 1) {
      console.warn('qty 不能小於 1');
      return;
    }
    try {
      await axios.put(`${BASE_URL}/v2/api/${API_PATH}/cart/${cart_id}`, {
        data: {
          product_id,
          qty: Number(qty),
        },
      });
      //成功後刷新購物車
      getCarts();
      dispatch(pushMessage({ text: '調整購物車數量成功', status: 'success' }));
    } catch (error) {
      handleError(error, '發生錯誤，調整購物車數量失敗');
    } finally {
      setIsScreenLoading(false);
    }
  };
  //刪除購物車品項
  const deleCartItem = async cart_id => {
    setIsScreenLoading(true);
    try {
      await axios.delete(`${BASE_URL}/v2/api/${API_PATH}/cart/${cart_id}`);
      //成功後刷新購物車
      getCarts();
      dispatch(pushMessage({ text: '刪除購物車品項成功', status: 'success' }));
    } catch (error) {
      handleError(error, '發生錯誤，刪除購物車品項失敗');
    } finally {
      setIsScreenLoading(false);
    }
  };
  //移除全部購物車品項
  const deleAllCart = async () => {
    setIsScreenLoading(true);
    try {
      await axios.delete(`${BASE_URL}/v2/api/${API_PATH}/carts`);
      // alert('刪除全部購物車成功');
      dispatch(pushMessage({ text: '移除全部購物車成功', status: 'success' }));
      //成功後刷新購物車
      getCarts();
    } catch (error) {
      handleError(error, '發生錯誤，移除全部購物車失敗');
    } finally {
      setIsScreenLoading(false);
    }
  };

  // 錯誤處理共用函式
  const handleError = (error, fallback = '操作失敗，請稍後再試') => {
    const rawMessage = error.response?.data?.message;
    const errorMessage = Array.isArray(rawMessage)
      ? rawMessage.join('、')
      : rawMessage || fallback;
    dispatch(pushMessage({ text: errorMessage, status: 'failed' }));
  };

  return (
    <div className='container-fluid'>
      <div className='container'>
        <div className='mt-3'>
          <h3 className='mt-3 mb-4'>Shopping Cart</h3>
          <div className='row'>
            <div className='col-md-8'>
              <table className='table'>
                <thead>
                  <tr>
                    <th scope='col' className='border-0 ps-0'>
                      品名
                    </th>
                    <th scope='col' className='border-0'>
                      數量/單位
                    </th>
                    <th scope='col' className='border-0'>
                      單價
                    </th>
                    <th scope='col' className='border-0'></th>
                  </tr>
                </thead>
                <tbody>
                  {carts?.length > 0 ? (
                    carts.map(cartItem => (
                      <tr key={cartItem.id} className='border-bottom'>
                        <th
                          scope='row'
                          className='border-0 px-0 font-weight-normal py-4'
                        >
                          <img
                            src={cartItem.product.imageUrl}
                            alt={cartItem.product.title}
                            style={{
                              width: '72px',
                              height: '72px',
                              objectFit: 'cover',
                            }}
                          />
                          <p className='mb-0 fw-bold ms-3 d-inline-block'>
                            {cartItem.product.title}
                          </p>
                        </th>
                        <td
                          className='border-0 align-middle'
                          style={{ maxWidth: '160px' }}
                        >
                          <div className='input-group pe-5'>
                            <div className='input-group-prepend'>
                              <button
                                onClick={() =>
                                  editCartItem(
                                    cartItem.id,
                                    cartItem.product.id,
                                    cartItem.qty - 1
                                  )
                                }
                                className={`btn border-0 py-2 ${
                                  cartItem.qty === 1
                                    ? 'btn-outline-secondary'
                                    : 'btn-outline-dark'
                                }`}
                                disabled={cartItem.qty === 1} // 避免 qty 變成 0
                                type='button'
                                id='button-addon1'
                              >
                                <i className='fas fa-minus'></i>
                              </button>
                            </div>
                            <input
                              type='text'
                              className='form-control border-0 text-center my-auto shadow-none'
                              placeholder=''
                              aria-label='Example text with button addon'
                              aria-describedby='button-addon1'
                              value={cartItem.qty}
                            />
                            <div className='input-group-append'>
                              <button
                                onClick={() =>
                                  editCartItem(
                                    cartItem.id,
                                    cartItem.product.id,
                                    cartItem.qty + 1
                                  )
                                }
                                type='button'
                                className='btn btn-outline-dark border-0 py-2'
                                id='button-addon2'
                              >
                                <i className='fas fa-plus'></i>
                              </button>
                            </div>
                          </div>
                        </td>
                        <td className='border-0 align-middle'>
                          <p className='mb-0 ms-auto'>
                            {formatPrice(cartItem.total)}
                          </p>
                        </td>
                        <td className='border-0 align-middle'>
                          <button
                            onClick={() => deleCartItem(cartItem.id)}
                            type='button'
                            className='btn btn-outline-dark border-0 py-2'
                          >
                            <i className='fas fa-times'></i>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan='4' className='text-center py-4'>
                        購物車是空的
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              <div className='input-group w-50 mb-3'>
                <input
                  type='text'
                  className='form-control rounded-0 border-bottom border-top-0 border-start-0 border-end-0 shadow-none'
                  placeholder='Coupon Code'
                  aria-label="Recipient's username"
                  aria-describedby='button-addon2'
                />
                <div className='input-group-append'>
                  <button
                    className='btn btn-outline-dark border-bottom border-top-0 border-start-0 border-end-0 rounded-0'
                    type='button'
                    id='button-addon2'
                  >
                    <i className='fas fa-paper-plane'></i>
                  </button>
                </div>
              </div>
            </div>
            <div className='col-md-4'>
              <div className='border p-4 mb-4'>
                <h4 className='fw-bold mb-4'>Order Detail</h4>
                <table className='table text-muted border-bottom'>
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
                          carts.reduce((total, cart) => total + cart.total, 0)
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
                        ApplePay
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div className='d-flex justify-content-between mt-4'>
                  <p className='mb-0 h4 fw-bold'>Total</p>
                  <p className='mb-0 h4 fw-bold'>
                    {formatPrice(
                      carts.reduce((total, cart) => total + cart.total, 0)
                    )}
                  </p>
                </div>
                <Link
                  to='/checkout-form'
                  disabled={carts?.length > 0 ? false : true}
                  className='btn btn-dark w-100 mt-4'
                >
                  Checkout
                </Link>
              </div>
            </div>
          </div>

          {/* 副圖區輪播，未來可以用 */}
          <div className='my-5'>
            <h3 className='fw-bold'>Lorem ipsum dolor sit amet</h3>
            <div ref={swiperRef} className='swiper mt-4 mb-5'>
              <div className='swiper-wrapper'>
                <div className='swiper-slide'>
                  <div className='card border-0 mb-4 position-relative position-relative'>
                    <img
                      src='https://images.unsplash.com/photo-1490312278390-ab64016e0aa9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80'
                      className='card-img-top rounded-0'
                      alt='...'
                    />
                    <a href='#' className='text-dark'></a>
                    <div className='card-body p-0'>
                      <h4 className='mb-0 mt-3'>
                        <a href='#'>Lorem ipsum</a>
                      </h4>
                      <p className='card-text mb-0'>
                        NT$1,080
                        <span className='text-muted '>
                          <del>NT$1,200</del>
                        </span>
                      </p>
                      <p className='text-muted mt-3'></p>
                    </div>
                  </div>
                </div>
                <div className='swiper-slide'>
                  <div className='card border-0 mb-4 position-relative position-relative'>
                    <img
                      src='https://images.unsplash.com/photo-1490312278390-ab64016e0aa9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80'
                      className='card-img-top rounded-0'
                      alt='...'
                    />
                    <a href='#' className='text-dark'></a>
                    <div className='card-body p-0'>
                      <h4 className='mb-0 mt-3'>
                        <a href='#'>Lorem ipsum</a>
                      </h4>
                      <p className='card-text mb-0'>
                        NT$1,080
                        <span className='text-muted '>
                          <del>NT$1,200</del>
                        </span>
                      </p>
                      <p className='text-muted mt-3'></p>
                    </div>
                  </div>
                </div>
                <div className='swiper-slide'>
                  <div className='card border-0 mb-4 position-relative position-relative'>
                    <img
                      src='https://images.unsplash.com/photo-1490312278390-ab64016e0aa9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80'
                      className='card-img-top rounded-0'
                      alt='...'
                    />
                    <a href='#' className='text-dark'></a>
                    <div className='card-body p-0'>
                      <h4 className='mb-0 mt-3'>
                        <a href='#'>Lorem ipsum</a>
                      </h4>
                      <p className='card-text mb-0'>
                        NT$1,080
                        <span className='text-muted '>
                          <del>NT$1,200</del>
                        </span>
                      </p>
                      <p className='text-muted mt-3'></p>
                    </div>
                  </div>
                </div>
                <div className='swiper-slide'>
                  <div className='card border-0 mb-4 position-relative position-relative'>
                    <img
                      src='https://images.unsplash.com/photo-1490312278390-ab64016e0aa9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80'
                      className='card-img-top rounded-0'
                      alt='...'
                    />
                    <a href='#' className='text-dark'></a>
                    <div className='card-body p-0'>
                      <h4 className='mb-0 mt-3'>
                        <a href='#'>Lorem ipsum</a>
                      </h4>
                      <p className='card-text mb-0'>
                        NT$1,080
                        <span className='text-muted '>
                          <del>NT$1,200</del>
                        </span>
                      </p>
                      <p className='text-muted mt-3'></p>
                    </div>
                  </div>
                </div>
                <div className='swiper-slide'>
                  <div className='card border-0 mb-4 position-relative position-relative'>
                    <img
                      src='https://images.unsplash.com/photo-1490312278390-ab64016e0aa9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80'
                      className='card-img-top rounded-0'
                      alt='...'
                    />
                    <a href='#' className='text-dark'></a>
                    <div className='card-body p-0'>
                      <h4 className='mb-0 mt-3'>
                        <a href='#'>Lorem ipsum</a>
                      </h4>
                      <p className='card-text mb-0'>
                        NT$1,080
                        <span className='text-muted '>
                          <del>NT$1,200</del>
                        </span>
                      </p>
                      <p className='text-muted mt-3'></p>
                    </div>
                  </div>
                </div>
              </div>
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
    </div>
  );
}
