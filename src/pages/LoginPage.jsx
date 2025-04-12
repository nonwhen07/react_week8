import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { pushMessage } from '../redux/toastSlice';
import axios from 'axios';
import ReactLoading from 'react-loading';

export default function LoginPage() {
  // 環境變數
  const baseURL = import.meta.env.VITE_BASE_URL;

  // 初始化 navigate、dispatch
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [account, setAccount] = useState({
    username: 'example@test.com',
    password: 'example',
  });

  const [isScreenLoading, setIsScreenLoading] = useState(false);

  // useEffect - 初始化 初始檢查登入狀態，如果有就轉到後台頁面
  useEffect(() => {
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)hexToken4\s*=\s*([^;]*).*$)|^.*$/,
      '$1'
    );
    axios.defaults.headers.common['Authorization'] = token;
    checkLogin();
  }, []);

  // 登入表單 - 登入submit事件
  const handleLogin = e => {
    setIsScreenLoading(true);
    e.preventDefault();
    axios
      .post(`${baseURL}/v2/admin/signin`, account)
      .then(res => {
        const { token, expired } = res.data;
        document.cookie = `hexToken4=${token}; userLanguage=en; userPreference=darkMode; expires=${new Date(
          expired
        )}`; // 設定 cookie
        axios.defaults.headers.common['Authorization'] = token;
        dispatch(pushMessage({ text: '登入成功', status: 'success' }));
        navigate('/dashboard'); // **登入成功後跳轉到 Dashboard**
      })
      .catch(error => {
        const { message } = error.response.data;
        dispatch(pushMessage({ text: message.join('、'), status: 'failed' }));
      })
      .finally(() => {
        setIsScreenLoading(false);
      });
  };
  // 登入表單 - Input變動
  const handleInputChange = e => {
    const { name, value } = e.target;
    setAccount(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const checkLogin = () => {
    setIsScreenLoading(true);
    axios
      .post(`${baseURL}/v2/api/user/check`)
      .then(() => {
        dispatch(
          pushMessage({
            text: '已確認登入，將導向後台首頁(暫停)',
            status: 'success',
          })
        );
        navigate('/dashboard');
      })
      .catch(error => {
        console.error(error.response.data.message);
      })
      .finally(() => {
        setIsScreenLoading(false);
      });
  };

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
                value={account.username || ''}
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
                value={account.password || ''}
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
      {/* ScreenLoading */}
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
