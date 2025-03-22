// import { Link } from 'react-router-dom';
// import bannerImage from '../../assets/images/homepage/hero_1.png';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => setLoading(false), 1200); // 模擬加載 1.2s
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className='loading-screen d-flex justify-content-center align-items-center'>
        <div className='spinner-border text-warning' role='status'>
          <span className='visually-hidden'>Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className='container py-8'>
        {/* Hero Banner */}
        {/* <section className=' border-top px-lg-0 py-lg-10'>
          <div className='home-banner'>
            <div className='banner-title'>
              <h1 className='text-4xl font-bold mb-4 text-pink-700'>
                烘焙與咖啡課程，打造質感生活！
              </h1>
              <button className='bg-pink-500 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded'>
                立即探索課程
              </button>
            </div>
          </div>
        </section> */}
        <section id='home' className='home-banner'>
          <div className='banner-overlay'>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              烘焙與咖啡課程，打造質感生活
            </motion.h1>
            <motion.button className='explore-btn' whileHover={{ scale: 1.05 }}>
              立即探索課程
            </motion.button>
          </div>
        </section>

        {/* 精選課程 */}
        <section id='featured' className='container py-5'>
          <h2 className='h2-title text-center mb-4'>熱門推薦課程</h2>
          <div className='row'>
            {[1, 2, 3].map(i => (
              <div key={i} className='col-md-4 mb-4'>
                <motion.div className='card h-100' whileHover={{ scale: 1.02 }}>
                  <img
                    src={`/images/course${i}.jpg`}
                    className='card-img-top'
                    alt='課程'
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                  <div className='card-body'>
                    <h5 className='card-title'>課程名稱 {i}</h5>
                    <p className='card-text'>簡短描述，介紹課程內容與特色。</p>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </section>

        {/* 教學流程 */}
        <section
          id='process'
          className='py-5'
          style={{ backgroundColor: '#F5F1EB' }}
        >
          <div className='container text-center'>
            <h2 className='h2-title text-center mb-4'>教學流程</h2>
            <div className='row'>
              {['報名課程', '選擇時間', '現場學習', '互動體驗'].map(
                (step, i) => (
                  <motion.div
                    key={i}
                    className='col-md-3 mb-4'
                    whileInView={{ opacity: 1, y: 0 }}
                    initial={{ opacity: 0, y: 30 }}
                    transition={{ duration: 0.5, delay: i * 0.2 }}
                  >
                    <div className='p-3 bg-white rounded shadow-sm h-100'>
                      <h5 className='mb-2' style={{ color: '#D4A373' }}>
                        {step}
                      </h5>
                    </div>
                  </motion.div>
                )
              )}
            </div>
          </div>
        </section>

        {/* 學員回饋 */}
        <section
          id='feedback'
          style={{ backgroundColor: '#F5F1EB' }}
          className='py-5'
        >
          <div className='container'>
            <h2 className='h2-title text-center mb-4'>學員回饋</h2>
            <div className='row'>
              {['小珊', '阿志'].map((name, idx) => (
                <div key={idx} className='col-md-6 mb-4'>
                  <motion.div
                    className='p-4 border rounded bg-white'
                    whileInView={{ opacity: 1, y: 0 }}
                    initial={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.6 }}
                  >
                    <p style={{ color: '#5B3E35', fontWeight: 'bold' }}>
                      「這裡是學員的回饋文句...」
                    </p>
                    <div className='text-end text-muted small'>— {name}</div>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ 區 */}
        <section id='faq' className='container py-5'>
          <h2 className='h2-title text-center mb-4'>常見問題 FAQ</h2>
          <div className='accordion' id='faqAccordion'>
            {['課程需要預約嗎？', '可以退款嗎？', '有提供材料嗎？'].map(
              (q, idx) => (
                <div key={idx} className='accordion-item'>
                  <h2 className='accordion-header'>
                    <button
                      className='accordion-button collapsed'
                      type='button'
                      data-bs-toggle='collapse'
                      data-bs-target={`#faq${idx}`}
                    >
                      {q}
                    </button>
                  </h2>
                  <div
                    id={`faq${idx}`}
                    className='accordion-collapse collapse'
                    data-bs-parent='#faqAccordion'
                  >
                    <div className='accordion-body'>
                      這裡是解答內容，簡短說明解惑。
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </section>

        {/* 品牌故事 */}
        <section id='about' className='container py-5'>
          <h2 className='h2-title text-center mb-4'>關於手焙日和</h2>
          <p style={{ lineHeight: '1.6' }}>
            「手焙日和
            BakeDay」，致力於傳遞烘焙與咖啡的幸福時光。讓學習成為日常生活中的質感享受。
          </p>
        </section>

        {/* <!-- 手焙日和動態 --> */}
        {/* <section className='latest-news'>
          <h2>手焙日和動態</h2>
          <div className='news-item'>活動與文章 (多個)</div>
        </section> */}
      </div>
    </>
  );
}
