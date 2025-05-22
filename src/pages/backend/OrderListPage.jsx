import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import ReactLoading from 'react-loading';

// Redux 與工具
import { checkLogin } from '../../redux/authSlice';
import { pushMessage } from '../../redux/toastSlice';
import { formatDateTime } from '../../utils/format';

// 自訂元件
import Pagination from '../../components/shared/Pagination';
import OrderModal from '../../components/backend/OrderModal';
import DeleteModal from '../../components/backend/DeleteModal';
// import DataTransferPanel from '../../components/shared/DataTransferPanel';

export default function OrderListPage() {
  //🟦 使用者與 API 狀態管理
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { status, error } = useSelector(state => state.auth);
  //🟨 請求與環境設定
  const baseURL = import.meta.env.VITE_BASE_URL;
  const apiPath = import.meta.env.VITE_API_PATH;

  //Modal 資料狀態的預設值
  const defaultModalState = {
    is_paid: false,
    user: {
      name: '',
      email: '',
      tel: '',
      address: '',
    },
    products: [],
  };

  // 狀態管理 (State)
  const [orders, setOrders] = useState([]);
  const [pageInfo, setPageInfo] = useState({});
  const [tempOrder, setTempOrder] = useState(defaultModalState);
  // const [modalMode, setModalMode] = useState(null);

  // 管理Modal元件開關-OrderModal、DeleteModal
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // 螢幕Loading遮罩
  const [isScreenLoading, setIsScreenLoading] = useState(false);

  // useEffect
  useEffect(() => {
    // const token = document.cookie.replace(
    //   /(?:(?:^|.*;\s*)hexToken4\s*=\s*([^;]*).*$)|^.*$/,
    //   '$1'
    // );
    // axios.defaults.headers.common['Authorization'] = token;
    // 由於首頁的 useEffect 會先執行，所以這邊不需要再檢查登入狀態了
    // 直接取得訂單資訊列表
    dispatch(checkLogin());
  }, []);

  useEffect(() => {
    if (status === 'failed') {
      dispatch(pushMessage({ text: error || '請重新登入', status: 'failed' }));
      navigate('/login');
      return;
    }

    if (status === 'succeeded') {
      getOrders(); // ✅ 只有驗證通過才取得產品列表
    }
  }, [status]);

  // 直接取得訂單資訊列表
  const getOrders = async (page = 1) => {
    setIsScreenLoading(true);
    try {
      const res = await axios.get(
        `${baseURL}/v2/api/${apiPath}/admin/orders?page=${page}`
      );
      const orders = res.data.orders;
      setOrders(orders);
      setPageInfo({ ...res.data.pagination, total: orders.length }); // 更新分頁資訊
    } catch (error) {
      const rawMessage = error.response?.data?.message;
      const errorMessage = Array.isArray(rawMessage)
        ? rawMessage.join('、')
        : rawMessage || '取得訂單列表失敗';
      dispatch(pushMessage({ text: errorMessage, status: 'failed' }));
    } finally {
      setIsScreenLoading(false);
    }
  };
  // 訂單列表分頁
  const handlePageChange = (page = 1) => {
    getOrders(page);
  };

  // Modal 開關控制
  // OrderModal
  const handleOpenOrderModal = (order = defaultModalState) => {
    // setModalMode(mode);
    setTempOrder(
      // 避免 api 回傳 order 為空物件時，無法正確設定tempOrder更保險
      Object.keys(order).length > 0 ? order : defaultModalState
    );
    setIsOrderModalOpen(true);
  };
  // DeleteModal
  const handleOpenDeleteModal = (order = defaultModalState) => {
    setTempOrder(
      // 避免 api 回傳 order 為空物件時，無法正確設定tempOrder更保險
      order && Object.keys(order).length > 0 ? order : defaultModalState
    );
    setIsDeleteModalOpen(true);
  };

  return (
    <>
      <div className='container py-5'>
        <section aria-labelledby='order-search-bar' className='mb-3'>
          <div className='d-flex justify-content-between'>
            <h2>訂單列表</h2>
            {/* <input
              type='text'
              className='form-control w-25'
              placeholder='搜尋標題 / 優惠碼'
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
            /> */}
          </div>
        </section>
        <section aria-labelledby='order-table-section' className='mb-3'>
          {/* <BulkActionBar
            selectedIds={selectedCouponIds}
            onDelete={handleOpenConfirmModal}
            onEnable={() => handleBatchUpdate('enabled')}
            onDisable={() => handleBatchUpdate('disabled')}
          /> */}
          <table className='table backend-table table-hover table-bordered align-middle text-center mt-4'>
            <thead>
              <tr>
                <th scope='col-4'>訂單編號</th>
                <th scope='col-2'>建立時間</th>
                <th scope='col-2'>客戶名稱</th>
                <th scope='col-2'>留言</th>
                <th scope='col-1'>已付款</th>
                <th scope='col-1'>操作</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id}>
                  <th scope='row'>{order.id}</th>
                  <td>{formatDateTime(order.create_at)}</td>
                  <td>{order.user.name}</td>
                  <td>{order.message || '-'}</td>
                  <td>
                    {order.is_paid ? (
                      <span className='text-success'>已付款</span>
                    ) : (
                      <span>未付款</span>
                    )}
                  </td>
                  <td>
                    <button
                      onClick={() => handleOpenOrderModal(order)}
                      className='btn btn-sm btn-outline-primary'
                      type='button'
                    >
                      <i className='bi bi-pencil-square me-1'></i>
                      編輯
                    </button>
                    <button
                      onClick={() => handleOpenDeleteModal(order)}
                      className='btn btn-sm btn-outline-danger'
                      type='button'
                    >
                      刪除
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination pageInfo={pageInfo} handlePageChange={handlePageChange} />
        </section>
        <section aria-labelledby='order-transfer-section' className='mt-4'>
          {/* <DataTransferPanel
            typeMode={'coupon'}
            fileFormat={fileFormat}
            setFileFormat={setFileFormat}
            onExport={handleExport}
          /> */}
        </section>
      </div>

      <OrderModal
        tempOrder={tempOrder}
        getOrders={getOrders}
        isOpen={isOrderModalOpen}
        setIsOpen={setIsOrderModalOpen}
      />

      <DeleteModal
        apiType='order'
        modalData={tempOrder}
        onRefetch={getOrders}
        isOpen={isDeleteModalOpen}
        setIsOpen={setIsDeleteModalOpen}
      />

      {/* <ConfirmModal
        title='確定要刪除這些優惠券嗎？'
        onConfirm={handleBatchDelete}
        isOpen={isConfirmModalOpen}
        setIsOpen={setIsConfirmModalOpen}
      /> */}

      {/* 確保以移動去main.jsx，確保 Toast 能全局監聽 Redux 狀態 */}
      {/* <Toast /> */}

      {/* ScreenLoading */}
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
