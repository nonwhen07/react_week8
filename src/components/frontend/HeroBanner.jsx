import { Link } from 'react-router-dom';

export default function HeroBanner() {
  return (
    <section className='homepage-hero-section position-relative'>
      <div className='hero-bg'></div>
      <div
        className='container d-flex flex-column justify-content-center'
        style={{ minHeight: 'calc(100vh - 56px)' }}
      >
        <div className='row justify-content-center my-auto'>
          <div className='col-md-4 text-center'>
            <h2 className='homepage-hero-title' data-aos='fade-down'>
              讓每日咖啡，成為晨間儀式.
            </h2>
            <p
              className='homepage-hero-subtitle text-muted mb-0'
              data-aos='fade-down'
              data-aos-delay='150'
            >
              現磨手沖・手作甜點・舒適空間.
            </p>
            <div
              className='d-flex justify-content-center'
              data-aos='fade-up'
              data-aos-delay='400'
            >
              <Link
                className='btn btn-dark rounded-0 homepage-hero-btn mt-6'
                to='/product'
              >
                查看菜單.
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
