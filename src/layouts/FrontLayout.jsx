import { Outlet } from 'react-router-dom';
import NavBar from '../components/frontend/FrontendNavBar';
import Footer from '../components/frontend/FrontendFooter';

export default function FrontLayout() {
  return (
    <>
      <NavBar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
