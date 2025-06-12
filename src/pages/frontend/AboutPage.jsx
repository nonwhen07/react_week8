import React from 'react';
import { Link } from 'react-router-dom';

import HeroBanner from '@/components/frontend/HeroBanner';
// import HeroBanner from '@/components/frontend/HeroBanner';
import MapSection from '@/components/frontend/MapSection';

export default function AboutPage() {
  return (
    <>
      {/* 1. Hero 區塊 */}
      <HeroBanner />
      <div className='about-page'>
        {/* 1. Hero 區塊 */}
        {/* <section className='about-hero-section'>
          <HeroBanner
            // 建議加 props，讓 About 用不同主標題/副標
            title='一杯咖啡的日常，一口麵包的幸福'
            subtitle='在日常之中，感受手焙的溫度與真實。'
          />
        </section> */}
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

        {/* 2. 品牌故事區塊 */}
        <section className='about-story-section'>
          <div className='container'>
            <h2 className='fw-bold text-center mb-4'>品牌故事</h2>
            <div className='row align-items-center'>
              <div className='col-lg-6 mb-4 mb-lg-0'>
                <img
                  src='/images/story.jpg'
                  alt='品牌故事'
                  className='about-story-img'
                />
              </div>
              <div className='col-lg-6'>
                <div className='about-story-text'>
                  <p>
                    手焙日和
                    BakeDay，起源於對「每日溫柔生活節奏」的想像。我們相信，一杯好咖啡與一塊精緻甜點，能為日常帶來不一樣的能量。從選豆、烘焙到出杯，專注每一個細節，是我們的承諾。
                  </p>
                  <p>我們的故事，就像你的一天：樸實、溫暖、值得期待。</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. 雙圖文介紹/特色區塊 */}
        <section className='about-feature-section'>
          <div className='container'>
            <div className='row'>
              <div className='col-md-6'>
                <img
                  src='https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80'
                  alt='品牌空間'
                  className='about-feature about-story-img'
                />
              </div>
              <div className='col-md-4 m-auto text-center'>
                <h4 className='mt-4'>每日儀式感</h4>
                <p className='about-feature text-muted'>
                  以晨光為起點，讓一杯手沖成為早晨的儀式。我們提供舒適空間，陪伴每個期待展開的日子。
                </p>
              </div>
            </div>
            <div className='row flex-row-reverse justify-content-between mt-5'>
              <div className='col-md-6'>
                <img
                  src='https://images.unsplash.com/photo-1517686469429-8bdb88b9f907?auto=format&fit=crop&w=1200&q=80'
                  alt='烘焙過程'
                  className='about-feature about-story-img'
                />
              </div>
              <div className='col-md-4 m-auto text-center'>
                <h4 className='mt-4'>手作與堅持</h4>
                <p className='about-feature text-muted'>
                  所有甜點皆為每日手作，從配方、選材到細膩製程，傳遞我們對品質的堅持與溫度。
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 嚴選原料與堅持 */}
        <section className='about-ingredients-section bg-light py-5'>
          <div className='container'>
            <h2 className='text-center fw-bold mb-5'>嚴選原料與堅持</h2>
            <div className='row g-5'>
              <div className='col-md-6'>
                <img
                  src='/images/coffee-beans.jpg'
                  alt='咖啡豆'
                  className='img-fluid rounded'
                />
                <h4 className='mt-3'>☕ 咖啡的溫度，來自豆子的起點</h4>
                <p>
                  精選來自非洲與中南美洲的小農莊園豆，搭配低溫烘焙技術，呈現風味層次與花果香氣。
                </p>
              </div>
              <div className='col-md-6'>
                <img
                  src='/images/bread.jpg'
                  alt='烘焙麵包'
                  className='img-fluid rounded'
                />
                <h4 className='mt-3'>🥖 麵包的靈魂，是時間與耐心</h4>
                <p>
                  採用日本與歐洲進口麵粉，堅持天然發酵，讓麵包每一口都散發出微酸與自然的小麥香。
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 呼籲區 CTA */}
        <section className='about-cta-section text-center py-5 bg-dark text-white'>
          <h3 className='mb-4'>準備好感受一天的溫柔節奏了嗎？</h3>
          <Link to='/product' className='btn btn-outline-light btn-lg'>
            逛逛我們的精選商品
          </Link>
        </section>

        {/* 地圖區塊（由首頁搬遷） */}
        <section className='about-map-section'>
          <MapSection />
        </section>
      </div>
    </>
  );
}
