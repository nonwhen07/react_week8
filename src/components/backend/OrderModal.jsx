import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { pushMessage } from '../../redux/toastSlice';
import { Modal } from 'bootstrap';
import ReactLoading from 'react-loading';
import axios from 'axios';
import { formatPrice } from '../../utils/format';

export default function OrderModal({
  tempOrder,
  getOrders,
  isOpen,
  setIsOpen,
}) {
  // 環境變數
  const baseURL = import.meta.env.VITE_BASE_URL;
  const apiPath = import.meta.env.VITE_API_PATH;

  // dispatch 是用來發送 actions 到 Redux store 的，讓我們可以修改 store 的狀態。
  const dispatch = useDispatch();

  // 拷貝 tempOrder 資料來轉換成 modalData來顯示，必谝tempOrder 初始值可能是 undefined
  const [modalData, setModalData] = useState({
    id: '',
    is_paid: false,
    products: [],
    message: '',
    user: {
      name: '',
      email: '',
      tel: '',
      address: '',
    },
  });

  // Modal Ref 定義
  const orderModalRef = useRef(null);
  const modalInstanceRef = useRef(null); // 保存 Modal 實例

  // 設置loading狀態
  const [isLoading, setIsLoading] = useState(false);

  // 編輯訂單動點 => 調整成由 updateOrder 來顯示 dispatch 模式和訊息
  const handleUpdateOrder = async () => {
    setIsLoading(true);
    try {
      await axios.put(
        `${baseURL}/v2/api/${apiPath}/admin/order/${modalData.id}`,
        {
          data: {
            ...modalData,
            is_paid: modalData.is_paid ? 1 : 0,
          },
        }
      );
      getOrders(); // 更新完畢後，驅動外部頁面重新查詢資料
      handleCloseOrderModal();
      dispatch(
        pushMessage({
          text: `編輯訂單成功`,
          status: 'success',
        })
      );
    } catch (error) {
      const rawMessage = error.response?.data?.message;
      const errorMessage = Array.isArray(rawMessage)
        ? rawMessage.join('、')
        : rawMessage || '發生錯誤，請稍後再試';
      dispatch(pushMessage({ text: errorMessage, status: 'failed' }));
    } finally {
      setIsLoading(false);
    }
  };

  // Modal 開關控制
  const handleCloseOrderModal = () => {
    setIsOpen(false);
  };

  //初始化 Modal
  useEffect(() => {
    if (orderModalRef.current) {
      // new Modal(orderModalRef.current, { backdrop: false });
      modalInstanceRef.current = new Modal(orderModalRef.current, {
        backdrop: false,
      });
    }
    //以下幾行處理 綁定 Modal hide 事件（當 Modal 被 ESC 關閉，或點 backdrop 關閉）
    const refCurrent = orderModalRef.current;
    const handleHidden = () => {
      setIsOpen(false);
      document.activeElement.blur(); // 在 Modal 關閉時，把焦點移走（如移到 body），讓 ARIA 不衝突。
    };
    refCurrent.addEventListener('hidden.bs.modal', handleHidden);
    return () => {
      refCurrent.removeEventListener('hidden.bs.modal', handleHidden);
    };
  }, []);

  // Modal 開關控制
  useEffect(() => {
    const modalInstance = modalInstanceRef.current;
    if (!modalInstance) return;
    isOpen ? modalInstance.show() : modalInstance.hide();
  }, [isOpen]);

  // 當外部 tempOrder 有異動時，更新 modalData 狀態
  // API 回傳的訂單結構中，products 是物件型集合（key 為訂單中商品的識別碼）
  // 為保留每筆商品的 key，這裡不轉為陣列，而是直接保留原始物件格式
  // 若 tempOrder 為空，則 fallback 為空物件或預設值
  useEffect(() => {
    setModalData({
      ...(tempOrder || { is_paid: false }),
      products: tempOrder?.products || {},
    });
  }, [tempOrder]);

  return (
    <div
      id='orderModal'
      ref={orderModalRef}
      className='modal backend-modal'
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      aria-hidden={!isOpen}
    >
      <div className='modal-dialog modal-dialog-centered modal-xl'>
        <div className='modal-content border-0 shadow'>
          <div className='modal-header border-bottom backend-modal__header'>
            <h5 className='fw-bold 25modal-title fs-4'>{`編輯訂單編號 ${modalData.id}`}</h5>
            <button
              type='button'
              onClick={handleCloseOrderModal}
              className='btn-close'
              aria-label='Close'
            ></button>
          </div>

          <div className='modal-body p-4'>
            <div className='row g-4'>
              {/* 左欄：客戶資訊與留言 */}
              <div className='col-md-5'>
                <div className='border p-4 rounded-3'>
                  <h5 className='fw-bold mb-3'>客戶資訊</h5>
                  <dl className='row mb-0 text-muted'>
                    <dt className='col-5'>客戶名稱</dt>
                    <dd className='col-7 text-end'>{modalData.user.name}</dd>
                    <dt className='col-5'>客戶 email</dt>
                    <dd className='col-7 text-end'>{modalData.user.email}</dd>
                    <dt className='col-5'>客戶電話</dt>
                    <dd className='col-7 text-end'>{modalData.user.tel}</dd>
                    <dt className='col-5'>客戶地址</dt>
                    <dd className='col-7 text-end'>{modalData.user.address}</dd>
                  </dl>

                  <div className='mt-4'>
                    <label className='form-label fw-bold'>
                      客戶留言 / 備註
                    </label>
                    <textarea
                      className='form-control'
                      value={modalData.message || ''}
                      rows={2}
                      readOnly
                    ></textarea>
                  </div>

                  <div className='row align-items-center mt-3'>
                    <div className='col-6'>
                      <label className='fw-bold mb-0'>客戶付款資訊</label>
                    </div>
                    <div className='col-6 text-end'>
                      <div className='form-check form-switch d-inline-flex align-items-center gap-2'>
                        <input
                          className='form-check-input'
                          type='checkbox'
                          checked={modalData.is_paid}
                          onChange={() =>
                            setModalData(prev => ({
                              ...prev,
                              is_paid: !prev.is_paid,
                            }))
                          }
                          id='isPaidSwitch'
                        />
                        <label
                          className='form-check-label mb-0'
                          htmlFor='isPaidSwitch'
                        >
                          {modalData.is_paid ? '✅ 已付款' : '⌛ 尚未付款'}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 右欄：商品清單 */}
              <div className='col-md-7'>
                <table className='table align-middle'>
                  <thead className='table-light'>
                    <tr>
                      <th>品名</th>
                      <th className='text-center'>數量 / 單位</th>
                      <th className='text-end'>單價</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(modalData.products || {}).map(
                      ([key, item]) => (
                        <tr key={key}>
                          <td>
                            <div className='d-flex align-items-center gap-3'>
                              <img
                                src={item.product.imageUrl}
                                alt={item.product.title}
                                style={{
                                  width: '60px',
                                  height: '60px',
                                  objectFit: 'cover',
                                  borderRadius: '0.5rem',
                                }}
                              />
                              <span className='fw-bold'>
                                {item.product.title}
                              </span>
                            </div>
                          </td>
                          <td className='text-center'>
                            {item.qty} / {item.product.unit}
                          </td>
                          <td className='text-end'>
                            {formatPrice(item.final_total)}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className='modal-footer backend-modal__footer border-top bg-light'>
            <button
              type='button'
              onClick={handleUpdateOrder}
              className='btn btn-primary d-flex align-items-center justify-content-center'
              style={{ lineHeight: 'normal' }}
            >
              {isLoading && (
                <ReactLoading
                  type='spin'
                  color='#fff'
                  height='1.25rem'
                  width='1.25rem'
                />
              )}
              <span className='ms-2'>確認</span>
            </button>
            <button
              type='button'
              onClick={handleCloseOrderModal}
              className='btn btn-secondary'
            >
              取消
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
