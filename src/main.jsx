import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';

import router from './router/index.jsx';
import store from './redux/store.js';
import Toast from './components/Toast.jsx';

import './assets/styles/all.scss'; // 入口 Sass
import 'bootstrap/dist/js/bootstrap.js';

// import './styles/main.scss'; // 入口 Sass => bakeday開發落後改採用六腳提供的版型

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <Toast /> {/* 確保 Toast 能全局監聽 Redux 狀態 */}
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);
