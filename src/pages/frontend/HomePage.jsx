import coffeeImg1 from '@/assets/product/經典手沖咖啡.png';
import cakeImg1 from '@/assets/product/焙茶巴斯克蛋糕.png';
import cakeImg2 from '@/assets/product/手工可麗露.png';

import HomeCouponSection from '@/components/frontend/HomeCouponSection';
import MapSection from '@/components/frontend/MapSection';

import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

import { Link } from 'react-router-dom';

export default function HomePage() {
  // const BASE_URL = import.meta.env.VITE_BASE_URL;
  // const API_PATH = import.meta.env.VITE_API_PATH;

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
    // const carouselElement = document.getElementById('storeShowcase');
    // if (carouselElement) {
    //   new window.bootstrap.Carousel(carouselElement, {
    //     interval: 5000,
    //     ride: 'carousel',
    //   });
    // }
  }, []);

  return (
    <>
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
      <div className='container-fluid'>
        {/* Hero Banner 背景區塊 */}
        {/* <div
          className='position-absolute'
          style={{
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            backgroundImage:
              'url(https://images.unsplash.com/photo-1480399129128-2066acb5009e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80)',
            backgroundPosition: 'center center',
            opacity: 0.1,
            zIndex: -1,
          }}
        ></div> */}
        {/* Hero Banner 文字主題區塊 */}
        {/* <div
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
        </div> */}

        {/* 精選產品區 */}
        {/* 「這區已快速完成，主圖＋Hover有感。回來時從邊框 /
      色彩切入，提升卡片精緻感。」 「AOS動感做出層次，未來加 delay +
      交錯感，讓每張卡片像有節奏進場。」 */}
        <section className='homepage-featured-section'>
          <div className='container my-5'>
            <div className='row mt-5'>
              <div className='col-md-4 mt-md-4'>
                <div
                  className='homepage-product-card card mb-4'
                  data-aos='fade-up'
                  data-aos-delay='100'
                >
                  <div className='homepage-product-img-wrap position-relative'>
                    <Link to={`/product/-OLxGFSBmzKjGgpIo_kv`}>
                      <img
                        src={coffeeImg1}
                        className='homepage-product-img card-img-top rounded-0'
                        alt='經典手沖咖啡.png'
                      />
                    </Link>
                  </div>
                  <div className='card-body text-center'>
                    <h4 className='card-title'>經典手沖咖啡</h4>
                    <div className='d-flex justify-content-center'>
                      <p className='card-text text-muted mb-0'>
                        單品豆手沖，萃出晨光第一縷香氣。
                        <br />
                        每日現磨，讓咖啡香層層展開，陪你迎接每一天。
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className='col-md-4 mt-md-4'>
                <div
                  className='homepage-product-card card mb-4'
                  data-aos='fade-up'
                  data-aos-delay='200'
                >
                  <div className='homepage-product-img-wrap position-relative'>
                    <Link to={`/product/-OLxMz88c0RS9wSBf6pr`}>
                      <img
                        src={cakeImg1}
                        className='homepage-product-img card-img-top rounded-0'
                        alt='焙茶巴斯克蛋糕.png'
                      />
                    </Link>
                  </div>
                  <div className='card-body text-center'>
                    <h4 className='card-title'>焙茶巴斯克蛋糕</h4>
                    <div className='d-flex justify-content-center'>
                      <p className='card-text text-muted mb-0'>
                        日式焙茶遇上濃郁乳酪，
                        <br />
                        每一口都柔滑香濃，層層堆疊出溫潤茶香。
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className='col-md-4 mt-md-4'>
                <div
                  className='homepage-product-card card mb-4'
                  data-aos='fade-up'
                  data-aos-delay='300'
                >
                  <div className='homepage-product-img-wrap position-relative'>
                    <Link to={`/product/-OLxN-_PO1uWZVaM32AB`}>
                      <img
                        src={cakeImg2}
                        alt='手工可麗露.png'
                        className='homepage-product-img card-img-top rounded-0'
                      />
                    </Link>
                  </div>
                  <div className='card-body text-center'>
                    <h4 className='card-title'>手工可麗露</h4>
                    <div className='d-flex justify-content-center'>
                      <p className='card-text text-muted mb-0'>
                        焦糖酥脆的外衣，藏著濕潤香甜的柔軟內心。
                        <br />
                        每日手工現烤，只為最剛好的美味瞬間。
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 首頁 CTA，跳轉about區 */}
        <section className='homepage-cta-section'>
          <div className='container my-7 text-center cta-glass-wrap'>
            <h3>Morning Bean Café 的每一天</h3>
            <p className='text-dark mt-3'>
              我們每日嚴選豆種，只為帶給你晨間最香的一杯。
              <br />
              在這裡，享受屬於你的慢時光。
            </p>
            <Link to='/about' className='btn btn-outline-dark mt-3'>
              了解我們
            </Link>
          </div>
        </section>

        {/* 優惠券區 */}
        <section className='homepage-homecoupon-section'>
          <HomeCouponSection />
        </section>

        {/* 門市資訊區 */}
        <section className='homepage-map-section'>
          <MapSection />
        </section>

        {/* Email 訂關區 */}
        <section className='homepage-newsletter-section'>
          <div className='container my-5 px-0'>
            <div className='bg-light py-4'>
              <div className='container'>
                <div className='d-flex flex-column flex-md-row justify-content-between align-items-md-center align-items-start'>
                  <p className='mb-0 fw-bold'>歡迎訂閱我們的電子報!</p>
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
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
