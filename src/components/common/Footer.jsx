import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <>
      {/* <div className='bg-light py-4'>
        <div className='container'>
          <div className='d-flex flex-column flex-md-row justify-content-between align-items-md-center align-items-start'>
            <p className='mb-0 fw-bold'>Lorem ipsum dolor sit amet.</p>
            <div className='input-group w-md-50 mt-md-0 mt-3'>
              <input
                type='text'
                className='form-control rounded-0'
                placeholder=''
              />
              <div className='input-group-append'>
                <button
                  className='btn btn-dark rounded-0'
                  type='button'
                  id='search'
                >
                  Lorem ipsum
                </button>
              </div>
            </div>
          </div>
        </div>
      </div> */}
      <div className='bg-dark py-5'>
        <div className='container'>
          <div className='d-flex align-items-center justify-content-between text-white mb-md-7 mb-4'>
            <Link className='text-white h4' to='/'>
              <span className='header-nav-logo-text'>Morning Bean Café</span>
            </Link>
            <ul className='d-flex list-unstyled mb-0 h4'>
              <li>
                <Link href='#' className='text-white mx-3'>
                  <i className='fab fa-facebook'></i>
                </Link>
              </li>
              <li>
                <Link href='#' className='text-white mx-3'>
                  <i className='fab fa-instagram'></i>
                </Link>
              </li>
              <li>
                <Link href='#' className='text-white ms-3'>
                  <i className='fab fa-line'></i>
                </Link>
              </li>
            </ul>
          </div>
          <div className='d-flex flex-column flex-md-row justify-content-between align-items-md-end align-items-start text-white'>
            <div className='mb-md-0 mb-1'>
              <p className='mb-0'>02-3456-7890</p>
              <p className='mb-0'>service@mail.com</p>
            </div>
            <p className='mb-0'>
              本網站僅供作品使用，無包含任何商業用途
              <br /> © 2025 Morning Bean Café All Rights Reserved.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
