import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
// import Papa from 'papaparse';
import ReactLoading from 'react-loading';

// Redux 與工具
import { checkLogin } from '../../redux/authSlice';
import { pushMessage } from '../../redux/toastSlice';
import { toTimestamp } from '../../utils/format';
import { exportData, importData } from '../../utils/useImportExport';
import { validateCoupon } from '../../utils/format';

// 自訂元件
import Pagination from '../../components/shared/Pagination';
import BulkActionBar from '../../components/shared/BulkActionBar';
import CouponModal from '../../components/backend/CouponModal';
import ConfirmModal from '../../components/shared/ConfirmModal';
import DeleteModal from '../../components/backend/DeleteModal';

export default function CouponListPage() {
  //🟦 使用者與 API 狀態管理
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { status, error } = useSelector(state => state.auth);
  //🟨 請求與環境設定
  const baseURL = import.meta.env.VITE_BASE_URL;
  const apiPath = import.meta.env.VITE_API_PATH;

  //🟪 表單與 Modal 狀態
  const defaultCoupon = {
    title: '',
    code: '',
    percent: 0,
    due_date: '',
    is_enabled: 0,
  };
  const [tempCoupon, setTempCoupon] = useState(defaultCoupon);
  const [modalMode, setModalMode] = useState(null);
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  //🟧 頁面與資料
  // const [coupons, setCoupons] = useState([]);
  const [originalCoupons, setOriginalCoupons] = useState([]);
  const [filteredCoupons, setFilteredCoupons] = useState([]);
  const [pageInfo, setPageInfo] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  // state 增加 searchText / 原始資料 / 篩選結果
  const [searchText, setSearchText] = useState('');

  //🟩 批次選取與格式控制
  const [selectedCouponIds, setSelectedCouponIds] = useState([]);
  const [fileFormat, setFileFormat] = useState('csv'); //如有需要可在拆分export/import
  const fileInputRef = useRef(null);

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

  // 開啟 CouponModal
  const handleOpenCouponModal = (mode, coupon = defaultCoupon) => {
    setModalMode(mode);
    setTempCoupon(Object.keys(coupon).length > 0 ? coupon : defaultCoupon);
    setIsCouponModalOpen(true);
  };
  // 開啟共用 DeleteModal
  const handleOpenDeleteModal = (coupon = defaultCoupon) => {
    setTempCoupon(Object.keys(coupon).length > 0 ? coupon : defaultCoupon);
    setIsDeleteModalOpen(true);
  };

  // 開啟批次刪除確認 ConfirmModal
  const handleOpenConfirmModal = () => {
    setIsConfirmModalOpen(true);
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

  // ✅批次資料匯出(將資料匯出為 CSV/JSON） handleExport
  const handleExport = async () => {
    const allCoupons = await getAllCoupons();
    try {
      setIsLoading(true);
      const today = new Date().toISOString().split('T')[0];
      exportData(allCoupons, fileFormat, `${today}_CouponsExport`);
      dispatch(
        pushMessage({
          text: `匯出成功，請檢視附件 "${today}_CouponsExport" 。 `,
          status: 'success',
        })
      );
    } catch (error) {
      dispatch(
        pushMessage({
          text: `匯出失敗： ${error.message} `,
          status: 'failed',
        })
      );
    } finally {
      setIsLoading(false);
    }
  };

  // ✅批次資料上傳(將資料上傳為 CSV/JSON） handleImport
  const handleImport = async e => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setIsLoading(true);
      const importedData = await importData(file, fileFormat);

      let successCount = 0;
      let failCount = 0;

      for (const row of importedData) {
        const result = validateCoupon(row);
        if (!result.valid) {
          console.warn(`驗證失敗：${result.error}`, row);

          // 🔧（未來可記錄錯誤訊息與失敗列索引）
          failCount++;
          continue;
        }

        const payload = {
          title: row.title,
          code: row.code,
          percent: Number(row.percent),
          due_date: toTimestamp(row.due_date),
          is_enabled: 1,
        };

        try {
          await axios.post(`${baseURL}/v2/api/${apiPath}/admin/coupon`, {
            data: payload,
          });
          successCount++;
        } catch (err) {
          console.error('匯入失敗：', err);

          // 🔧 未來優化建議：
          // - 可根據錯誤訊息分類（如重複、欄位錯誤）
          // - 可將錯誤結果記錄起來顯示於 Modal / Alert
          failCount++;
        }
      }

      dispatch(
        pushMessage({
          text: `成功匯入 ${successCount} 筆，失敗 ${failCount} 筆`,
          status: failCount === 0 ? 'success' : 'warning',
        })
      );

      getCoupons();
    } catch (err) {
      dispatch(
        pushMessage({
          text: `匯入失敗： ${err.message}`,
          status: 'failed',
        })
      );
    } finally {
      setIsLoading(false);
      e.target.value = '';
    }
  };

  return (
    <>
      <div className='container py-5'>
        {/* 步驟 1：搜尋條件區塊 */}
        <section aria-labelledby='coupon-search-bar' className='mb-3'>
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
        </section>

        {/* 
        📝 步驟 6： 未來優化功能清單（註解提取版，每個頁面各自所需功能皆不同，這邊先規劃優惠卷可能所需的調整） ：
          1	顯示欄位錯誤原因	✍️ validateCoupon() 驗證強化	目前只回傳 true/false，未來可回傳錯誤原因（例如：{ valid: false, error: "缺少 code" }）
          2	記錄錯誤清單陣列	📊 匯入失敗筆數統計邏輯擴充	將錯誤資料推入陣列 failedRows[]，最後集中顯示於錯誤彈窗或 Console
          3	匯入前預覽失敗筆數	🔁 handleImport() 流程前置	在真正匯入 API 前先跑一輪驗證，顯示「共有 8 筆格式錯誤，是否仍要繼續？」
          4	將 API 錯誤分類顯示	🔁 匯入流程中 try/catch 的補強	例：優惠碼重複 vs 欄位格式錯誤 vs 權限問題等，顯示具體錯誤給管理員
          5	成功 / 失敗 log 匯出	📁 匯入模組的附加功能	若導入超過 100 筆，可能需要 log 失敗記錄供日後追查（例如產出 import-failed.csv）*/}

        {/* 步驟 2 + 3 ：優惠券清單與操作按鈕 + Table 、 分頁控制與每頁筆數 */}
        <section aria-labelledby='coupon-table-section' className='mb-3'>
          <div className='shadow p-4 rounded' style={{ minHeight: '280px' }}>
            {/* 步驟 4：批次操作（勾選 / 刪除 / 停用）元件 */}
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
        </section>

        {/* 步驟 5：匯入 / 匯出（選用功能）， 未來需要元件化/hook化 */}
        <section aria-labelledby='coupon-import-export' className='mt-4'>
          <div className='card mt-4'>
            <div className='card-header bg-light d-flex justify-content-between align-items-center'>
              <h5 className='mb-0'>📁 匯入 / 匯出優惠券資料</h5>
              <div className='d-flex align-items-center'>
                <label htmlFor='fileFormat' className='me-2 mb-0'>
                  匯入 / 匯出格式：
                </label>
                <select
                  id='fileFormat'
                  className='form-select form-select-sm me-2'
                  style={{ width: '100px' }}
                  value={fileFormat}
                  onChange={e => setFileFormat(e.target.value)}
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
                  accept={fileFormat === 'csv' ? '.csv' : '.json'}
                  className='d-none'
                  ref={fileInputRef}
                  onChange={handleImport}
                />
              </div>
            </div>

            <div className='card-body text-muted small'>
              <ul className='mb-0'>
                <li>📤 匯出：可選擇 CSV（表格）或 JSON（結構）格式</li>
                <li>📥 匯入：請使用對應格式（CSV / JSON）上傳資料</li>
                <li>上傳資料將逐筆新增優惠券，請勿重複</li>
                <li>建議單次匯入不超過 100 筆，避免錯誤與延遲</li>
              </ul>
            </div>
          </div>
        </section>
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
