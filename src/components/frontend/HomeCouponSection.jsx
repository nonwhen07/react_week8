import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
// import ReactLoading from 'react-loading';
import { useDispatch } from 'react-redux';
import { pushMessage } from '@/redux/toastSlice';
// import axios from 'axios';

export default function HomeCouponSection() {
  // const baseURL = import.meta.env.VITE_BASE_URL;
  // const apiPath = import.meta.env.VITE_API_PATH;
  const dispatch = useDispatch();
  const [coupons, setCoupons] = useState([]);
  const [error, setError] = useState(null);
  const [copiedCode, setCopiedCode] = useState(null);

  const mockCoupons = [
    {
      id: '1',
      title: '新品拿鐵半價',
      code: 'LATTEHALF',
      percent: 50,
      due_date: new Date('2025-11-19').getTime() / 1000,
      is_enabled: 1,
    },
    {
      id: '2',
      title: '蛋糕系列 88 折',
      code: 'CAKE88OFF',
      percent: 88,
      due_date: new Date('2025-12-31').getTime() / 1000,
      is_enabled: 1,
    },
    {
      id: '3',
      title: '咖啡買一送一',
      code: 'COFFEEBOGO',
      percent: 50,
      due_date: new Date('2025-12-31').getTime() / 1000,
      is_enabled: 1,
    },
  ];

  // const handleCopy = code => {
  //   navigator.clipboard.writeText(code).then(() => {
  //     dispatch(
  //       pushMessage({ text: `已複製優惠碼：${code}`, status: 'success' })
  //     );
  //   });
  // };

  const handleCopy = code => {
    navigator.clipboard.writeText(code).then(() => {
      dispatch(
        pushMessage({ text: `已複製優惠碼：${code}`, status: 'success' })
      );
      setCopiedCode(code);
      // setTimeout(() => setCopiedCode(null), 2000); // 2 秒後清除
    });
  };

  useEffect(() => {
    const fetchCoupons = async () => {
      // setIsLoading(true);
      try {
        // const res = await axios.get(`${baseURL}/v2/api/${apiPath}/coupon`);
        const now = Date.now() / 1000;

        // 過濾出啟用且未過期的優惠券，並限制顯示數量為3個
        // const availableCoupons = res.data.coupons
        //   .filter(coupon => coupon.is_enabled === 1 && coupon.due_date > now)
        //   .slice(0, 3);
        const availableCoupons = mockCoupons
          .filter(coupon => coupon.is_enabled === 1 && coupon.due_date > now)
          .slice(0, 3);

        setCoupons(availableCoupons);
      } catch (err) {
        console.error('載入優惠券失敗:', err);
        setError('載入優惠券失敗');
      }
    };

    fetchCoupons();
  }, []);

  // if (isLoading) {
  //   return (
  //     <div className='text-center my-5'>
  //       <div className='spinner-border text-dark' role='status'>
  //         <span className='visually-hidden'>Loading...</span>
  //       </div>
  //     </div>
  //   );
  // }

  if (error) {
    return (
      <div className='text-center text-danger my-5'>
        <p>{error}</p>
      </div>
    );
  }

  if (coupons.length === 0) return null;

  return (
    <>
      <div className='container my-5'>
        <h3 className='text-center mb-4'>限時優惠券</h3>
        <div className='row'>
          {coupons.map(coupon => (
            <div className='col-md-4 mb-4' key={coupon.id}>
              <div className='card h-100 text-center shadow-sm'>
                <div className='card-body'>
                  <h5 className='card-title'>{coupon.title}</h5>
                  <p className='text-muted'>折扣：{coupon.percent}%</p>
                  <p className='small'>
                    截止：
                    {new Date(coupon.due_date * 1000).toLocaleDateString()}
                  </p>
                  <div className='d-flex justify-content-center align-items-center mb-2'>
                    {/* <code
                      className={`me-2 p-1 px-2 border rounded ${
                        copiedCode === coupon.code
                          ? 'border-success text-success fw-bold'
                          : 'border-muted text-muted'
                      }`}
                    >
                      {coupon.code}
                    </code> */}
                    <code
                      className={`me-2 p-1 px-2 border rounded ${
                        copiedCode === coupon.code
                          ? 'border-success text-success fw-bold copied-highlight'
                          : 'border-muted text-muted'
                      }`}
                    >
                      {coupon.code}
                    </code>
                    {/* <button
                      className='btn btn-sm btn-outline-secondary'
                      onClick={() => handleCopy(coupon.code)}
                    >
                      複製
                    </button> */}
                    {/* <button
                      className='btn btn-sm btn-outline-secondary'
                      onClick={() => handleCopy(coupon.code)}
                    >
                      {copiedCode === coupon.code ? '✅ 已複製' : '複製'}
                    </button> */}
                    <button
                      className={`btn btn-sm ${
                        copiedCode === coupon.code
                          ? 'btn-success'
                          : 'btn-outline-secondary'
                      }`}
                      onClick={() => handleCopy(coupon.code)}
                    >
                      {copiedCode === coupon.code ? '已複製' : '複製'}
                    </button>
                  </div>
                  <Link to='/product' className='btn btn-outline-dark btn-sm'>
                    前往使用
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* ScreenLoading */}
      {/* {isLoading && (
        <div
          className='d-flex justify-content-center align-items-center'
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(255,255,255,0.3)',
            zIndex: 999,
          }}
        >
          <ReactLoading type='spin' color='black' width='4rem' height='4rem' />
        </div>
      )} */}
    </>
  );
}
