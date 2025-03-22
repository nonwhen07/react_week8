import { Outlet } from 'react-router-dom';
import NavBar from '../components/backend/BackendNavBar';

export default function BackLayout() {
  return (
    <>
      <NavBar />
      <main>
        <Outlet />
      </main>
    </>
  );
}
