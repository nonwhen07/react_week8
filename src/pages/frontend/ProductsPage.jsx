import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import ReactLoading from 'react-loading';

import { pushMessage } from '../../redux/toastSlice';

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

  return (
    <>
      <div className='container'>
        <div className='mt-4'>
          <table className='table align-middle'>
            <thead>
              <tr>
                <th>圖片</th>
                <th>商品名稱</th>
                <th>價格</th>
                <th
                  style={{
                    minWidth: '200px',
                    width: 'auto',
                    maxWidth: '280px',
                  }}
                ></th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id}>
                  <td style={{ width: '200px' }}>
                    <img
                      className='img-fluid'
                      src={product.imageUrl}
                      alt={product.title}
                    />
                  </td>
                  <td>{product.title}</td>
                  <td>
                    <del className='h6'>原價 {product.origin_price} 元</del>
                    <div className='h5'>特價 {product.price}元</div>
                  </td>
                  <td>
                    <div className='btn-group btn-group-sm'>
                      <Link
                        to={`/product/${product.id}`}
                        type='button'
                        className='btn btn-outline-secondary'
                      >
                        查看更多
                      </Link>
                      <button
                        disabled={loadingItems[product.id]?.table}
                        onClick={() => addCartItem(product.id, 1, 'table')}
                        type='button'
                        className='btn btn-outline-danger d-flex align-items-center'
                      >
                        加到購物車
                        {loadingItems[product.id]?.table && (
                          // <ReactLoading className="d-flex align-items-center" type="spin" color="#000" height="1.25rem" width="1.25rem" />
                          <div
                            className='d-flex align-items-center'
                            style={{
                              width: '20px',
                              height: '20px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <ReactLoading
                              type='spin'
                              color='#000'
                              height='1.25rem'
                              width='1.25rem'
                            />
                          </div>
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
    </>
  );
}
