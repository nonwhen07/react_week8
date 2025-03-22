import { Link, NavLink } from 'react-router-dom';

const routes = [
  // { path: '/', name: '首頁' },
  // { path: '/products', name: '產品列表' },
  // { path: '/cart', name: '購物車' },
  { path: '/', name: 'Home' },
  { path: '/products', name: 'Product' },
  { path: '/products', name: 'Detail' },
  { path: '/cart', name: 'Cart' },
];

export default function Header() {
  return (
    <div className='container d-flex flex-column'>
      <nav className='navbar navbar-expand-lg navbar-light'>
        <Link to='/' className='navbar-brand header-nav-brand'>
          <span className='header-nav-logo-text'>Morning Bean Café</span>
        </Link>
        {/* <a className='navbar-brand' href='./index.html'>
          Navbar
        </a> */}
        <button
          className='navbar-toggler'
          type='button'
          data-bs-toggle='collapse'
          data-bs-target='#navbarNavAltMarkup'
          aria-controls='navbarNavAltMarkup'
          aria-expanded='false'
          aria-label='Toggle navigation'
        >
          <span className='navbar-toggler-icon'></span>
        </button>
        <div
          className='collapse navbar-collapse justify-content-end'
          id='navbarNavAltMarkup'
        >
          <div className='navbar-nav'>
            {/* <a className='nav-item nav-link me-4 active' href='./index.html'>
              Home <span className='sr-only'>(current)</span>
            </a>
            <a className='nav-item nav-link me-4' href='./product.html'>
              Product
            </a>
            <a className='nav-item nav-link me-4' href='./detail.html'>
              Detail
            </a>
            <a className='nav-item nav-link' href='./cart.html'>
              <i className='fas fa-shopping-cart'></i>
            </a> */}
            {routes.map(route => (
              <NavLink
                className='nav-item nav-link me-4'
                aria-current='page'
                to={route.path}
              >
                {route.name === 'cart' ? (
                  <i className='fas fa-shopping-cart'></i>
                ) : (
                  route.name
                )}
              </NavLink>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
}
