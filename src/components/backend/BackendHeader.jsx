import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { pushMessage } from '../../redux/toastSlice';

const routes = [
  { path: '/dashboard', name: '後台首頁' },
  { path: '/dashboard/productlist', name: '產品列表' },
  // { path: "/dashboard/orders", name: "訂單列表" },
  // { path: "/dashboard/orders", name: "優惠卷列表" },
  // { path: "/dashboard/orders", name: "最新消息" },
];

export default function BackendHeader() {
  // 環境變數
  const baseURL = import.meta.env.VITE_BASE_URL;
  // const apiPath = import.meta.env.VITE_API_PATH;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await axios.post(`${baseURL}/v2/logout`);
      dispatch(
        pushMessage({ text: '已成功登出，將跳轉到登入頁面', status: 'success' })
      );

      setTimeout(() => {
        navigate('/login'); // **登入成功後跳轉到 login**
      }, 1500);
    } catch (error) {
      const { message } = error.response.data;
      dispatch(pushMessage({ text: message.join('、'), status: 'failed' }));
    }
  };

  return (
    <>
      <nav
        className='navbar bg-dark border-bottom border-body'
        data-bs-theme='dark'
      >
        <div className='container d-flex justify-content-between align-items-center'>
          <ul className='navbar-nav flex-row gap-5 fs-5'>
            {routes.map(route => (
              <li key={route.path} className='nav-item'>
                <NavLink
                  className='nav-link'
                  aria-current='page'
                  to={route.path}
                >
                  {route.name}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className='d-flex align-items-center'>
            <button
              onClick={handleLogout}
              type='button'
              className='btn btn-secondary'
            >
              登出
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}
