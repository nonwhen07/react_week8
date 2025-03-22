import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';

// import 'bootstrap/dist/css/bootstrap.min.css';

import router from './router/index.jsx';
import store from './redux/store.js';
import Toast from './components/Toast.jsx';

import './styles/main.scss'; // 入口 Sas

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <Toast /> {/* 確保 Toast 能全局監聽 Redux 狀態 */}
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);
