import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
// import axios from 'axios';
import ReactLoading from 'react-loading';
import { checkLogin } from '../../redux/authSlice';
import { pushMessage } from '../../redux/toastSlice';

export default function DashboardPage() {
  // 初始化 navigate
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { status, error } = useSelector(state => state.auth);

  // 螢幕Loading遮罩
  // const [loading, setLoading] = useState(false);

  // useEffect - 初始化 初始檢查登入狀態，如果沒有就轉到登入頁面
  useEffect(() => {
    // const token = document.cookie.replace(
    //   /(?:(?:^|.*;\s*)hexToken_week8\s*=\s*([^;]*).*$)|^.*$/,
    //   '$1'
    // );
    // axios.defaults.headers.common['Authorization'] = token;
    // checkLogin();

    dispatch(checkLogin());
  }, []);

  // React Hook useEffect has missing dependencies: 'dispatch', 'error', and 'navigate'. Either include them or remove the dependency array.
  // 解法後面的狀態確認機制從[status]改成 [status, dispatch, navigate, error]，實際上這些值都不太會變（像 dispatch 和 navigate 是固定的函式），
  // 這只是 ESLint 根據 Hook 規則保守提醒，讓你的程式行為更穩定可預測。
  useEffect(() => {
    if (status === 'failed') {
      dispatch(pushMessage({ text: error, status: 'failed' }));
      navigate('/login');
      return;
    }
    if (status === 'succeeded') {
      dispatch(
        pushMessage({ text: '登入成功，歡迎回來！', status: 'success' })
      );
    }
  }, [status]);

  // API & 認證相關函式
  // 🚫 已改為 Redux Toolkit 的 checkLogin thunk 管理登入驗證
  // const checkLogin = () => {
  //   setIsScreenLoading(true);
  //   axios
  //     .post(`${baseURL}/v2/api/user/check`)
  //     .then(() => {
  //       // getProducts();
  //     })
  //     .catch(error => {
  //       const rawMessage = error.response?.data?.message;
  //       const errorMessage = Array.isArray(rawMessage)
  //         ? rawMessage.join('、')
  //         : rawMessage || '請先登入，將導向登入頁面';
  //       dispatch(pushMessage({ text: errorMessage, status: 'failed' }));

  //       navigate('/login'); // **確認沒有登入就跳轉到 LoginPage**
  //     })
  //     .finally(() => {
  //       setIsScreenLoading(false);
  //     });
  // };

  return (
    <>
      {status === 'loading' ? (
        <p>驗證中...</p>
      ) : (
        <div className='container py-5'>
          <div className='d-flex justify-content-between'>
            {/* 標題區塊 */}
            <h1 className='text-2xl font-bold'>後台總覽 Dashboard</h1>
          </div>

          {/* 上方統計卡片區塊 */}
          <div className='row g-3'>
            <div className='col-12 col-md-6'>
              <div className='shadow p-4 rounded'>
                <p className='text-muted small'>今日訂單</p>
                <p className='fs-5 fw-semibold'>32 筆</p>
              </div>
            </div>
            <div className='col-12 col-md-6'>
              <div className='shadow p-4 rounded'>
                <p className='text-muted small'>本月營收</p>
                <p className='fs-5 fw-semibold'>NT$ 85,400</p>
              </div>
            </div>
            <div className='col-12 col-md-6'>
              <div className='shadow p-4 rounded'>
                <p className='text-muted small'>待出貨訂單</p>
                <p className='fs-5 fw-semibold'>7 筆</p>
              </div>
            </div>
            <div className='col-12 col-md-6'>
              <div className='shadow p-4 rounded'>
                <p className='text-muted small'>新註冊用戶</p>
                <p className='fs-5 fw-semibold'>5 人</p>
              </div>
            </div>
          </div>

          {/* 最新消息或系統通知 */}
          <div className='shadow p-4 rounded my-4'>
            <h2 className='fs-5 fw-bold mb-2'>最新消息</h2>
            <ul className='small text-muted ps-3'>
              <li>3/25 優惠卷活動上線</li>
              <li>3/26 商品分類異動</li>
              <li>3/27 系統將於凌晨 3 點維護</li>
            </ul>
          </div>

          {/* 快捷入口區塊 */}
          <div className='row g-3'>
            <div className='col-12 col-md-4'>
              <div className='shadow p-4 text-center rounded hover-shadow'>
                <p className='fw-semibold'>新增商品</p>
              </div>
            </div>
            <div className='col-12 col-md-4'>
              <div className='shadow p-4 text-center rounded hover-shadow'>
                <p className='fw-semibold'>發送優惠卷</p>
              </div>
            </div>
            <div className='col-12 col-md-4'>
              <div className='shadow p-4 text-center rounded hover-shadow'>
                <p className='fw-semibold'>查看所有訂單</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {status === 'loading' && (
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
