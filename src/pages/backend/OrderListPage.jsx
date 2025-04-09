import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import ReactLoading from 'react-loading';

import Pagination from '../../components/Pagination';
import OrderModal from '../../components/backend/OrderModal';
// import DeleteModal from '../../components/backend/DeleteModal';
import { pushMessage } from '../../redux/toastSlice';

import { formatDateTime } from '../../utils/format';

export default function OrderListPage() {
  // 初始化 navigate
  // const navigate = useNavigate();
  const dispatch = useDispatch();

  // 環境變數
  const baseURL = import.meta.env.VITE_BASE_URL;
  const apiPath = import.meta.env.VITE_API_PATH;

  //Modal 資料狀態的預設值
  const defaultModalState = {
    imageUrl: '',
    title: '',
    category: '',
    unit: '',
    origin_price: '',
    price: '',
    description: '',
    content: '',
    is_enabled: 0,
    imagesUrl: [''],
  };

  // 狀態管理 (State)
  const [orders, setOrders] = useState([]);
  const [pageInfo, setPageInfo] = useState({});
  const [tempOrder, setTempOrder] = useState(defaultModalState);
  // const [modalMode, setModalMode] = useState(null);

  // 管理Modal元件開關-OrderModal、DeleteModal
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  // const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // 螢幕Loading遮罩
  const [isScreenLoading, setIsScreenLoading] = useState(false);

  // useEffect
  useEffect(() => {
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)hexToken4\s*=\s*([^;]*).*$)|^.*$/,
      '$1'
    );
    axios.defaults.headers.common['Authorization'] = token;
    // 由於首頁的 useEffect 會先執行，所以這邊不需要再檢查登入狀態了
    // 直接取得訂單資訊列表
    getOrders();
  }, []);

  // 直接取得訂單資訊列表
  const getOrders = async (page = 1) => {
    setIsScreenLoading(true);
    try {
      const res = await axios.get(
        `${baseURL}/v2/api/${apiPath}/admin/orders?page=${page}`
      );
      setOrders(res.data.orders);
      console.log('檢查orders', res.data.orders);
      setPageInfo(res.data.pagination);
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
  // const handleOpenDeleteModal = (order = defaultModalState) => {
  //   setTempOrder(
  //     // 避免 api 回傳 order 為空物件時，無法正確設定tempOrder更保險
  //     order && Object.keys(order).length > 0 ? order : defaultModalState
  //   );
  //   setIsDeleteModalOpen(true);
  // };

  return (
    <>
      <div className='container py-5'>
        <div className='d-flex justify-content-between'>
          <h2>訂單列表</h2>
        </div>
        <table className='table table-hover table-bordered align-middle text-center mt-4'>
          <thead>
            <tr>
              <th scope='col-4'>訂單編號</th>
              <th scope='col-2'>建立時間</th>
              <th scope='col-2'>客戶名稱</th>
              <th scope='col-2'>已付款</th>
              <th scope='col-2'>操作</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <th scope='row'>{order.id}</th>
                <td>{formatDateTime(order.create_at)}</td>
                <td>{order.user.name}</td>
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
                    編輯
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination pageInfo={pageInfo} handlePageChange={handlePageChange} />
      </div>

      <OrderModal
        tempOrder={tempOrder}
        getOrders={getOrders}
        isOpen={isOrderModalOpen}
        setIsOpen={setIsOrderModalOpen}
      />

      {/* <DeleteModal
        tempOrder={tempOrder}
        getOrders={getOrders}
        isOpen={isDeleteModalOpen}
        setIsOpen={setIsDeleteModalOpen}
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
