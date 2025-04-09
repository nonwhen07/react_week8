import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { pushMessage } from '../../redux/toastSlice';
import { Modal } from 'bootstrap';
import ReactLoading from 'react-loading';
import axios from 'axios';
// import { formatPrice } from '../../utils/format';

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

  // 拷貝 tempOrder 資料來轉換成 modalData來顯示
  const [modalData, setModalData] = useState(tempOrder);

  // Modal Ref 定義
  const orderModalRef = useRef(null);
  const modalInstanceRef = useRef(null); // 保存 Modal 實例

  // 設置loading狀態
  const [isLoading, setIsLoading] = useState(false);

  // 編輯訂單動點 => 調整成由 updateOrder 來顯示 dispatch 模式和訊息
  const handleUpdateOrder = async () => {
    setIsLoading(true);
    // const apiCall = modalMode === 'create' ? createOrder : updateOrder;
    const apiCall = updateOrder;
    try {
      await apiCall(); // 呼叫對應的 createOrder 或 updateOrder
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

  // 編輯訂單-是否已付款
  const updateOrder = async () => {
    await axios.put(
      `${baseURL}/v2/api/${apiPath}/admin/order/${modalData.id}`,
      {
        data: {
          ...modalData,
          is_paid: modalData.is_paid ? 1 : 0,
        },
      }
    );
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
    const handleHidden = () => {
      setIsOpen(false); // 同步更新 React 狀態

      // 你在關閉 orderModal 時，Bootstrap 自動加上 aria-hidden="true"，但 Modal 裡面的按鈕還有焦點。
      // React、Bootstrap 在執行 .hide() 或切換 Modal 狀態時出現 焦點未移除，就會出現這個警告。
      document.activeElement.blur(); // 在 Modal 關閉時，把焦點移走（如移到 body），讓 ARIA 不衝突。
    };
    const refCurrent = orderModalRef.current;
    refCurrent.addEventListener('hidden.bs.modal', handleHidden);
    // return () => { ... } => 是當元件被卸載或頁面切換時，React 自動幫我執行的動作，這時我應該用它來清除監聽器，避免監聽器還在背後跑。
    // useEffect 的 return 是清除副作用專用，元件卸載或更新時會自動執行，專門用來清監聽、定時器等資源。
    return () => {
      // 清除事件監聽，避免記憶體洩漏
      refCurrent.removeEventListener('hidden.bs.modal', handleHidden);
    };
  }, []);

  // Modal 開關控制
  useEffect(() => {
    const modalInstance = modalInstanceRef.current;
    if (!modalInstance) return;
    if (isOpen) {
      modalInstance.show();
    } else {
      modalInstance.hide();
    }
  }, [isOpen]);

  // 當外部 tempOrder 有異動時，更新modalData
  useEffect(() => {
    console.log('檢查tempOrder', tempOrder);
    setModalData({
      ...(tempOrder || {
        is_paid: false,
      }),
    });
  }, [tempOrder]);

  return (
    <div
      id='orderModal'
      ref={orderModalRef}
      className='modal'
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
    >
      <div className='modal-dialog modal-dialog-centered modal-xl'>
        <div className='modal-content border-0 shadow'>
          <div className='modal-header border-bottom'>
            <h5 className='modal-title fs-4'>{`編輯訂單編號 ${modalData.id}`}</h5>
            <button
              type='button'
              onClick={handleCloseOrderModal}
              className='btn-close'
              aria-label='Close'
            ></button>
          </div>

          <div className='modal-body p-4'>
            <div className='row g-4'>
              <div className='col-md-4'>
                <div className='mb-5'>
                  <div className='border p-4 mb-4'>
                    <h4 className='fw-bold mb-4'>Custom Detail</h4>
                    <table className='table text-muted'>
                      <tbody>
                        <tr>
                          <th
                            scope='row'
                            className='border-0 px-0 pt-4 font-weight-normal'
                          >
                            user
                          </th>
                          <td className='text-end border-0 px-0 pt-4'>
                            {/* {modalData.user.name} */}
                          </td>
                        </tr>
                        <tr>
                          <th
                            scope='row'
                            className='border-0 px-0 pt-4 font-weight-normal'
                          >
                            email
                          </th>
                          <td className='text-end border-0 px-0 pt-4'>
                            {/* {tempOrder.user.email} */}
                          </td>
                        </tr>
                        <tr>
                          <th
                            scope='row'
                            className='border-0 px-0 pt-4 font-weight-normal'
                          >
                            tell
                          </th>
                          <td className='text-end border-0 px-0 pt-4'>
                            {/* {tempOrder.user.tell} */}
                          </td>
                        </tr>
                        <tr>
                          <th
                            scope='row'
                            className='border-0 px-0 pt-4 font-weight-normal'
                          >
                            address
                          </th>
                          <td className='text-end border-0 px-0 pt-4'>
                            {/* {tempOrder.user.address} */}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className='col-md-8'>
                <table className='table'>
                  <thead>
                    <tr>
                      <th scope='col' className='border-0 ps-0'>
                        品名
                      </th>
                      <th scope='col' className='border-0'>
                        數量/單位
                      </th>
                      <th scope='col' className='border-0'>
                        單價
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* {modalData.products.map(product => (
                      <tr key={product.id} className='border-bottom'>
                        <th
                          scope='row'
                          className='border-0 px-0 font-weight-normal py-4'
                        >
                          <img
                            src={product.imageUrl}
                            alt={product.title}
                            style={{
                              width: '72px',
                              height: '72px',
                              objectFit: 'cover',
                            }}
                          />
                          <p className='mb-0 fw-bold ms-3 d-inline-block'>
                            {product.title}
                          </p>
                        </th>
                        <td
                          className='border-0 align-middle'
                          style={{ maxWidth: '160px' }}
                        >
                          <div className='input-group pe-5'>
                            <span>{product.qty}</span>
                            <span>{product.unit}</span>
                          </div>
                        </td>
                        <td className='border-0 align-middle'>
                          <p className='mb-0 ms-auto'>
                            {formatPrice(product.total)}
                          </p>
                        </td>
                      </tr>
                    ))} */}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className='modal-footer border-top bg-light'>
            <button
              type='button'
              onClick={handleUpdateOrder}
              className='btn btn-primary d-flex align-items-center justify-content-center'
              style={{ lineHeight: 'normal' }} // 修正 line-height 導致的錯位
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
