import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, checkLogin } from '../redux/authSlice';
import { pushMessage } from '../redux/toastSlice';
import ReactLoading from 'react-loading';

export default function LoginPage() {
  // 環境變數
  // const baseURL = import.meta.env.VITE_BASE_URL;

  // 初始化 navigate、dispatch
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { status, error } = useSelector(state => state.auth);

  const [account, setAccount] = useState({
    username: 'example@test.com',
    password: 'example',
  });

  // useEffect - 初始化 初始檢查登入狀態，如果有就轉到後台頁面
  useEffect(() => {
    //authSlice.js 中的 checkLogin thunk 會自動處理 token 的設定
    dispatch(checkLogin());
  }, []);

  useEffect(() => {
    if (status === 'failed') {
      dispatch(
        pushMessage({
          text: typeof error === 'string' ? error : '登入失敗',
          status: 'failed',
        })
      );
      navigate('/login');
      return;
    }

    if (status === 'succeeded') {
      dispatch(
        pushMessage({
          text: '已確認登入，將導向後台首頁',
          status: 'success',
        })
      );
      navigate('/dashboard');
    }
  }, [status, error, dispatch, navigate]);

  // 登入表單 - 登入submit事件
  // const handleLogin = e => {
  //   setIsLoading(true);
  //   e.preventDefault();
  //   axios
  //     .post(`${baseURL}/v2/admin/signin`, account)
  //     .then(res => {
  //       const { token, expired } = res.data;
  //       document.cookie = `hexToken_week8=${token}; userLanguage=en; userPreference=darkMode; expires=${new Date(
  //         expired
  //       )}`; // 設定 cookie
  //       axios.defaults.headers.common['Authorization'] = token;
  //       dispatch(pushMessage({ text: '登入成功', status: 'success' }));
  //       navigate('/dashboard'); // **登入成功後跳轉到 Dashboard**
  //     })
  //     .catch(error => {
  //       const { message } = error.response.data;
  //       dispatch(pushMessage({ text: message.join('、'), status: 'failed' }));
  //     })
  //     .finally(() => {
  //       setIsLoading(false);
  //     });
  // };
  const handleLogin = e => {
    e.preventDefault();
    dispatch(login(account));
  };
  // 登入表單 - Input變動
  const handleInputChange = e => {
    const { name, value } = e.target;
    setAccount(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // 🚫 已改為 Redux Toolkit 的 checkLogin thunk 管理登入驗證
  // const checkLogin = () => {
  //   setIsLoading(true);
  //   axios
  //     .post(`${baseURL}/v2/api/user/check`)
  //     .then(() => {
  //       dispatch(
  //         pushMessage({
  //           text: '已確認登入，將導向後台首頁',
  //           status: 'success',
  //         })
  //       );
  //       navigate('/dashboard');
  //     })
  //     .catch(error => {
  //       console.error(error.response.data.message);
  //     })
  //     .finally(() => {
  //       setIsLoading(false);
  //     });
  // };

  return (
    <>
      <div className='container'>
        <div className='d-flex flex-column justify-content-center align-items-center vh-100'>
          <h1 className='mb-5'>請先登入</h1>
          <form onSubmit={handleLogin} className='d-flex flex-column gap-3'>
            <div className='form-floating mb-3'>
              <input
                name='username'
                type='email'
                value={account.username}
                onChange={handleInputChange}
                className='form-control'
                id='username'
                placeholder='example@test.com'
              />
              <label htmlFor='username'>Email address</label>
            </div>
            <div className='form-floating'>
              <input
                name='password'
                type='password'
                value={account.password}
                onChange={handleInputChange}
                className='form-control'
                id='password'
                placeholder='example'
              />
              <label htmlFor='password'>Password</label>
            </div>
            <button type='submit' className='btn btn-primary'>
              登入
            </button>
          </form>
        </div>
      </div>

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
