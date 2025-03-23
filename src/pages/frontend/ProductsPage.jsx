import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import ReactLoading from 'react-loading';

import { pushMessage } from '../../redux/toastSlice';
import { formatPrice } from '../../utils/format';

export default function ProductsPage() {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const API_PATH = import.meta.env.VITE_API_PATH;

  const dispatch = useDispatch();

  const [products, setProducts] = useState([]);
  // const [tempProduct, setTempProduct] = useState([]);
  const [isScreenLoading, setIsScreenLoading] = useState(false);
  // const [isLoading, setIsLoading] = useState(false); //改用下面的loadingItems，先儲存商品ID來標定loading位置
  const [loadingItems, setLoadingItems] = useState({}); // 用物件儲存各商品的 Loading 狀態

  useEffect(() => {
    setIsScreenLoading(true);
    const getProducts = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/products`);
        setProducts(res.data.products);
      } catch (error) {
        // console.error(error);
        // alert('取得產品失敗');

        const rawMessage = error.response?.data?.message;
        const errorMessage = Array.isArray(rawMessage)
          ? rawMessage.join('、')
          : rawMessage || '操作失敗，請稍後再試';
        dispatch(pushMessage({ text: errorMessage, status: 'failed' }));
      } finally {
        setIsScreenLoading(false);
      }
    };
    //畫面渲染後初步載入產品列表+購物車
    getProducts();
  }, []);

  //加入購物車
  const addCartItem = async (product_id, qty = 1, source = 'table') => {
    // 如果 qty 小於 1，直接返回不做任何處理
    if (qty < 1) {
      console.warn('qty 不能小於 1');
      return;
    }

    setLoadingItems(prev => ({
      ...prev,
      [product_id]: { ...prev[product_id], [source]: true }, // 只改變對應的 source
    }));

    try {
      await axios.post(`${BASE_URL}/v2/api/${API_PATH}/cart`, {
        data: {
          product_id,
          qty: Number(qty),
        },
      });
      //closeModal();
      dispatch(pushMessage({ text: '商品加入購物車成功', status: 'success' }));
    } catch (error) {
      // console.error(error);
      // alert('加入購物車失敗');
      const rawMessage = error.response?.data?.message;
      const errorMessage = Array.isArray(rawMessage)
        ? rawMessage.join('、')
        : rawMessage || '發生錯誤，加入購物車失敗，請稍後再試';
      dispatch(pushMessage({ text: errorMessage, status: 'failed' }));
    } finally {
      setLoadingItems(prev => ({
        ...prev,
        [product_id]: { ...prev[product_id], [source]: false }, // 結束 Loading
      }));
    }
  };

  // return (
  //   <>
  //     <div className='container'>
  //       <div className='mt-4'>
  //         <table className='table align-middle'>
  //           <thead>
  //             <tr>
  //               <th>圖片</th>
  //               <th>商品名稱</th>
  //               <th>價格</th>
  //               <th
  //                 style={{
  //                   minWidth: '200px',
  //                   width: 'auto',
  //                   maxWidth: '280px',
  //                 }}
  //               ></th>
  //             </tr>
  //           </thead>
  //           <tbody>
  //             {products.map(product => (
  //               <tr key={product.id}>
  //                 <td style={{ width: '200px' }}>
  //                   <img
  //                     className='img-fluid'
  //                     src={product.imageUrl}
  //                     alt={product.title}
  //                   />
  //                 </td>
  //                 <td>{product.title}</td>
  //                 <td>
  //                   <del className='h6'>原價 {product.origin_price} 元</del>
  //                   <div className='h5'>特價 {product.price}元</div>
  //                 </td>
  //                 <td>
  //                   <div className='btn-group btn-group-sm'>
  //                     <Link
  //                       to={`/product/${product.id}`}
  //                       type='button'
  //                       className='btn btn-outline-secondary'
  //                     >
  //                       查看更多
  //                     </Link>
  //                     <button
  //                       disabled={loadingItems[product.id]?.table}
  //                       onClick={() => addCartItem(product.id, 1, 'table')}
  //                       type='button'
  //                       className='btn btn-outline-danger d-flex align-items-center'
  //                     >
  //                       加到購物車
  //                       {loadingItems[product.id]?.table && (
  //                         // <ReactLoading className="d-flex align-items-center" type="spin" color="#000" height="1.25rem" width="1.25rem" />
  //                         <div
  //                           className='d-flex align-items-center'
  //                           style={{
  //                             width: '20px',
  //                             height: '20px',
  //                             display: 'flex',
  //                             alignItems: 'center',
  //                             justifyContent: 'center',
  //                           }}
  //                         >
  //                           <ReactLoading
  //                             type='spin'
  //                             color='#000'
  //                             height='1.25rem'
  //                             width='1.25rem'
  //                           />
  //                         </div>
  //                       )}
  //                     </button>
  //                   </div>
  //                 </td>
  //               </tr>
  //             ))}
  //           </tbody>
  //         </table>
  //       </div>
  //     </div>
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

  // 套用六角板型
  return (
    <div className='container-fluid'>
      <div
        className='position-relative d-flex align-items-center justify-content-center'
        style={{ minHeight: '400px' }}
      >
        <div
          className='position-absolute'
          style={{
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            backgroundImage:
              'url(https://images.unsplash.com/photo-1480399129128-2066acb5009e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80)',
            backgroundPosition: 'center center',
            opacity: 0.1,
          }}
        ></div>
        <h2 className='fw-bold'>Lorem ipsum.</h2>
      </div>
      <div className='container mt-md-5 mt-3 mb-7'>
        <div className='row'>
          <div className='col-md-4'>
            <div
              className='accordion border border-bottom border-top-0 border-start-0 border-end-0 mb-3'
              id='accordionExample'
            >
              <div className='card border-0'>
                <div
                  className='card-header px-0 py-4 bg-white border border-bottom-0 border-top border-start-0 border-end-0 rounded-0'
                  id='headingOne'
                  data-bs-toggle='collapse'
                  data-bs-target='#collapseOne'
                >
                  <div className='d-flex justify-content-between align-items-center pe-1'>
                    <h4 className='mb-0'>Lorem ipsum</h4>
                    <i className='fas fa-chevron-down'></i>
                  </div>
                </div>
                <div
                  id='collapseOne'
                  className='collapse show'
                  aria-labelledby='headingOne'
                  data-bs-parent='#accordionExample'
                >
                  <div className='card-body py-0'>
                    <ul className='list-unstyled'>
                      <li>
                        <a href='#' className='py-2 d-block text-muted'>
                          Lorem ipsum
                        </a>
                      </li>
                      <li>
                        <a href='#' className='py-2 d-block text-muted'>
                          Lorem ipsum
                        </a>
                      </li>
                      <li>
                        <a href='#' className='py-2 d-block text-muted'>
                          Lorem ipsum
                        </a>
                      </li>
                      <li>
                        <a href='#' className='py-2 d-block text-muted'>
                          Lorem ipsum
                        </a>
                      </li>
                      <li>
                        <a href='#' className='py-2 d-block text-muted'>
                          Lorem ipsum
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className='card border-0'>
                <div
                  className='card-header px-0 py-4 bg-white border border-bottom-0 border-top border-start-0 border-end-0 rounded-0'
                  id='headingTwo'
                  data-bs-toggle='collapse'
                  data-bs-target='#collapseTwo'
                >
                  <div className='d-flex justify-content-between align-items-center pe-1'>
                    <h4 className='mb-0'>Lorem ipsum</h4>
                    <i className='fas fa-chevron-down'></i>
                  </div>
                </div>
                <div
                  id='collapseTwo'
                  className='collapse'
                  aria-labelledby='headingTwo'
                  data-bs-parent='#accordionExample'
                >
                  <div className='card-body py-0'>
                    <ul className='list-unstyled'>
                      <li>
                        <a href='#' className='py-2 d-block text-muted'>
                          Lorem ipsum
                        </a>
                      </li>
                      <li>
                        <a href='#' className='py-2 d-block text-muted'>
                          Lorem ipsum
                        </a>
                      </li>
                      <li>
                        <a href='#' className='py-2 d-block text-muted'>
                          Lorem ipsum
                        </a>
                      </li>
                      <li>
                        <a href='#' className='py-2 d-block text-muted'>
                          Lorem ipsum
                        </a>
                      </li>
                      <li>
                        <a href='#' className='py-2 d-block text-muted'>
                          Lorem ipsum
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className='card border-0'>
                <div
                  className='card-header px-0 py-4 bg-white border border-bottom-0 border-top border-start-0 border-end-0 rounded-0'
                  id='headingThree'
                  data-bs-toggle='collapse'
                  data-bs-target='#collapseThree'
                >
                  <div className='d-flex justify-content-between align-items-center pe-1'>
                    <h4 className='mb-0'>Lorem ipsum</h4>
                    <i className='fas fa-chevron-down'></i>
                  </div>
                </div>
                <div
                  id='collapseThree'
                  className='collapse'
                  aria-labelledby='headingThree'
                  data-bs-parent='#accordionExample'
                >
                  <div className='card-body py-0'>
                    <ul className='list-unstyled'>
                      <li>
                        <a href='#' className='py-2 d-block text-muted'>
                          Lorem ipsum
                        </a>
                      </li>
                      <li>
                        <a href='#' className='py-2 d-block text-muted'>
                          Lorem ipsum
                        </a>
                      </li>
                      <li>
                        <a href='#' className='py-2 d-block text-muted'>
                          Lorem ipsum
                        </a>
                      </li>
                      <li>
                        <a href='#' className='py-2 d-block text-muted'>
                          Lorem ipsum
                        </a>
                      </li>
                      <li>
                        <a href='#' className='py-2 d-block text-muted'>
                          Lorem ipsum
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='col-md-8'>
            <div className='row'>
              {/* <div className='col-md-6'>
                <div className='card border-0 mb-4 position-relative position-relative'>
                  <img
                    src='https://images.unsplash.com/photo-1591843336741-9f1238f66758?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1867&q=80'
                    className='card-img-top rounded-0'
                    alt='...'
                  />
                  <a href='#' className='text-dark'>
                    <i
                      className='far fa-heart position-absolute'
                      style={{ right: '16px', top: '16px' }}
                    ></i>
                  </a>
                  <div className='card-body p-0'>
                    <h4 className='mb-0 mt-3'>
                      <a href='./detail.html'>Lorem ipsum</a>
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
              </div> */}
              {products.map(product => (
                <div key={product.id} className='col-md-6'>
                  <div className='card border-0 mb-4 position-relative position-relative'>
                    <img
                      src={product.imageUrl}
                      className='card-img-top rounded-0'
                      alt={product.title}
                    />
                    <a href='#' className='text-dark'>
                      <i
                        className='far fa-heart position-absolute'
                        style={{ right: '16px', top: '16px' }}
                      ></i>
                    </a>
                    <div className='card-body p-0'>
                      <h4 className='mb-0 mt-3'>
                        {/* <a href='./detail.html'>{product.title}</a> */}
                        <Link to={`/detail/${product.id}`}>
                          {product.title}
                        </Link>
                      </h4>
                      <p className='card-text mb-0'>
                        {formatPrice(product.origin_price)}
                        <span className='text-muted '>
                          <del>{formatPrice(product.origin_price)}</del>
                        </span>
                      </p>
                      <p className='text-muted mt-3'></p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <nav className='d-flex justify-content-center'>
              <ul className='pagination'>
                <li className='page-item'>
                  <a className='page-link' href='#' aria-label='Previous'>
                    <span aria-hidden='true'>&laquo;</span>
                  </a>
                </li>
                <li className='page-item active'>
                  <a className='page-link' href='#'>
                    1
                  </a>
                </li>
                <li className='page-item'>
                  <a className='page-link' href='#'>
                    2
                  </a>
                </li>
                <li className='page-item'>
                  <a className='page-link' href='#'>
                    3
                  </a>
                </li>
                <li className='page-item'>
                  <a className='page-link' href='#' aria-label='Next'>
                    <span aria-hidden='true'>&raquo;</span>
                  </a>
                </li>
              </ul>
            </nav>
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
          <ReactLoading type='spin' color='black' width='4rem' height='4rem' />
        </div>
      )}
    </div>
  );
}
