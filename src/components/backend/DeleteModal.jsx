import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { Modal } from 'bootstrap';
import axios from 'axios';
import ReactLoading from 'react-loading';

import { pushMessage } from '../../redux/toastSlice';
import { getTitleText } from '../../utils/displayUtils';

export default function DeleteModal({
  apiType,
  // tempProduct,
  modalData,
  // getProducts,
  onRefetch,
  isOpen,
  setIsOpen,
}) {
  // 環境變數
  const baseURL = import.meta.env.VITE_BASE_URL;
  const apiPath = import.meta.env.VITE_API_PATH;

  // dispatch 是用來發送 actions 到 Redux store 的，讓我們可以修改 store 的狀態。
  const dispatch = useDispatch();

  // Modal Ref 定義
  const deleteModalRef = useRef(null);
  const modalInstanceRef = useRef(null); // 保存 Modal 實例

  const [isLoading, setIsLoading] = useState(false);

  const handleCloseDeleteModal = () => {
    // Modal.getInstance(deleteModalRef.current).hide();
    setIsOpen(false);
  };

  const { typeName, itemLabel } = getTitleText(apiType, modalData);

  // 刪除產品動點 => 調整成由 handleDeleteProduct 來顯示 dispatch 模式和訊息
  const handleDeleteItem = async () => {
    setIsLoading(true);
    try {
      // await deleteProduct();
      await deleteItem();
      onRefetch();
      handleCloseDeleteModal();

      dispatch(pushMessage({ text: '刪除項目成功', status: 'success' }));
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
  // 刪除 => 調整成由 handleDeleteProduct 來顯示 dispatch 模式和訊息
  //handleDeleteItem
  const deleteItem = async () => {
    // await axios.delete(
    //   `${baseURL}/v2/api/${apiPath}/admin/product/${tempProduct.id}`
    // );
    await axios.delete(
      `${baseURL}/v2/api/${apiPath}/admin/${apiType}/${modalData.id}`
    );
  };

  //初始化 Modal
  useEffect(() => {
    if (deleteModalRef.current) {
      modalInstanceRef.current = new Modal(deleteModalRef.current, {
        backdrop: false,
      });
    }

    //以下幾行處理 綁定 Modal hide 事件（當 Modal 被 ESC 關閉，或點 backdrop 關閉）
    const handleHidden = () => {
      setIsOpen(false); // 同步更新 React 狀態

      // 你在關閉 DeleteModal 時，Bootstrap 自動加上 aria-hidden="true"，但 Modal 裡面的按鈕還有焦點。
      // React、Bootstrap 在執行 .hide() 或切換 Modal 狀態時出現 焦點未移除，就會出現這個警告。
      document.activeElement.blur(); // 在 Modal 關閉時，把焦點移走（如移到 body），讓 ARIA 不衝突。
    };
    const refCurrent = deleteModalRef.current;
    refCurrent.addEventListener('hidden.bs.modal', handleHidden);
    // return () => { ... } => 是當元件被卸載或頁面切換時，React 自動幫我執行的動作，這時我應該用它來清除監聽器，避免監聽器還在背後跑。
    // useEffect 的 return 是清除副作用專用，元件卸載或更新時會自動執行，專門用來清監聽、定時器等資源。
    return () => {
      // 清除事件監聽，避免記憶體洩漏
      refCurrent.removeEventListener('hidden.bs.modal', handleHidden);
    };
  }, []);

  // Modal 開關控制（依 isOpen 狀態切換）
  useEffect(() => {
    const modalInstance = modalInstanceRef.current;
    if (!modalInstance) return;
    if (isOpen) {
      modalInstance.show();
    } else {
      modalInstance.hide();
    }
  }, [isOpen]);

  return (
    <div
      id='delProductModal'
      ref={deleteModalRef}
      className='modal fade'
      tabIndex='-1'
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
    >
      <div className='modal-dialog'>
        <div className='modal-content'>
          <div className='modal-header bg-danger text-white'>
            <h1 className='modal-title fs-5'>刪除{typeName}</h1>
            <button
              onClick={handleCloseDeleteModal}
              type='button'
              className='btn-close'
              data-bs-dismiss='modal'
              aria-label='Close'
            ></button>
          </div>
          <div className='modal-body'>
            你是否要刪除這個{' '}
            <span className='text-danger fw-bold'>
              {`${typeName}編號： ${itemLabel}`}
            </span>
          </div>
          <div className='modal-footer'>
            <button
              type='button'
              onClick={handleDeleteItem}
              className='btn btn-danger d-flex align-items-center justify-content-center'
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
              刪除
            </button>
            <button
              type='button'
              onClick={handleCloseDeleteModal}
              className='btn btn-outline-secondary'
            >
              取消
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
