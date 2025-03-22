import { Link, NavLink } from 'react-router-dom';

const routes = [
  { path: '/', name: '首頁' },
  { path: '/products', name: '產品列表' },
  { path: '/cart', name: '購物車' },
];

export default function FrontendNavBar() {
  return (
    <>
      <nav className='navbar border-bottom border-body header-nav'>
        <div className='container'>
          <Link to='/' className='navbar-brand header-nav-brand'>
            <span className='header-nav-logo-text'>🍞 BakeDay • 手焙日和</span>
          </Link>
          {/* svg-logo作法 */}
          {/* <Link to='/' className='navbar-brand header-nav-brand'>
            <div className='header-nav-logo-svg'>
              {
                <svg
                  width='120'
                  height='120'
                  viewBox='0 0 120 120'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <circle
                    cx='60'
                    cy='60'
                    r='55'
                    fill='#F5E1C3'
                    stroke='#8B5E3C'
                    stroke-width='4'
                  />
                  <path
                    d='M35 70 Q40 55 50 55 Q60 55 65 70 Z'
                    fill='#F4A8A2'
                    stroke='#8B5E3C'
                    stroke-width='2'
                  />
                  <rect
                    x='38'
                    y='70'
                    width='24'
                    height='20'
                    fill='#C96B6B'
                    stroke='#8B5E3C'
                    stroke-width='2'
                  />
                  <rect
                    x='70'
                    y='65'
                    width='22'
                    height='18'
                    rx='3'
                    fill='#8B5E3C'
                  />
                  <circle cx='81' cy='74' r='5' fill='#F5E1C3' />
                  <path
                    d='M92 68 Q96 74 92 80'
                    fill='none'
                    stroke='#8B5E3C'
                    stroke-width='3'
                  />
                </svg>
              }
            </div>
          </Link> */}

          <ul className='navbar-nav flex-row gap-5 fs-5'>
            {routes.map(route => (
              <li key={route.path} className='nav-item'>
                <NavLink
                  className='nav-link header-nav-link text-bold'
                  aria-current='page'
                  to={route.path}
                >
                  {route.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </>
  );
}
