import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import ReactLoading from 'react-loading';

import Pagination from '../../components/shared/Pagination';
import BulkActionBar from '../../components/shared/BulkActionBar';
import CouponModal from '../../components/backend/CouponModal';
import ConfirmModal from '../../components/shared/ConfirmModal';
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
  const [isLoading, setIsLoading] = useState(false);

  // state 增加 searchText / 原始資料 / 篩選結果
  const [searchText, setSearchText] = useState('');
  const [originalCoupons, setOriginalCoupons] = useState([]);
  const [filteredCoupons, setFilteredCoupons] = useState([]);

  // 批次處理資訊
  const [selectedCouponIds, setSelectedCouponIds] = useState([]);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

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
    setIsLoading(true);
    try {
      const res = await axios.get(
        `${baseURL}/v2/api/${apiPath}/admin/coupons?page=${page}`
      );
      const coupons = res.data.coupons;
      setOriginalCoupons(coupons); // 儲存原始完整資料
      setFilteredCoupons(coupons); // 預設顯示全部
      setPageInfo({ ...res.data.pagination, total: coupons.length }); // 更新分頁資訊
    } catch (error) {
      const msg = error.response?.data?.message;
      dispatch(
        pushMessage({
          text: Array.isArray(msg) ? msg.join('、') : msg || '取得優惠券失敗',
          status: 'failed',
        })
      );
    } finally {
      setIsLoading(false);
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

  // 勾選AllChange批次優惠券時，更新 selectedCouponIds
  const handleCheckAllChange = checked => {
    if (checked) {
      const allIds = filteredCoupons.map(coupon => coupon.id);
      setSelectedCouponIds(allIds);
    } else {
      setSelectedCouponIds([]);
    }
  };
  // 勾選批次優惠券時，更新 selectedCouponIds
  const handleCheckboxChange = (id, checked) => {
    if (checked) {
      setSelectedCouponIds(prev => [...prev, id]);
    } else {
      setSelectedCouponIds(prev => prev.filter(item => item !== id));
    }
  };

  // 批次啟用 / 停用優惠券
  const handleBatchUpdate = async (enableType = 'enabled') => {
    setIsLoading(true);
    try {
      for (const id of selectedCouponIds) {
        await axios.put(`${baseURL}/v2/api/${apiPath}/admin/coupon/${id}`, {
          data: {
            is_enabled: enableType === 'enabled' ? 1 : 0,
          },
        });
      }
      getCoupons(); // 重新取得資料
      dispatch(
        pushMessage({
          text: `批次${enableType === 'enabled' ? '啟用' : '停用'}優惠券成功`,
          status: 'success',
        })
      );
      setSelectedCouponIds([]); // 清除已勾選
    } catch (error) {
      const msg = error.response?.data?.message;
      dispatch(
        pushMessage({
          text: Array.isArray(msg) ? msg.join('、') : msg || '發生錯誤',
          status: 'failed',
        })
      );
    } finally {
      setIsLoading(false);
    }
  };

  // 批次刪除優惠券
  const handleBatchDelete = async () => {
    if (selectedCouponIds.length === 0) {
      dispatch(
        pushMessage({
          text: '批次刪除優惠券筆數為0，請重新檢視',
          status: 'failed',
        })
      );
      return;
    }

    setIsLoading(true);
    try {
      for (const id of selectedCouponIds) {
        await axios.delete(`${baseURL}/v2/api/${apiPath}/admin/coupon/${id}`);
      }
      getCoupons();
      dispatch(
        pushMessage({
          text: `已成功刪除 ${selectedCouponIds.length} 筆優惠券`,
          status: 'success',
        })
      );
      setSelectedCouponIds([]);
    } catch (error) {
      const msg = error.response?.data?.message;
      dispatch(
        pushMessage({
          text: Array.isArray(msg) ? msg.join('、') : msg || '發生錯誤',
          status: 'failed',
        })
      );
    } finally {
      setIsLoading(false);
      setIsConfirmModalOpen(false);
    }
  };

  // 開啟確認刪除 Modal
  const handleOpenConfirmModal = () => {
    setIsConfirmModalOpen(true);
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
      <div className='container py-5'>
        {/* 步驟 1：搜尋條件區塊 */}
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
            className='btn btn-primary'
          >
            新增優惠券
          </button>
        </div>

        {/* 步驟 2 + 3 ：優惠券清單與操作按鈕 + Table 、 分頁控制與每頁筆數 */}
        <div className='col-12 mb-3'>
          <div className='shadow p-4 rounded' style={{ minHeight: '280px' }}>
            {/* 步驟 4：批次操作（勾選 / 刪除 / 停用） */}
            {/* <div className='col-12 mb-3'>
              <div className='shadow p-4 rounded' style={{ minHeight: '120px' }}>
                <h5 className='fw-bold mb-3'>批次操作區塊</h5>
                <span className='text-muted'>
                  步驟 4：可勾選多筆資料進行刪除或停用
                </span>
              </div>
            </div> */}
            <BulkActionBar
              selectedIds={selectedCouponIds}
              onDelete={handleOpenConfirmModal}
              onEnable={() => handleBatchUpdate('enabled')}
              onDisable={() => handleBatchUpdate('disabled')}
            />
            <table className='table mt-4'>
              <thead>
                <tr>
                  <th>
                    <input
                      type='checkbox'
                      className='form-check-input'
                      checked={
                        filteredCoupons.length > 0 &&
                        selectedCouponIds.length === filteredCoupons.length
                      }
                      onChange={e => handleCheckAllChange(e.target.checked)}
                    />
                  </th>
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
                    <td>
                      <input
                        type='checkbox'
                        className='form-check-input'
                        checked={selectedCouponIds.includes(coupon.id)}
                        onChange={e =>
                          handleCheckboxChange(coupon.id, e.target.checked)
                        }
                      />
                    </td>
                    <td>{coupon.title}</td>
                    <td>{coupon.code}</td>
                    <td>{coupon.percent}</td>
                    <td>
                      {new Date(coupon.due_date * 1000).toLocaleDateString()}
                    </td>
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
            {/* 步驟 3：分頁控制與每頁筆數 */}
            <Pagination
              pageInfo={pageInfo}
              handlePageChange={handlePageChange}
            />
          </div>
        </div>

        {/* 步驟 5：匯入 / 匯出（選用功能） */}
        <div className='col-12 mb-3'>
          <div className='shadow p-4 rounded' style={{ minHeight: '120px' }}>
            <h5 className='fw-bold mb-3'>匯入 / 匯出</h5>
            <span className='text-muted'>
              步驟 5：提供 CSV / JSON 格式的匯入與匯出功能
            </span>
          </div>
        </div>
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

      <ConfirmModal
        title='確定要刪除這些優惠券嗎？'
        onConfirm={handleBatchDelete}
        isOpen={isConfirmModalOpen}
        setIsOpen={setIsConfirmModalOpen}
      />

      {isLoading && (
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
