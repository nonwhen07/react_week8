import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, NavLink } from 'react-router-dom';
import { updateCartData } from '../../redux/cartSlice';
import { pushMessage } from '../../redux/toastSlice';

const routes = [
  // { path: '/', name: '首頁' },
  // { path: '/products', name: '產品列表' },
  // { path: '/cart', name: '購物車' },
  { path: '/', name: 'Home' },
  // { path: '/about', name: 'About' },
  { path: '/product', name: 'Product' },
  // { path: '/detail', name: 'Detail' },
  { path: '/cart', name: 'Cart' },
  { path: '/login', name: 'Login' },
];

export default function Header() {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const API_PATH = import.meta.env.VITE_API_PATH;
  const dispatch = useDispatch();
  const carts = useSelector(state => state.cart.carts);

  useEffect(() => {
    //畫面渲染後初步載入購物車
    getCarts();
  }, []);

  //取得cart
  const getCarts = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/cart`);
      dispatch(updateCartData(res.data.data)); //將異動過後的購物車資料加入至store
    } catch (error) {
      const rawMessage = error.response?.data?.message;
      const errorMessage = Array.isArray(rawMessage)
        ? rawMessage.join('、')
        : rawMessage || '購物車資料匯入失敗，請稍後再試';
      dispatch(pushMessage({ text: errorMessage, status: 'failed' }));
    }
  };

  return (
    <div className='container d-flex flex-column'>
      <nav className='navbar navbar-expand-lg navbar-light'>
        <Link to='/' className='navbar-brand header-nav-brand'>
          <span className='header-nav-logo-text'>Morning Bean Café</span>
        </Link>
        {/* <a className='navbar-brand' href='./index.html'>
          Navbar
        </a> */}
        <button
          className='navbar-toggler'
          type='button'
          data-bs-toggle='collapse'
          data-bs-target='#navbarNavAltMarkup'
          aria-controls='navbarNavAltMarkup'
          aria-expanded='false'
          aria-label='Toggle navigation'
        >
          <span className='navbar-toggler-icon'></span>
        </button>
        <div
          className='collapse navbar-collapse justify-content-end'
          id='navbarNavAltMarkup'
        >
          <div className='navbar-nav'>
            {routes.map(route => (
              <NavLink
                key={route.path}
                className='nav-item nav-link me-4'
                aria-current='page'
                to={route.path}
              >
                {route.name === 'Cart' ? (
                  <div className='position-relative'>
                    <i className='fas fa-shopping-cart'></i>
                    <span
                      className='position-absolute badge text-bg-danger rounded-circle'
                      style={{
                        bottom: '12px',
                        left: '12px',
                      }}
                    >
                      {carts?.length}
                    </span>
                  </div>
                ) : (
                  route.name
                )}
              </NavLink>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
}
