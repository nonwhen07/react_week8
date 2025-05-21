import { createHashRouter } from 'react-router-dom';

// 🟦 Frontend Pages
import HomePage from '../pages/frontend/HomePage';
import AboutPage from '../pages/frontend/AboutPage';
import ProductsPage from '../pages/frontend/ProductsPage';
import ProductDetailPage from '../pages/frontend/ProductDetailPage';
import FavoritePage from '../pages/frontend/FavoritePage';
import CartPage from '../pages/frontend/CartPage';
import CheckoutFormPage from '../pages/frontend/CheckoutFormPage';
import CheckoutPaymentPage from '../pages/frontend/CheckoutPaymentPage';
import CheckoutSuccessPage from '../pages/frontend/CheckoutSuccessPage';

// 🟥 Backend Pages
import DashboardPage from '../pages/backend/DashboardPage';
import ProductListPage from '../pages/backend/ProductListPage';
import OrderListPage from '../pages/backend/OrderListPage';
import CouponListPage from '../pages/backend/CouponListPage';
import NewsListPage from '../pages/backend/NewsListPage';

// 🟨 Common Pages
import LoginPage from '../pages/LoginPage';
import NotFoundPage from '../pages/NotFoundPage';

// Layouts
import FrontLayout from '../layouts/FrontLayout';
import BackLayout from '../layouts/BackLayout';

// ✅ createHashRouter（使用 /#/）
// 適用於靜態部署（無法設定後端 rewrite 規則）
// 例如：GitHub Pages、純前端環境
// ✅ createBrowserRouter（使用純路徑）
// 適用於可設定 server-side routing fallback 的環境
// 例如：Vercel、Netlify、Firebase Hosting、自架伺服器

const router = createHashRouter([
  // 🟦 前台頁面 Front Layout
  {
    path: '/',
    element: <FrontLayout />,
    children: [
      { path: '', element: <HomePage /> }, // (首頁)
      { path: 'about', element: <AboutPage /> }, // 關於我們  ~/about
      { path: 'product', element: <ProductsPage /> }, // 產品頁面  ~/product
      // 產品細項，如果是多個參數寫法=> path: 'product/:product_id/:typemode'
      // 要注意參數順序重要：網址的參數順序必須與路由設定一致。
      { path: 'product/:product_id', element: <ProductDetailPage /> }, // 產品細節  ~/product/123
      { path: 'favorite', element: <FavoritePage /> }, // 收藏頁面  ~/favorite
      { path: 'cart', element: <CartPage /> }, // ~/cart
      { path: 'checkout-form', element: <CheckoutFormPage /> }, //  ~/checkout-form
      { path: 'checkout-payment', element: <CheckoutPaymentPage /> }, //  ~/checkout-payment
      { path: 'checkout-success', element: <CheckoutSuccessPage /> }, //  ~/checkout-success
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
      { path: 'couponlist', element: <CouponListPage /> }, // /dashboard/productlist
      { path: 'newslist', element: <NewsListPage /> }, // /dashboard/productlist
    ],
  },
  // ❌ 404 頁面
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);

export default router;
