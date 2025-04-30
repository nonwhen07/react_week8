import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { updateCartData } from '../../redux/cartSlice';
import { logout } from '../../redux/authSlice';
import { pushMessage } from '../../redux/toastSlice';

const routes = [
  { path: '/', name: 'Home' },
  // { path: '/about', name: 'About' },
  { path: '/product', name: 'Product' },
  // { path: '/favorite', name: 'Favorite' },
  { path: '/cart', name: 'Cart' },
];

export default function Header() {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const API_PATH = import.meta.env.VITE_API_PATH;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLogin = useSelector(state => state.auth.isLogin);
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

  //加入登出
  const handleLogout = () => {
    dispatch(logout());
    dispatch(
      pushMessage({ text: '已成功登出，將跳轉到前台首頁', status: 'success' })
    );
    navigate('/');
  };

  return (
    <>
      {/* <div className='container d-flex flex-column'>
        <nav className='navbar navbar-expand-lg navbar-light'>
          <Link to='/' className='navbar-brand header-nav-brand'>
            <span className='header-nav-logo-text'>Morning Bean Café</span>
          </Link>
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
              {isLogin ? (
                <>
                  <NavLink to='/dashboard' className='nav-item nav-link me-4'>
                    後台
                  </NavLink>
                  <button
                    onClick={handleLogout}
                    className='btn btn-link nav-item nav-link text-danger'
                  >
                    登出
                  </button>
                </>
              ) : (
                <NavLink to='/login' className='nav-item nav-link me-4'>
                  登入
                </NavLink>
              )}
            </div>
          </div>
        </nav>
      </div> */}

      <header id='header' className='sticky-top'>
        <nav className='navbar navbar-expand-lg navbar-light bg-light'>
          <div className='container'>
            {/* Logo + Toggler */}
            <Link to='/' className='navbar-brand header-nav-brand'>
              <span className='header-nav-logo-text'>Morning Bean Café</span>
            </Link>
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

            {/* Menu 區塊 */}
            <div
              className='collapse navbar-collapse justify-content-end'
              id='navbarNavAltMarkup'
            >
              <div className='navbar-nav'>
                {routes.map(route => (
                  <NavLink
                    key={route.path}
                    className='nav-item nav-link me-4'
                    to={route.path}
                  >
                    {route.name === 'Cart' ? (
                      <div className='position-relative'>
                        <i className='fas fa-shopping-cart'></i>
                        <span
                          className='position-absolute badge text-bg-danger rounded-circle'
                          style={{ bottom: '12px', left: '12px' }}
                        >
                          {carts?.length}
                        </span>
                      </div>
                    ) : (
                      route.name
                    )}
                  </NavLink>
                ))}

                {/* 登入 / 登出區塊 */}
                {isLogin ? (
                  <>
                    <NavLink to='/dashboard' className='nav-item nav-link me-4'>
                      後台
                    </NavLink>
                    <button
                      onClick={handleLogout}
                      className='btn btn-link nav-item nav-link text-danger'
                    >
                      登出
                    </button>
                  </>
                ) : (
                  <NavLink to='/login' className='nav-item nav-link me-4'>
                    登入
                  </NavLink>
                )}
              </div>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
}
