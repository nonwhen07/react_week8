import React from 'react';
import { Link } from 'react-router-dom';

export default function AboutPage() {
  return (
    <>
      <div className='about-page'>
        {/* Hero Banner */}
        <section className='hero-banner text-white text-center d-flex align-items-center justify-content-center'>
          <div className='hero-content'>
            <h1 className='display-4 fw-bold'>
              一杯咖啡的日常，一口麵包的幸福
            </h1>
            <p className='lead'>在日常之中，感受手焙的溫度與真實。</p>
          </div>
        </section>

        {/* 品牌故事 */}
        <section className='container py-5'>
          <div className='row align-items-center'>
            <div className='col-lg-6 mb-4 mb-lg-0'>
              <h2 className='fw-bold'>
                從一間巷弄咖啡館，開始了一段溫柔革命。
              </h2>
              <p>
                Morning Bean Café 起源於一個簡單的信念：
                <strong>「讓每一天都值得用一杯好咖啡開始」</strong>。
              </p>
              <p>
                我們相信，真正的好味道來自於時間與用心——不論是手工烘焙的麵包，或是每一杯現磨現沖的咖啡。
              </p>
              <p>我們的故事，就像你的一天：樸實、溫暖、值得期待。</p>
            </div>
            <div className='col-lg-6'>
              <img
                src='/images/story.jpg'
                alt='品牌故事'
                className='img-fluid rounded shadow'
              />
            </div>
          </div>
        </section>

        {/* 嚴選原料與堅持 */}
        <section className='bg-light py-5'>
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
        <section className='cta-section text-center py-5 bg-dark text-white'>
          <h3 className='mb-4'>準備好感受一天的溫柔節奏了嗎？</h3>
          <Link to='/product' className='btn btn-outline-light btn-lg'>
            逛逛我們的精選商品
          </Link>
        </section>
      </div>
    </>
  );
}
