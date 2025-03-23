import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import ReactLoading from 'react-loading';
import axios from 'axios';

import { pushMessage } from '../../redux/toastSlice';
import { formatPrice } from '../../utils/format';
import { Link } from 'react-router-dom';

export default function CartPage() {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const API_PATH = import.meta.env.VITE_API_PATH;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const dispatch = useDispatch();

  const [carts, setCarts] = useState([]);
  const [isScreenLoading, setIsScreenLoading] = useState(false);

  useEffect(() => {
    setIsScreenLoading(true);
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
      // console.error(error);
      // alert('取得購物車失敗');
      // const rawMessage = error.response?.data?.message;
      // const errorMessage = Array.isArray(rawMessage)
      //   ? rawMessage.join('、')
      //   : rawMessage || '發生錯誤，取得購物車失敗';
      // dispatch(pushMessage({ text: errorMessage, status: 'failed' }));
      handleError(error, '發生錯誤，取得購物車失敗');
    } finally {
      setIsScreenLoading(false);
    }
  };
  //調整購物車品項
  const editCartItem = async (cart_id, product_id, qty = 1) => {
    setIsScreenLoading(true);
    // 如果 qty 小於 1，直接返回不做任何處理 作法A
    if (qty < 1) {
      console.warn('qty 不能小於 1');
      return;
    }
    // if (qty < 1) { // 當 qty 小於 1 時，自動刪除該項目，但是可能造成使用者不理解品像突然消失，故不適用 作法B
    //   return deleCartItem(cart_id);
    // }
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
      // console.error(error);
      // alert('調整購物車數量失敗');
      // const rawMessage = error.response?.data?.message;
      // const errorMessage = Array.isArray(rawMessage)
      //   ? rawMessage.join('、')
      //   : rawMessage || '調整購物車數量失敗，請稍後再試';
      // dispatch(pushMessage({ text: errorMessage, status: 'failed' }));
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
      // console.error(error);
      // alert('刪除購物車品項失敗');
      // const rawMessage = error.response?.data?.message;
      // const errorMessage = Array.isArray(rawMessage)
      //   ? rawMessage.join('、')
      //   : rawMessage || '發生錯誤，刪除購物車品項失敗';
      // dispatch(pushMessage({ text: errorMessage, status: 'failed' }));
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
      // console.error(error);
      // alert('刪除全部購物車失敗');
      // const rawMessage = error.response?.data?.message;
      // const errorMessage = Array.isArray(rawMessage)
      //   ? rawMessage.join('、')
      //   : rawMessage || '發生錯誤，移除全部購物車失敗';
      // dispatch(pushMessage({ text: errorMessage, status: 'failed' }));
      handleError(error, '發生錯誤，移除全部購物車失敗');
    } finally {
      setIsScreenLoading(false);
    }
  };

  //送出訂單 + Submit事件驅動
  const onSubmit = handleSubmit(data => {
    if (carts.length < 1) {
      // 如果 購物車為空，直接返回不做任何處理
      // alert('您的購物車是空的');
      // console.warn('您的購物車是空的');
      dispatch(pushMessage({ text: '您的購物車是空的', status: 'failed' }));
      return;
    }

    const { message, ...user } = data; //data資料"解構"成message，剩下的打包一起變成user
    const userinfo = {
      data: {
        user: user,
        message: message,
      },
    };
    checkOut(userinfo);
  });
  const checkOut = async orderData => {
    setIsScreenLoading(true);
    try {
      await axios.post(`${BASE_URL}/v2/api/${API_PATH}/order`, orderData);
      //成功後刷新購物車，等待下一位客人
      getCarts();
      reset(); // 提交成功後重設表單
      dispatch(pushMessage({ text: '已送出訂單', status: 'success' }));
    } catch (error) {
      handleError(error, '發生錯誤，已送出訂單失敗');
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

  // return (
  //   <>
  //     <div className='container'>
  //       <div className='mt-4'>
  //         {/* cartTable */}
  //         {carts.length > 0 ? (
  //           <>
  //             <div className='text-end py-3'>
  //               <button
  //                 onClick={() => deleAllCart()}
  //                 className='btn btn-outline-danger'
  //                 type='button'
  //               >
  //                 清空購物車
  //               </button>
  //             </div>
  //             <table className='table align-middle'>
  //               <thead>
  //                 <tr>
  //                   <th></th>
  //                   <th>品名</th>
  //                   <th style={{ width: '150px' }}>數量/單位</th>
  //                   <th className='text-end'>單價</th>
  //                 </tr>
  //               </thead>

  //               <tbody>
  //                 {carts.map(cart => (
  //                   <tr key={cart.id}>
  //                     <td>
  //                       <button
  //                         onClick={() => deleCartItem(cart.id)}
  //                         type='button'
  //                         className='btn btn-outline-danger btn-sm'
  //                       >
  //                         x
  //                       </button>
  //                     </td>
  //                     <td>{cart.product.title}</td>
  //                     <td style={{ width: '150px' }}>
  //                       <div className='d-flex align-items-center'>
  //                         <div className='btn-group me-2' role='group'>
  //                           <button
  //                             onClick={() =>
  //                               editCartItem(
  //                                 cart.id,
  //                                 cart.product.id,
  //                                 cart.qty - 1
  //                               )
  //                             }
  //                             type='button'
  //                             className={`btn btn-sm ${
  //                               cart.qty === 1
  //                                 ? 'btn-outline-secondary'
  //                                 : 'btn-outline-dark'
  //                             }`}
  //                             disabled={cart.qty === 1} // 避免 qty 變成 0
  //                           >
  //                             -
  //                           </button>
  //                           <span
  //                             className='btn border border-dark'
  //                             style={{ width: '50px', cursor: 'auto' }}
  //                           >
  //                             {cart.qty}
  //                           </span>

  //                           <button
  //                             onClick={() =>
  //                               editCartItem(
  //                                 cart.id,
  //                                 cart.product.id,
  //                                 cart.qty + 1
  //                               )
  //                             }
  //                             type='button'
  //                             className='btn btn-outline-dark btn-sm'
  //                           >
  //                             +
  //                           </button>
  //                         </div>
  //                         <span className='input-group-text bg-transparent border-0'>
  //                           {cart.product.unit}
  //                         </span>
  //                       </div>
  //                     </td>
  //                     <td className='text-end'> {cart.total}</td>
  //                   </tr>
  //                 ))}
  //               </tbody>
  //               <tfoot>
  //                 <tr>
  //                   <td colSpan='3' className='text-end'>
  //                     總計：
  //                   </td>
  //                   <td className='text-end' style={{ width: '130px' }}>
  //                     {carts.reduce((total, cart) => total + cart.total, 0)}
  //                   </td>
  //                 </tr>
  //               </tfoot>
  //             </table>
  //           </>
  //         ) : (
  //           <div className='text-center text-muted'>
  //             <p>🛒 購物車是空的</p>
  //           </div>
  //         )}
  //       </div>

  //       {/* orderFormTable */}
  //       <div className='my-5 row justify-content-center'>
  //         <form onSubmit={onSubmit} className='col-md-6'>
  //           <div className='mb-3'>
  //             <label htmlFor='email' className='form-label'>
  //               Email
  //             </label>
  //             <input
  //               {...register('email', {
  //                 required: 'Email 欄位必填',
  //                 pattern: {
  //                   value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  //                   message: 'Email 格式錯誤',
  //                 },
  //               })}
  //               id='email'
  //               type='email'
  //               className={`form-control ${errors.email ? 'is-invalid' : ''}`}
  //               placeholder='請輸入 Email'
  //             />
  //             {errors.email && (
  //               <p className='text-danger my-2'>{errors.email.message}</p>
  //             )}
  //           </div>

  //           <div className='mb-3'>
  //             <label htmlFor='name' className='form-label'>
  //               收件人姓名
  //             </label>
  //             <input
  //               {...register('name', { required: '姓名 欄位必填' })}
  //               id='name'
  //               className={`form-control ${errors.name ? 'is-invalid' : ''}`}
  //               placeholder='請輸入姓名'
  //             />
  //             {errors.name && (
  //               <p className='text-danger my-2'>{errors.name.message}</p>
  //             )}
  //           </div>

  //           <div className='mb-3'>
  //             <label htmlFor='tel' className='form-label'>
  //               收件人電話
  //             </label>
  //             <input
  //               {...register('tel', {
  //                 required: '電話 欄位必填',
  //                 pattern: {
  //                   value: /^(0[2-8]\d{7}|09\d{8})$/,
  //                   message: '電話 格式錯誤',
  //                 },
  //               })}
  //               id='tel'
  //               type='text'
  //               className={`form-control ${errors.tel ? 'is-invalid' : ''}`}
  //               placeholder='請輸入電話'
  //             />
  //             {errors.tel && (
  //               <p className='text-danger my-2'>{errors.tel.message}</p>
  //             )}
  //           </div>

  //           <div className='mb-3'>
  //             <label htmlFor='address' className='form-label'>
  //               收件人地址
  //             </label>
  //             <input
  //               {...register('address', { required: '地址 欄位必填' })}
  //               id='address'
  //               type='text'
  //               className={`form-control ${errors.address ? 'is-invalid' : ''}`}
  //               placeholder='請輸入地址'
  //             />

  //             {errors.address && (
  //               <p className='text-danger my-2'>{errors.address.message}</p>
  //             )}
  //           </div>

  //           <div className='mb-3'>
  //             <label htmlFor='message' className='form-label'>
  //               留言
  //             </label>
  //             <textarea
  //               {...register('message')}
  //               id='message'
  //               className='form-control'
  //               cols='30'
  //               rows='10'
  //             ></textarea>
  //           </div>
  //           <div className='text-end'>
  //             <button type='submit' className='btn btn-danger'>
  //               送出訂單
  //             </button>
  //           </div>
  //         </form>
  //       </div>
  //     </div>

  //     {/* ScreenLoading */}
  //     {isScreenLoading && (
  //       <div
  //         className='d-flex justify-content-center align-items-center'
  //         style={{
  //           position: 'fixed',
  //           inset: 0,
  //           backgroundColor: 'rgba(255,255,255,0.3)',
  //           zIndex: 999,
  //         }}
  //       >
  //         <ReactLoading type='spin' color='black' width='4rem' height='4rem' />
  //       </div>
  //     )}
  //   </>
  // );

  return (
    <div className='container-fluid'>
      <div className='container'>
        <div className='mt-3'>
          <h3 className='mt-3 mb-4'>Lorem ipsum</h3>
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
                  {/* <tr className='border-bottom border-top'>
                    <th
                      scope='row'
                      className='border-0 px-0 font-weight-normal py-4'
                    >
                      <img
                        src='https://images.unsplash.com/photo-1502743780242-f10d2ce370f3?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1916&q=80'
                        alt=''
                        style={{
                          width: '72px',
                          height: '72px',
                          objectFit: 'cover',
                        }}
                      />
                      <p className='mb-0 fw-bold ms-3 d-inline-block'>
                        Lorem ipsum
                      </p>
                    </th>
                    <td
                      className='border-0 align-middle'
                      style={{ maxWidth: '160px' }}
                    >
                      <div className='input-group pe-5'>
                        <div className='input-group-prepend'>
                          <button
                            className='btn btn-outline-dark border-0 py-2'
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
                          value='1'
                        />
                        <div className='input-group-append'>
                          <button
                            className='btn btn-outline-dark border-0 py-2'
                            type='button'
                            id='button-addon2'
                          >
                            <i className='fas fa-plus'></i>
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className='border-0 align-middle'>
                      <p className='mb-0 ms-auto'>NT$12,000</p>
                    </td>
                    <td className='border-0 align-middle'>
                      <button
                        className='btn btn-outline-dark border-0 py-2'
                        type='button'
                        id='button-addon2'
                      >
                        <i className='fas fa-times'></i>
                      </button>
                    </td>
                  </tr> */}
                  {carts?.length > 0 ? (
                    carts.map(cart => (
                      <tr key={cart.id} className='border-bottom'>
                        <th
                          scope='row'
                          className='border-0 px-0 font-weight-normal py-4'
                        >
                          <img
                            src='https://images.unsplash.com/photo-1502743780242-f10d2ce370f3?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1916&q=80'
                            alt=''
                            style={{
                              width: '72px',
                              height: '72px',
                              objectFit: 'cover',
                            }}
                          />
                          <p className='mb-0 fw-bold ms-3 d-inline-block'>
                            {cart.product.title}
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
                                    cart.id,
                                    cart.product.id,
                                    cart.qty - 1
                                  )
                                }
                                className={`btn border-0 py-2 ${
                                  cart.qty === 1
                                    ? 'btn-outline-secondary'
                                    : 'btn-outline-dark'
                                }`}
                                disabled={cart.qty === 1} // 避免 qty 變成 0
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
                              value={cart.qty}
                            />
                            <div className='input-group-append'>
                              <button
                                onClick={() =>
                                  editCartItem(
                                    cart.id,
                                    cart.product.id,
                                    cart.qty + 1
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
                            {formatPrice(cart.total)}
                          </p>
                        </td>
                        <td className='border-0 align-middle'>
                          <button
                            onClick={() => deleCartItem(cart.id)}
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

                  {/* {carts.map(cart => (
                    <tr key={cart.id} className='border-bottom'>
                      <th
                        scope='row'
                        className='border-0 px-0 font-weight-normal py-4'
                      >
                        <img
                          src='https://images.unsplash.com/photo-1502743780242-f10d2ce370f3?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1916&q=80'
                          alt=''
                          style={{
                            width: '72px',
                            height: '72px',
                            objectFit: 'cover',
                          }}
                        />
                        <p className='mb-0 fw-bold ms-3 d-inline-block'>
                          {cart.product.title}
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
                                  cart.id,
                                  cart.product.id,
                                  cart.qty - 1
                                )
                              }
                              className={`btn border-0 py-2 ${
                                cart.qty === 1
                                  ? 'btn-outline-secondary'
                                  : 'btn-outline-dark'
                              }`}
                              disabled={cart.qty === 1} // 避免 qty 變成 0
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
                            value={cart.qty}
                          />
                          <div className='input-group-append'>
                            <button
                              onClick={() =>
                                editCartItem(
                                  cart.id,
                                  cart.product.id,
                                  cart.qty + 1
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
                          {formatPrice(cart.total)}
                        </p>
                      </td>
                      <td className='border-0 align-middle'>
                        <button
                          onClick={() => deleCartItem(cart.id)}
                          type='button'
                          className='btn btn-outline-dark border-0 py-2'
                        >
                          <i className='fas fa-times'></i>
                        </button>
                      </td>
                    </tr>
                  ))} */}
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
                <Link to='/checkout' className='btn btn-dark w-100 mt-4'>
                  送出訂單
                </Link>
              </div>
            </div>
          </div>

          {/* <div className='my-5'>
            <h3 className='fw-bold'>Lorem ipsum dolor sit amet</h3>
            <div className='swiper-container mt-4 mb-5'>
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
          </div> */}
        </div>
      </div>
    </div>
  );
}
