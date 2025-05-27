import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { formatPrice } from '../../utils/format';
import ReactLoading from 'react-loading';

export default function FavoritePage() {
  const [favoriteList, setFavoriteList] = useState({});
  const [allProducts, setAllProducts] = useState([]);
  const [isScreenLoading, setIsScreenLoading] = useState(false);

  useEffect(() => {
    // 1. 取得 localStorage 中的收藏清單
    const storedList = JSON.parse(localStorage.getItem('wishList')) || {};
    setFavoriteList(storedList);

    // 2. 載入所有商品，之後用來比對是否被收藏
    fetchAllProducts();
  }, []);

  const fetchAllProducts = async () => {
    setIsScreenLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BASE_URL}/v2/api/${
          import.meta.env.VITE_API_PATH
        }/products/all`
      );
      const data = await res.json();
      setAllProducts(data.products);
    } catch (error) {
      console.error('載入商品失敗', error);
    } finally {
      setIsScreenLoading(false);
    }
  };

  // 3. 過濾出被收藏的產品
  const favoriteProducts = allProducts.filter(p => favoriteList[p.id]);

  return (
    <div className='container my-5'>
      <h2 className='fw-bold text-center mb-4'>我的收藏</h2>
      <p className='text-muted text-center mb-5'>查看你喜愛的咖啡與甜點商品</p>

      {favoriteProducts.length === 0 ? (
        <div className='text-center py-5'>
          <p className='text-muted'>目前尚未收藏任何商品</p>
          <Link to='/product' className='btn btn-outline-dark mt-2'>
            前往逛逛商品
          </Link>
        </div>
      ) : (
        <div className='row'>
          {favoriteProducts.map(product => (
            <div className='col-md-4 mb-4' key={product.id}>
              <div className='card border-0 shadow-sm position-relative'>
                <Link to={`/product/${product.id}`} className='text-dark'>
                  <img
                    src={product.imageUrl}
                    alt={product.title}
                    className='card-img-top rounded-0'
                  />
                </Link>
                <div className='card-body'>
                  <h5 className='card-title'>
                    <Link to={`/product/${product.id}`} className='text-dark'>
                      {product.title}
                    </Link>
                  </h5>
                  <p className='card-text mb-0'>
                    {formatPrice(product.price)}
                    <span className='text-muted ms-2'>
                      <del>{formatPrice(product.origin_price)}</del>
                    </span>
                  </p>
                </div>

                {/* TODO: 可加上「取消收藏」功能 */}
              </div>
            </div>
          ))}
        </div>
      )}

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
