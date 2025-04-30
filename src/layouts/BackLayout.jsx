import { Outlet } from 'react-router-dom';
import NavBar from '../components/backend/BackendHeader';

export default function BackLayout() {
  return (
    <>
      <div className='backend-layout'>
        <NavBar />
        <main>
          <Outlet />
        </main>
      </div>
    </>
  );
}
