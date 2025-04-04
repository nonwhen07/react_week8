import { Outlet } from 'react-router-dom';
import Header from '../components/frontend/FrontendHeader';
import Footer from '../components/frontend/FrontendFooter';
// ✅ <Outlet /> 是什麼？
// <Outlet /> 是 React Router 提供的佔位符元件，用來在巢狀路由中顯示子路由對應的內容。
// 簡單說，它就是： “子頁面內容顯示的地方”
// 📘 官方定義（簡化版） <Outlet> renders the element from the child route. It's like a placeholder for nested routes.

export default function FrontLayout() {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
