import { useRef, useState, useEffect } from 'react';
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
import { toTimestamp } from '../../utils/format';

import Papa from 'papaparse';

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

  // 由於api沒有堤共分頁的資料，所以需要自己撰寫一個函式來取得所有優惠券資料
  const getAllCoupons = async () => {
    const firstPage = await axios.get(
      `${baseURL}/v2/api/${apiPath}/admin/coupons?page=1`
    );
    const { coupons: firstCoupons, pagination } = firstPage.data;

    const pageRequests = [];
    for (let i = 2; i <= pagination.total_pages; i++) {
      pageRequests.push(
        axios.get(`${baseURL}/v2/api/${apiPath}/admin/coupons?page=${i}`)
      );
    }

    const restResponses = await Promise.all(pageRequests);
    const restCoupons = restResponses.flatMap(res => res.data.coupons);

    return [...firstCoupons, ...restCoupons];
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
        const fullCoupon = originalCoupons.find(c => c.id === id);
        if (!fullCoupon) continue;

        console.log('fullCoupon', fullCoupon);
        await axios.put(`${baseURL}/v2/api/${apiPath}/admin/coupon/${id}`, {
          data: {
            ...fullCoupon,
            is_enabled: enableType === 'enabled' ? 1 : 0,
            percent: Number(fullCoupon.percent), // 保險轉型
            due_date: toTimestamp(fullCoupon.due_date, false), // 若不是 timestamp
          },
        });
      }

      getCoupons();
      dispatch(
        pushMessage({
          text: `批次${enableType === 'enabled' ? '啟用' : '停用'}優惠券成功`,
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

  const fileInputRef = useRef(null);
  const [exportFormat, setExportFormat] = useState('csv'); // 預設 CSV

  //✅ handleExport（將資料匯出為 CSV）
  const handleExport = async () => {
    const allCoupons = await getAllCoupons();

    let content = '';
    let mimeType = '';
    let extension = '';

    if (exportFormat === 'csv') {
      content = Papa.unparse(allCoupons);
      mimeType = 'text/csv;charset=utf-8;';
      extension = 'csv';
    } else {
      content = JSON.stringify(allCoupons, null, 2);
      mimeType = 'application/json';
      extension = 'json';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `coupons_export.${extension}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  //✅ handleImport（處理上傳的 CSV 檔案）
  const handleImport = e => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        const importedData = results.data;
        console.log('匯入資料內容:', importedData);
        // 👉 你可在這裡依需求進行後續處理
      },
    });

    // 清除選取狀態，避免無法再次上傳相同檔案
    e.target.value = '';
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

            {/* 步驟 5：匯入 / 匯出（選用功能） */}
            {/* <div className='card mt-4'>
              <div className='card-header bg-light d-flex justify-content-between align-items-center'>
                <h5 className='mb-0'>📁 匯入 / 匯出優惠券資料</h5>
                <div>
                  <button
                    className='btn btn-outline-primary btn-sm me-2'
                    onClick={handleExport}
                  >
                    匯出資料（CSV）
                  </button>
                  <button
                    className='btn btn-outline-success btn-sm'
                    onClick={() => fileInputRef.current.click()}
                  >
                    匯入資料（CSV）
                  </button>
                  <input
                    type='file'
                    accept='.csv'
                    className='d-none'
                    ref={fileInputRef}
                    onChange={handleImport}
                  />
                </div>
              </div>
              <div className='card-body text-muted small'>
                <ul className='mb-0'>
                  <li>可下載目前優惠券資料（.csv 格式）</li>
                  <li>請使用匯出的資料格式進行編輯後再匯入</li>
                  <li>匯入時會逐筆新增資料，請避免重複</li>
                  <li>單次匯入建議不超過 100 筆</li>
                </ul>
              </div>
            </div> */}

            <div className='card mt-4'>
              <div className='card-header bg-light d-flex justify-content-between align-items-center'>
                <h5 className='mb-0'>📁 匯入 / 匯出優惠券資料</h5>
                <div className='d-flex align-items-center'>
                  <label htmlFor='exportFormat' className='me-2 mb-0'>
                    匯入 / 匯出格式：
                  </label>
                  <select
                    id='exportFormat'
                    className='form-select form-select-sm me-2 text-center'
                    style={{ width: '120px' }}
                    value={exportFormat}
                    onChange={e => setExportFormat(e.target.value)}
                  >
                    <option value='csv'>CSV</option>
                    <option value='json'>JSON</option>
                  </select>

                  <button
                    className='btn btn-outline-primary btn-sm me-2'
                    onClick={handleExport}
                  >
                    匯出資料
                  </button>

                  <button
                    className='btn btn-outline-success btn-sm'
                    onClick={() => fileInputRef.current.click()}
                  >
                    匯入資料
                  </button>

                  <input
                    type='file'
                    accept='.csv'
                    className='d-none'
                    ref={fileInputRef}
                    onChange={handleImport}
                  />
                </div>
              </div>

              <div className='card-body text-muted small'>
                <ul className='mb-0'>
                  <li>📤 匯出：可選擇 CSV（表格）或 JSON（結構）格式</li>
                  <li>📥 匯入：請使用系統提供的 CSV 格式上傳資料</li>
                  <li>上傳資料將逐筆新增優惠券，請勿重複</li>
                  <li>建議單次匯入不超過 100 筆，避免錯誤與延遲</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* 步驟 5：匯入 / 匯出（選用功能） */}
        {/* <div className='col-12 mb-3'>
          <div className='shadow p-4 rounded' style={{ minHeight: '120px' }}>
            <h5 className='fw-bold mb-3'>匯入 / 匯出</h5>
            <span className='text-muted'>
              步驟 5：提供 CSV / JSON 格式的匯入與匯出功能
            </span>
          </div>
        </div> */}
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
