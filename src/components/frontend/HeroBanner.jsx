import { Link } from 'react-router-dom';

export default function HeroBanner() {
  return (
    <section
      className='homepage-hero-section position-relative overflow-hidden'
      style={{ width: '100%', margin: 0, padding: 0 }}
    >
      {/* 背景圖層 */}
      <div
        className='hero-banner-bg position-absolute'
        style={{
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          backgroundImage:
            'url(https://images.unsplash.com/photo-1480399129128-2066acb5009e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80)',
          backgroundPosition: 'center center',
          backgroundSize: 'cover',
          opacity: 0.1,
          zIndex: -1,
        }}
      ></div>
      {/* 前景文字 */}
      <div
        className='container d-flex flex-column'
        style={{ minHeight: 'calc(100vh - 56px)' }}
      >
        <div className='row justify-content-center my-auto'>
          <div className='col-md-4 text-center'>
            <h2>讓每日咖啡，成為晨間儀式.</h2>
            <p className='text-muted mb-0'>現磨手沖・手作甜點・舒適空間.</p>
            <div className='d-flex justify-content-center'>
              <Link className='btn btn-dark rounded-0 mt-6' to='/product'>
                查看菜單.
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
