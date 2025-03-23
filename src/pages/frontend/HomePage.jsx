import coffeeImg1 from '../../assets/product/經典手沖咖啡.png';
import cakeImg1 from '../../assets/product/焙茶巴斯克蛋糕.png';
import cakeImg2 from '../../assets/product/手工可麗露.png';

import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function HomePage() {
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
    <div className='container-fluid'>
      <div
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
      ></div>
      {/* Hero Banner 區塊 */}
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
              {/* <button className='btn btn-dark rounded-0 mt-6'>查看菜單.</button> */}
            </div>
          </div>
        </div>
      </div>
      {/* 精選產品區 */}
      {/* 「這區已快速完成，主圖＋Hover有感。回來時從邊框 /
      色彩切入，提升卡片精緻感。」 「AOS動感做出層次，未來加 delay +
      交錯感，讓每張卡片像有節奏進場。」 */}
      <div className='container'>
        <div className='row mt-5'>
          <div className='col-md-4 mt-md-4'>
            <div className='card border-0 mb-4' data-aos='fade-up'>
              <img
                src={coffeeImg1}
                className='card-img-top rounded-0'
                alt='經典手沖咖啡.png'
              />
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
            <div className='card border-0 mb-4' data-aos='fade-up'>
              <img
                src={cakeImg1}
                className='card-img-top rounded-0'
                alt='焙茶巴斯克蛋糕.png'
              />
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
            <div className='card border-0 mb-4' data-aos='fade-up'>
              <img
                src={cakeImg2}
                alt='手工可麗露.png'
                className='card-img-top rounded-0'
              />
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

      {/* 3 */}
      <div
        id='storeShowcase'
        className='carousel slide carousel-fade'
        data-bs-ride='carousel'
        data-bs-interval='5000'
      >
        <div className='carousel-inner'>
          <div className='carousel-item active'>
            <div
              className='store-banner'
              style={{
                backgroundImage: 'url(./images/homepage/cafe_interior1.webp)',
              }}
            >
              <div className='overlay-text'>
                <h2>慢享生活・咖啡香氣與溫柔日光相伴1</h2>
              </div>
            </div>
          </div>
          <div className='carousel-item'>
            <div
              className='store-banner'
              style={{
                backgroundImage: 'url(./images/homepage/cafe_interior2.webp)',
              }}
            >
              <div className='overlay-text'>
                <h2>每個座位，都是屬於你的寧靜角落2</h2>
              </div>
            </div>
          </div>
          <div className='carousel-item'>
            <div
              className='store-banner'
              style={{
                backgroundImage: 'url(./images/homepage/cafe_interior3.webp)',
              }}
            >
              <div className='overlay-text'>
                <h2>每個座位，都是屬於你的寧靜角落3</h2>
              </div>
            </div>
          </div>
          <div className='carousel-item'>
            <div
              className='store-banner'
              style={{
                backgroundImage: 'url(./images/homepage/cafe_interior4.webp)',
              }}
            >
              <div className='overlay-text'>
                <h2>每個座位，都是屬於你的寧靜角落4</h2>
              </div>
            </div>
          </div>
        </div>

        <a
          className='carousel-control-prev'
          href='#storeShowcase'
          role='button'
          data-bs-slide='prev'
        >
          <span
            className='carousel-control-prev-icon'
            aria-hidden='true'
          ></span>
        </a>
        <a
          className='carousel-control-next'
          href='#storeShowcase'
          role='button'
          data-bs-slide='next'
        >
          <span
            className='carousel-control-next-icon'
            aria-hidden='true'
          ></span>
        </a>
      </div>

      {/* 4 */}
      {/* <div className='container my-7'>
        <div className='row'>
          <div className='col-md-6'>
            <img
              src='https://images.unsplash.com/photo-1490312278390-ab64016e0aa9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80'
              alt=''
              className='img-fluid'
            />
          </div>
          <div className='col-md-4 m-auto text-center'>
            <h4 className='mt-4'>Lorem ipsum</h4>
            <p className='text-muted'>
              Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
              nonumy eirmod tempor invidunt ut labore et dolore magna.
            </p>
          </div>
        </div>
        <div className='row flex-row-reverse justify-content-between mt-4'>
          <div className='col-md-6'>
            <img
              src='https://images.unsplash.com/photo-1490312278390-ab64016e0aa9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80'
              alt=''
              className='img-fluid'
            />
          </div>
          <div className='col-md-4 m-auto text-center'>
            <h4 className='mt-4'>Lorem ipsum</h4>
            <p className='text-muted'>
              Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
              nonumy eirmod tempor invidunt ut labore et dolore magna.
            </p>
          </div>
        </div>
      </div> */}
      <div className='container my-7 text-center'>
        <h3>Morning Bean Café 的每一天</h3>
        <p className='text-muted mt-3'>
          我們每日嚴選豆種，只為帶給你晨間最香的一杯。
          <br />
          在這裡，享受屬於你的慢時光。
        </p>
        <Link to={'/about'} className='btn btn-outline-dark mt-3'>
          了解我們
        </Link>
      </div>
      {/* Email 訂關區 */}
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
  );
}
