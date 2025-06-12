import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Toast as BSToast } from 'bootstrap'; //由於bootstrap的Toast與套件名稱衝突，所以把bootstrap的Toast取個別名為 'BSToast'
import { removeMessage } from '@/redux/toastSlice';

// import '../styles/components/_toast.scss';

export default function Toast() {
  // dispatch 是用來發送 actions 到 Redux store 的，讓我們可以修改 store 的狀態。
  const dispatch = useDispatch();
  const messages = useSelector(state => state.toast.messages);
  const toastRef = useRef({});
  const TOAST_DURATION = 2000;

  useEffect(() => {
    messages.forEach(message => {
      const messageElement = toastRef.current[message.id];

      if (messageElement) {
        const toastInstance = new BSToast(messageElement);
        toastInstance.show();

        // 確保每個訊息有自己的定時器
        const timer = setTimeout(() => {
          dispatch(removeMessage(message.id));
        }, TOAST_DURATION);

        // 清理定時器，防止多次執行
        return () => clearTimeout(timer);
      }
    });
  }, [messages, dispatch]); // 將 dispatch 加入依賴陣列

  const handleDismiss = message_id => {
    dispatch(removeMessage(message_id));
  };

  return (
    <>
      <div className='position-fixed top-0 end-0 p-3' style={{ zIndex: 1056 }}>
        {messages.map(message => (
          <div
            key={message.id}
            ref={el => (toastRef.current[message.id] = el)}
            className='toast'
            role='alert'
            aria-live='assertive'
            aria-atomic='true'
          >
            {/* <div
              className={`toast-header text-white ${
                message.status === 'success' ? 'bg-success' : 'bg-danger'
              }`}
            > */}
            <div
              className={`toast-header text-white ${
                message.status === 'success' ? 'toast-success' : 'toast-failed'
              }`}
            >
              <strong className='me-auto'>
                {message.status === 'success' ? '成功' : '失敗'}
              </strong>
              <button
                onClick={() => handleDismiss(message.id)}
                type='button'
                className='btn-close'
                aria-label='Close'
              ></button>
            </div>
            <div className='toast-body'>{message.text}</div>
          </div>
        ))}
      </div>
    </>
  );
}
