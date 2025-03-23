import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import ReactLoading from 'react-loading';

import { formatPrice } from '../../utils/format';

import { pushMessage } from '../../redux/toastSlice';
import { updateCartData } from '../../redux/cartSlice';

export default function ProductDetailPage() {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const API_PATH = import.meta.env.VITE_API_PATH;

  const dispatch = useDispatch();

  // 根據路由的參數命名來取得該命名參數，ex path: 'product/:product_id'
  // 如果是多個參數ex path: 'product/:product_id/:typemode'，則取得方式為 const { product_id, typemode } = useParams();
  const { product_id } = useParams(); // 根據陸游的參數命名來取得該命名參數，expath: 'product/:product_id',

  // 資料狀態
  const [product, setProduct] = useState({});
  const [qtySelect, setQtySelect] = useState(1);
  // 載入狀態
  const [isScreenLoading, setIsScreenLoading] = useState(false);
  // const [isLoading, setIsLoading] = useState(false); //改用下面的loadingItems，先儲存商品ID來標定loading位置
  // const [loadingItems, setLoadingItems] = useState({}); // 用物件儲存各商品的 Loading 狀態

  useEffect(() => {
    setIsScreenLoading(true);
    const getProductDetail = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/v2/api/${API_PATH}/product/${product_id}`
        );
        setProduct(res.data.product);
      } catch (error) {
        const rawMessage = error.response?.data?.message;
        const errorMessage = Array.isArray(rawMessage)
          ? rawMessage.join('、')
          : rawMessage || '發生錯誤，取得產品細項失敗，請稍後再試';
        dispatch(pushMessage({ text: errorMessage, status: 'failed' }));
      } finally {
        setIsScreenLoading(false);
      }
    };

    //畫面渲染後初步載入產品細項
    getProductDetail();
    //畫面渲染後初步載入購物車並更新至store
    getCarts();
  }, []);

  //取得cart並將資訊加入至store
  const getCarts = async () => {
    setIsScreenLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/cart`);
      dispatch(updateCartData(res.data.data)); //將購物車資料加入至store
    } catch (error) {
      const rawMessage = error.response?.data?.message;
      const errorMessage = Array.isArray(rawMessage)
        ? rawMessage.join('、')
        : rawMessage || '發生錯誤，取得產品細項失敗，請稍後再試';
      dispatch(pushMessage({ text: errorMessage, status: 'failed' }));
    } finally {
      setIsScreenLoading(false);
    }
  };

  //加入購物車
  const addCartItem = async (product_id, qty = 1) => {
    setIsScreenLoading(true);
    // 如果 qty 小於 1，直接返回不做任何處理
    if (qty < 1) {
      console.warn('qty 不能小於 1');
      return;
    }

    try {
      await axios.post(`${BASE_URL}/v2/api/${API_PATH}/cart`, {
        data: {
          product_id,
          qty: Number(qty),
        },
      });
      dispatch(pushMessage({ text: '商品加入購物車成功', status: 'success' }));

      //將異動過後的購物車資料加入至store
      getCarts();
    } catch (error) {
      const rawMessage = error.response?.data?.message;
      const errorMessage = Array.isArray(rawMessage)
        ? rawMessage.join('、')
        : rawMessage || '發生錯誤，加入購物車失敗，請稍後再試';
      dispatch(pushMessage({ text: errorMessage, status: 'failed' }));
    } finally {
      setIsScreenLoading(false);
    }
  };

  return (
    <div className='container-fluid'>
      <div className='container'>
        <div className='row align-items-center'>
          <div className='col-md-7'>
            <div
              id='carouselExampleControls'
              className='carousel slide'
              data-ride='carousel'
            >
              <div className='carousel-inner'>
                <div className='carousel-item active'>
                  <img
                    src={product?.imageUrl}
                    alt={product?.title}
                    className='d-block w-100'
                  />
                </div>
                {/* 移除多的產品圖片輪播 */}
                {/* <div className='carousel-item'>
                  <img
                    src={product?.imageUrl}
                    alt={product?.title}
                    className='d-block w-100'
                  />
                </div>
                <div className='carousel-item'>
                  <img
                    src={product?.imageUrl}
                    alt={product?.title}
                    className='d-block w-100'
                  />
                </div> */}
              </div>
              <a
                className='carousel-control-prev'
                href='#carouselExampleControls'
                role='button'
                data-slide='prev'
              >
                <span
                  className='carousel-control-prev-icon'
                  aria-hidden='true'
                ></span>
                <span className='sr-only'>Previous</span>
              </a>
              <a
                className='carousel-control-next'
                href='#carouselExampleControls'
                role='button'
                data-slide='next'
              >
                <span
                  className='carousel-control-next-icon'
                  aria-hidden='true'
                ></span>
                <span className='sr-only'>Next</span>
              </a>
            </div>
          </div>
          <div className='col-md-5'>
            <nav aria-label='breadcrumb'>
              <ol className='breadcrumb bg-white px-0 mb-0 py-3'>
                <li className='breadcrumb-item'>
                  <Link className='text-muted' to='/'>
                    Home
                  </Link>
                </li>
                <li className='breadcrumb-item'>
                  <Link className='text-muted' to='/product'>
                    Product
                  </Link>
                </li>
                <li className='breadcrumb-item active' aria-current='page'>
                  Detail
                </li>
              </ol>
            </nav>
            <h2 className='fw-bold h1 mb-1'>{product.title}</h2>
            <p className='mb-0 text-muted text-end'>
              <del>{formatPrice(product.origin_price)}</del>
            </p>
            <p className='h4 fw-bold text-end'>{formatPrice(product.price)}</p>
            <div className='row align-items-center'>
              <div className='col-6'>
                <div className='input-group my-3 bg-light rounded'>
                  <div className='input-group-prepend'>
                    <button
                      disabled={qtySelect === 1}
                      onClick={() => setQtySelect(qtySelect - 1)}
                      className='btn btn-outline-dark border-0 py-2'
                      type='button'
                      id='button-addon1'
                    >
                      <i className='fas fa-minus'></i>
                    </button>
                  </div>
                  <input
                    type='text'
                    readOnly
                    className='form-control border-0 text-center my-auto shadow-none bg-light'
                    aria-label='Example text with button addon'
                    aria-describedby='button-addon1'
                    value={qtySelect}
                  />
                  <div className='input-group-append'>
                    <button
                      onClick={() => setQtySelect(qtySelect + 1)}
                      className='btn btn-outline-dark border-0 py-2'
                      type='button'
                      id='button-addon2'
                    >
                      <i className='fas fa-plus'></i>
                    </button>
                  </div>
                </div>
              </div>
              <div className='col-6'>
                <button
                  type='button'
                  // disabled={isLoading}
                  onClick={() => addCartItem(product.id, qtySelect)}
                  href='./checkout.html'
                  className='text-nowrap btn btn-dark w-100 py-2'
                >
                  加入購物車
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className='row my-5'>
          <div className='col-md-4'>
            <p>{product.content}</p>
          </div>
          <div className='col-md-3'>
            <p>{product.description}</p>
          </div>
        </div>
        {/* 更多副圖輪播 */}
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
