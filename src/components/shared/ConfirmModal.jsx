import { useEffect, useRef } from 'react';
// import { useDispatch } from 'react-redux';
import { Modal } from 'bootstrap';
// import axios from 'axios';
import ReactLoading from 'react-loading';

// import { pushMessage } from '../../redux/toastSlice';
// import { getTitleText } from '../../utils/displayUtils';

export default function ConfirmModal({ title, onConfirm, isOpen, setIsOpen }) {
  const modalRef = useRef(null);
  const modalInstanceRef = useRef(null);

  // const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (modalRef.current) {
      modalInstanceRef.current = new Modal(modalRef.current, {
        backdrop: false,
      });
    }

    const handleHidden = () => {
      setIsOpen(false);
      document.activeElement.blur();
    };

    const refCurrent = modalRef.current;
    refCurrent.addEventListener('hidden.bs.modal', handleHidden);

    return () => {
      refCurrent.removeEventListener('hidden.bs.modal', handleHidden);
    };
  }, []);

  useEffect(() => {
    const modalInstance = modalInstanceRef.current;
    if (!modalInstance) return;
    isOpen ? modalInstance.show() : modalInstance.hide();
  }, [isOpen]);

  return (
    <div
      className='modal backend-closeModal fade'
      tabIndex='-1'
      ref={modalRef}
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
    >
      <div className='modal-dialog'>
        <div className='modal-content'>
          <div className='modal-header backend-closeModal__header bg-danger text-white'>
            <h5 className='modal-title'>批次操作確認</h5>
            <button
              className='btn-close'
              data-bs-dismiss='modal'
              aria-label='Close'
              onClick={() => setIsOpen(false)}
            ></button>
          </div>
          <div className='modal-body'>
            <p className='mb-0'>{title}</p>
          </div>
          <div className='modal-footer'>
            <button className='btn btn-danger' onClick={onConfirm}>
              確定刪除
            </button>
            <button
              className='btn btn-outline-secondary'
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
