import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import ReactLoading from 'react-loading';

import Pagination from '../../components/Pagination';
import CouponModal from '../../components/backend/CouponModal';
import DeleteModal from '../../components/backend/DeleteModal';
import { checkLogin } from '../../redux/authSlice';
import { pushMessage } from '../../redux/toastSlice';

export default function CouponListPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { status, error } = useSelector(state => state.auth);

  const baseURL = import.meta.env.VITE_BASE_URL;
  const apiPath = import.meta.env.VITE_API_PATH;

  const defaultCoupon = {
    title: '',
    code: '',
    percent: 0,
    due_date: '',
    is_enabled: 0,
  };

  // const [coupons, setCoupons] = useState([]);
  const [pageInfo, setPageInfo] = useState({});
  const [tempCoupon, setTempCoupon] = useState(defaultCoupon);
  const [modalMode, setModalMode] = useState(null);
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isScreenLoading, setIsScreenLoading] = useState(false);

  // state 增加 searchText / 原始資料 / 篩選結果
  const [searchText, setSearchText] = useState('');
  const [originalCoupons, setOriginalCoupons] = useState([]);
  const [filteredCoupons, setFilteredCoupons] = useState([]);

  useEffect(() => {
    dispatch(checkLogin());
  }, []);

  useEffect(() => {
    if (status === 'failed') {
      dispatch(pushMessage({ text: error || '請重新登入', status: 'failed' }));
      navigate('/login');
      return;
    }
    if (status === 'succeeded') {
      getCoupons();
    }
  }, [status]);

  const getCoupons = async (page = 1) => {
    setIsScreenLoading(true);
    try {
      const res = await axios.get(
        `${baseURL}/v2/api/${apiPath}/admin/coupons?page=${page}`
      );
      const coupons = res.data.coupons;
      setOriginalCoupons(coupons); // 儲存原始完整資料
      setFilteredCoupons(coupons); // 預設顯示全部
      setPageInfo(res.data.pagination);
    } catch (error) {
      const msg = error.response?.data?.message;
      dispatch(
        pushMessage({
          text: Array.isArray(msg) ? msg.join('、') : msg || '取得優惠券失敗',
          status: 'failed',
        })
      );
    } finally {
      setIsScreenLoading(false);
    }
  };

  const handlePageChange = (page = 1) => {
    getCoupons(page);
  };

  const handleOpenCouponModal = (mode, coupon = defaultCoupon) => {
    setModalMode(mode);
    setTempCoupon(Object.keys(coupon).length > 0 ? coupon : defaultCoupon);
    setIsCouponModalOpen(true);
  };

  const handleOpenDeleteModal = (coupon = defaultCoupon) => {
    setTempCoupon(Object.keys(coupon).length > 0 ? coupon : defaultCoupon);
    setIsDeleteModalOpen(true);
  };

  // 搜尋欄位變動時觸發過濾
  useEffect(() => {
    const keyword = searchText.toLowerCase();
    const result = originalCoupons.filter(
      coupon =>
        coupon.title.toLowerCase().includes(keyword) ||
        coupon.code.toLowerCase().includes(keyword)
    );
    setFilteredCoupons(result);
  }, [searchText, originalCoupons]);

  return (
    <>
      <div className='d-flex justify-content-between align-items-center mb-3'>
        <h2>優惠券列表</h2>
        <input
          type='text'
          className='form-control w-25'
          placeholder='搜尋標題 / 優惠碼'
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
        />
        <button
          type='button'
          onClick={() => handleOpenCouponModal('create')}
          className='btn btn-primary ms-3'
        >
          新增優惠券
        </button>
      </div>
      <div className='container py-5'>
        <div className='d-flex justify-content-between'>
          <h2>優惠券列表</h2>
          <button
            type='button'
            onClick={() => handleOpenCouponModal('create')}
            className='btn btn-primary'
          >
            新增優惠券
          </button>
        </div>
        <table className='table mt-4'>
          <thead>
            <tr>
              <th>名稱</th>
              <th>優惠碼</th>
              <th>折扣 (%)</th>
              <th>到期日</th>
              <th>狀態</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredCoupons.map(coupon => (
              <tr key={coupon.id}>
                <td>{coupon.title}</td>
                <td>{coupon.code}</td>
                <td>{coupon.percent}</td>
                <td>{new Date(coupon.due_date * 1000).toLocaleDateString()}</td>
                <td>
                  {coupon.is_enabled ? (
                    <span className='text-success'>啟用</span>
                  ) : (
                    <span>未啟用</span>
                  )}
                </td>
                <td>
                  <button
                    onClick={() => handleOpenCouponModal('edit', coupon)}
                    className='btn btn-sm btn-outline-primary me-2'
                  >
                    編輯
                  </button>
                  <button
                    onClick={() => handleOpenDeleteModal(coupon)}
                    className='btn btn-sm btn-outline-danger'
                  >
                    刪除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination pageInfo={pageInfo} handlePageChange={handlePageChange} />
      </div>

      <CouponModal
        modalMode={modalMode}
        tempCoupon={tempCoupon}
        getCoupons={getCoupons}
        isOpen={isCouponModalOpen}
        setIsOpen={setIsCouponModalOpen}
      />

      <DeleteModal
        apiType='coupon'
        modalData={tempCoupon}
        onRefetch={getCoupons}
        isOpen={isDeleteModalOpen}
        setIsOpen={setIsDeleteModalOpen}
      />

      {isScreenLoading && (
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
      )}
    </>
  );
}
