import { createHashRouter } from 'react-router-dom';

// 🟦 Frontend Pages
import HomePage from '../pages/frontend/HomePage';
import AboutPage from '../pages/frontend/AboutPage';
import ProductsPage from '../pages/frontend/ProductsPage';
import ProductDetailPage from '../pages/frontend/ProductDetailPage';
import CartPage from '../pages/frontend/CartPage';
import CheckoutFormPage from '../pages/frontend/CheckoutFormPage';
import CheckoutPaymentPage from '../pages/frontend/CheckoutPaymentPage';
import CheckoutSuccessPage from '../pages/frontend/CheckoutSuccessPage';

// 🟥 Backend Pages
import DashboardPage from '../pages/backend/DashboardPage';
import ProductListPage from '../pages/backend/ProductListPage';
import OrderListPage from '../pages/backend/OrderListPage';

// 🟨 Common Pages
import LoginPage from '../pages/LoginPage';
import NotFoundPage from '../pages/NotFoundPage';

// Layouts
import FrontLayout from '../layouts/FrontLayout';
import BackLayout from '../layouts/BackLayout';

const router = createHashRouter([
  // 🟦 前台頁面 Front Layout
  {
    path: '/',
    element: <FrontLayout />,
    children: [
      { path: '', element: <HomePage /> }, // / (首頁)
      { path: 'about', element: <AboutPage /> }, // /about
      { path: 'product', element: <ProductsPage /> }, // /product

      // 產品細項，如果是多個參數寫法=> path: 'product/:product_id/:typemode'
      // 要注意參數順序重要：網址的參數順序必須與路由設定一致。
      { path: 'product/:product_id', element: <ProductDetailPage /> }, // /product/123
      // { // 收藏頁面
      //   path: 'favorite',
      //   element: <FavoriteDetailPage />,
      // },
      { path: 'cart', element: <CartPage /> }, // /cart
      { path: 'checkout-form', element: <CheckoutFormPage /> }, // /checkout-form
      { path: 'checkout-payment', element: <CheckoutPaymentPage /> }, // /checkout-payment
      { path: 'checkout-success', element: <CheckoutSuccessPage /> }, // /checkout-success
    ],
  },
  // 🟨 登入頁面
  {
    path: '/login',
    element: <LoginPage />,
  },
  // 🟥 後台頁面 Back Layout
  {
    path: '/dashboard',
    element: <BackLayout />,
    children: [
      { path: '', element: <DashboardPage /> }, // /dashboard
      { path: 'productlist', element: <ProductListPage /> }, // /dashboard/productlist
      { path: 'orderlist', element: <OrderListPage /> }, // /dashboard/productlist
    ],
  },
  // ❌ 404 頁面
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);

export default router;
