import { useEffect, useRef, useState } from 'react';
import { Modal } from 'bootstrap';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { pushMessage } from '../../redux/toastSlice';
import ReactLoading from 'react-loading';

export default function NewsModal({
  modalMode,
  tempNews,
  getNews,
  isOpen,
  setIsOpen,
}) {
  const baseURL = import.meta.env.VITE_BASE_URL;
  const apiPath = import.meta.env.VITE_API_PATH;
  const dispatch = useDispatch();

  const [modalData, setModalData] = useState(tempNews || {});
  const [isLoading, setIsLoading] = useState(false);

  const modalRef = useRef(null);
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
    const func = modalMode === 'create' ? createNews : updateNews;
    try {
      await func();
      getNews();
      setIsOpen(false);
      dispatch(
        pushMessage({
          text: `${modalMode === 'create' ? '新增' : '編輯'}最新消息成功`,
          status: 'success',
        })
      );
    } catch (err) {
      const msg = err.response?.data?.message;
      dispatch(
        pushMessage({
          text: Array.isArray(msg) ? msg.join('、') : msg || '儲存失敗',
          status: 'failed',
        })
      );
    } finally {
      setIsLoading(false);
    }
  };

  const createNews = async () => {
    await axios.post(`${baseURL}/v2/api/${apiPath}/admin/article`, {
      data: {
        ...modalData,
        is_enabled: modalData.is_enabled ? 1 : 0,
        create_at: Math.floor(new Date(modalData.create_at).getTime() / 1000),
      },
    });
  };

  const updateNews = async () => {
    await axios.put(
      `${baseURL}/v2/api/${apiPath}/admin/article/${modalData.id}`,
      {
        data: {
          ...modalData,
          is_enabled: modalData.is_enabled ? 1 : 0,
          create_at: Math.floor(new Date(modalData.create_at).getTime() / 1000),
        },
      }
    );
  };

  useEffect(() => {
    if (modalRef.current) {
      modalInstanceRef.current = new Modal(modalRef.current, {
        backdrop: false,
      });
      modalRef.current.addEventListener('hidden.bs.modal', () => {
        setIsOpen(false);
        document.activeElement.blur();
      });
    }
    return () => {
      modalRef.current?.removeEventListener('hidden.bs.modal', () => {});
    };
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
      ...(tempNews || {
        title: '',
        imageUrl: '',
        content: '',
        is_enabled: 0,
        create_at: new Date().toISOString().split('T')[0], // 預設為今日
      }),
    });
  }, [tempNews]);

  return (
    <div
      id='newsModal'
      className='modal backend-modal fade'
      ref={modalRef}
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
    >
      <div className='modal-dialog modal-dialog-centered modal-lg'>
        <div className='modal-content'>
          <div className='modal-header backend-modal__header border-bottom'>
            <h5 className='modal-title fw-bold fs-4'>
              {modalMode === 'create'
                ? '新增最新消息'
                : `編輯 - ${modalData.title}`}
            </h5>
            <button
              type='button'
              className='btn-close'
              onClick={() => setIsOpen(false)}
            ></button>
          </div>

          <div className='modal-body p-4'>
            <div className='mb-3'>
              <label className='form-label'>標題</label>
              <input
                type='text'
                name='title'
                className='form-control'
                value={modalData.title}
                onChange={handleInputChange}
              />
            </div>
            <div className='mb-3'>
              <label className='form-label'>圖片連結</label>
              <input
                type='text'
                name='imageUrl'
                className='form-control'
                value={modalData.imageUrl}
                onChange={handleInputChange}
              />
              {modalData.imageUrl && (
                <img
                  src={modalData.imageUrl}
                  className='img-fluid mt-2'
                  alt='預覽圖'
                />
              )}
            </div>
            <div className='mb-3'>
              <label className='form-label'>內文</label>
              <textarea
                name='content'
                rows='5'
                className='form-control'
                value={modalData.content}
                onChange={handleInputChange}
              ></textarea>
            </div>
            <div className='mb-3'>
              <label className='form-label'>發佈日期</label>
              <input
                type='date'
                name='create_at'
                className='form-control'
                value={modalData.create_at}
                onChange={handleInputChange}
              />
            </div>
            <div className='form-check'>
              <input
                type='checkbox'
                name='is_enabled'
                className='form-check-input'
                checked={Boolean(modalData.is_enabled)}
                onChange={handleInputChange}
              />
              <label className='form-check-label'>是否啟用</label>
            </div>
          </div>

          <div className='modal-footer backend-modal__footer border-top bg-light'>
            <button
              type='button'
              className='btn btn-primary'
              onClick={handleSubmit}
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
              className='btn btn-secondary'
              onClick={() => setIsOpen(false)}
            >
              取消
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
