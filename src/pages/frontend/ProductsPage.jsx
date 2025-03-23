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

  //用來取得所有商品資料
  // const [allProducts, setAllProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('全部');

  // const [tempProduct, setTempProduct] = useState([]);
  const [isScreenLoading, setIsScreenLoading] = useState(false);
  // const [isLoading, setIsLoading] = useState(false); //改用下面的loadingItems，先儲存商品ID來標定loading位置
  // const [loadingItems, setLoadingItems] = useState({}); // 用物件儲存各商品的 Loading 狀態

  useEffect(() => {
    setIsScreenLoading(true);
    const getProducts = async () => {
      try {
        // const res = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/products`);
        const res = await axios.get(
          // 取得所有商品資料，來歸類品項
          `${BASE_URL}/v2/api/${API_PATH}/products/all`
        );
        setProducts(res.data.products);
      } catch (error) {
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

  // 將所有取得的category，用new Set過濾掉重複的部分，但是注意這樣會變成Set物件，所以要再轉成陣列
  const categories = [
    '全部',
    ...new Set(products.map(product => product.category)),
  ];
  // 透過產品分類來篩選產品
  const filterProducts = products.filter(product => {
    if (selectedCategory === '全部') {
      return product;
    }
    return product.category === selectedCategory;
  });
  const [wishList, setWishList] = useState(() => {
    const initWishList = localStorage.getItem('wishList')
      ? JSON.parse(localStorage.getItem('wishList'))
      : {};

    return initWishList;
  });

  const toggleWishListItem = product_id => {
    const newWishList = {
      ...wishList,
      [product_id]: !wishList[product_id],
    };
    localStorage.setItem('wishList', JSON.stringify(newWishList));
    setWishList(newWishList);
  };

  //加入購物車
  // const addCartItem = async (product_id, qty = 1, source = 'table') => {
  //   // 如果 qty 小於 1，直接返回不做任何處理
  //   if (qty < 1) {
  //     console.warn('qty 不能小於 1');
  //     return;
  //   }
  //   setLoadingItems(prev => ({
  //     ...prev,
  //     [product_id]: { ...prev[product_id], [source]: true }, // 只改變對應的 source
  //   }));
  //   try {
  //     await axios.post(`${BASE_URL}/v2/api/${API_PATH}/cart`, {
  //       data: {
  //         product_id,
  //         qty: Number(qty),
  //       },
  //     });
  //     //closeModal();
  //     dispatch(pushMessage({ text: '商品加入購物車成功', status: 'success' }));
  //   } catch (error) {
  //     // console.error(error);
  //     // alert('加入購物車失敗');
  //     const rawMessage = error.response?.data?.message;
  //     const errorMessage = Array.isArray(rawMessage)
  //       ? rawMessage.join('、')
  //       : rawMessage || '發生錯誤，加入購物車失敗，請稍後再試';
  //     dispatch(pushMessage({ text: errorMessage, status: 'failed' }));
  //   } finally {
  //     setLoadingItems(prev => ({
  //       ...prev,
  //       [product_id]: { ...prev[product_id], [source]: false }, // 結束 Loading
  //     }));
  //   }
  // };

  // 套用板型
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
        <h2 className='fw-bold'>Lorem ipsum- 產品葉面.</h2>
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
                    <h4 className='mb-0'>餐飲分類</h4>
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
                      {categories.map(category => (
                        <li key={category}>
                          <button
                            onClick={() => setSelectedCategory(category)}
                            type='button'
                            className='btn border-none py-2 d-block text-muted'
                          >
                            {category}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='col-md-8'>
            <div className='row'>
              {filterProducts.map(product => (
                <div key={product.id} className='col-md-6'>
                  <div className='card border-0 mb-4 position-relative position-relative'>
                    <img
                      src={product.imageUrl}
                      className='card-img-top rounded-0'
                      alt={product.title}
                    />
                    <button
                      onClick={() => toggleWishListItem(product.id)}
                      type='button'
                      className='text-dark border-none'
                    >
                      <i
                        className={`${
                          wishList[product.id] ? 'fas' : 'far'
                        } fa-heart position-absolute`}
                        style={{ right: '16px', top: '16px' }}
                      ></i>
                    </button>
                    <div className='card-body p-0'>
                      <h4 className='mb-0 mt-3'>
                        <Link to={`/product/${product.id}`}>
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
            {/* pagenation  */}
            {/* <nav className='d-flex justify-content-center'>
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
            </nav> */}
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
