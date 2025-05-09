import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { Modal } from 'bootstrap';
import axios from 'axios';
import { pushMessage } from '../../redux/toastSlice';
import ReactLoading from 'react-loading';
import { formatDateInputValue, toTimestamp } from '../../utils/format';

export default function CouponModal({
  modalMode,
  tempCoupon,
  getCoupons,
  isOpen,
  setIsOpen,
}) {
  const baseURL = import.meta.env.VITE_BASE_URL;
  const apiPath = import.meta.env.VITE_API_PATH;
  const dispatch = useDispatch();

  const [modalData, setModalData] = useState(tempCoupon || {});
  const [isLoading, setIsLoading] = useState(false);

  const couponModalRef = useRef(null);
  const modalInstanceRef = useRef(null);

  const handleInputChange = e => {
    const { name, value, checked, type } = e.target;
    setModalData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    const apiFunc = modalMode === 'create' ? createCoupon : updateCoupon;
    try {
      await apiFunc();
      getCoupons();
      setIsOpen(false);
      dispatch(
        pushMessage({
          text: `${modalMode === 'create' ? '新增' : '編輯'}優惠券成功`,
          status: 'success',
        })
      );
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

  const createCoupon = async () => {
    await axios.post(`${baseURL}/v2/api/${apiPath}/admin/coupon`, {
      data: {
        ...modalData,
        is_enabled: modalData.is_enabled ? 1 : 0,
        percent: Number(modalData.percent),
        // due_date: new Date(modalData.due_date).getTime() / 1000,
        due_date: toTimestamp(modalData.due_date),
      },
    });
  };

  const updateCoupon = async () => {
    await axios.put(
      `${baseURL}/v2/api/${apiPath}/admin/coupon/${modalData.id}`,
      {
        data: {
          ...modalData,
          is_enabled: modalData.is_enabled ? 1 : 0,
          percent: Number(modalData.percent),
          due_date: toTimestamp(modalData.due_date),
        },
      }
    );
  };

  const handleHidden = () => {
    setIsOpen(false);
    document.activeElement.blur();
  };

  useEffect(() => {
    if (couponModalRef.current) {
      modalInstanceRef.current = new Modal(couponModalRef.current, {
        backdrop: false,
      });
      couponModalRef.current.addEventListener('hidden.bs.modal', handleHidden);
    }
    return () =>
      couponModalRef.current?.removeEventListener(
        'hidden.bs.modal',
        handleHidden
      );
  }, []);

  useEffect(() => {
    if (isOpen) {
      modalInstanceRef.current?.show();
    } else {
      modalInstanceRef.current?.hide();
    }
  }, [isOpen]);

  useEffect(() => {
    setModalData({
      ...(tempCoupon || {
        title: '',
        code: '',
        percent: 0,
        due_date: '',
        is_enabled: 0,
      }),
    });
  }, [tempCoupon]);

  return (
    <div
      id='couponModal'
      ref={couponModalRef}
      className='modal backend-modal fade'
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
    >
      <div className='modal-dialog modal-dialog-centered'>
        <div className='modal-content border-0 shadow'>
          <div className='modal-header backend-modal__header border-bottom'>
            <h5 className='modal-title fw-bold fs-4'>
              {modalMode === 'create'
                ? '新增優惠券'
                : `編輯 - ${modalData.title}`}
            </h5>
            <button
              type='button'
              onClick={() => setIsOpen(false)}
              className='btn-close'
            ></button>
          </div>
          <div className='modal-body p-4'>
            <div className='mb-3'>
              <label className='form-label'>標題</label>
              <input
                type='text'
                className='form-control'
                name='title'
                value={modalData.title}
                onChange={handleInputChange}
              />
            </div>
            <div className='mb-3'>
              <label className='form-label'>優惠碼</label>
              <input
                type='text'
                className='form-control'
                name='code'
                value={modalData.code}
                onChange={handleInputChange}
              />
            </div>
            <div className='mb-3'>
              <label className='form-label'>折扣百分比</label>
              <input
                type='number'
                className='form-control'
                name='percent'
                value={modalData.percent}
                onChange={handleInputChange}
              />
            </div>
            <div className='mb-3'>
              <label className='form-label'>到期日</label>
              <input
                type='date'
                className='form-control'
                name='due_date'
                value={formatDateInputValue(modalData.due_date)}
                onChange={handleInputChange}
              />
            </div>
            <div className='form-check'>
              <input
                type='checkbox'
                className='form-check-input'
                name='is_enabled'
                checked={Boolean(modalData.is_enabled)}
                onChange={handleInputChange}
              />
              <label className='form-check-label'>是否啟用</label>
            </div>
          </div>
          <div className='modal-footer backend-modal__footer border-top bg-light'>
            <button
              type='button'
              onClick={handleSubmit}
              className='btn btn-primary d-flex align-items-center justify-content-center'
            >
              {isLoading ? (
                <ReactLoading
                  type='spin'
                  color='#fff'
                  height='1.25rem'
                  width='1.25rem'
                />
              ) : null}
              <span className='ms-2'>確認</span>
            </button>
            <button
              type='button'
              onClick={() => setIsOpen(false)}
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
