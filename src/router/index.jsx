import { createHashRouter } from 'react-router-dom';

import LoginPage from '../pages/LoginPage';
import HomePage from '../pages/frontend/HomePage';
import ProductsPage from '../pages/frontend/ProductsPage';
import ProductDetailPage from '../pages/frontend/ProductDetailPage';
import CartPage from '../pages/frontend/CartPage';
import CheckoutPage from '../pages/frontend/CheckoutPage';
import NotFoundPage from '../pages/NotFoundPage';
import DashboardPage from '../pages/backend/DashboardPage';

import FonterLayout from '../layouts/FrontLayout';
import BackLayout from '../layouts/BackLayout';

const router = createHashRouter([
  {
    path: '/',
    element: <FonterLayout />,
    children: [
      {
        path: '',
        element: <HomePage />,
      },
      {
        // 產品列表
        path: 'product',
        element: <ProductsPage />,
      },
      {
        // 產品細項，如果是多個參數寫法=> path: 'product/:product_id/:typemode'
        // 要注意參數順序重要：網址的參數順序必須與路由設定一致。
        path: 'detail/:product_id',
        element: <ProductDetailPage />,
      },
      {
        path: 'cart',
        element: <CartPage />,
      },
      {
        path: 'checkout',
        element: <CheckoutPage />,
      },
    ],
  },
  {
    // Login頁面
    path: '/login',
    element: <LoginPage />,
  },
  {
    // Admin後台頁面
    // path:'/dashboard',
    // element:<DashboardPage />
    path: '/dashboard',
    element: <BackLayout />,
    children: [
      {
        //Dashboard頁面
        path: '',
        element: <DashboardPage />,
      },
    ],
  },
  {
    // 404頁面
    path: '*',
    element: <NotFoundPage />,
  },
]);

export default router;
