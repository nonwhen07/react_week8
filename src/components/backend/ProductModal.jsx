import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { pushMessage } from '../../redux/toastSlice';
import { Modal } from 'bootstrap';
import ReactLoading from 'react-loading';
import axios from 'axios';

export default function ProductModal({
  modalMode,
  tempProduct,
  getProducts,
  isOpen,
  setIsOpen,
}) {
  // 環境變數
  const baseURL = import.meta.env.VITE_BASE_URL;
  const apiPath = import.meta.env.VITE_API_PATH;

  // dispatch 是用來發送 actions 到 Redux store 的，讓我們可以修改 store 的狀態。
  const dispatch = useDispatch();

  //拷貝 tempProduct 資料來轉換成 modalData來顯示
  const [modalData, setModalData] = useState(tempProduct);

  // Modal Ref 定義
  const productModalRef = useRef(null);
  const modalInstanceRef = useRef(null); // 保存 Modal 實例

  // 設置loading狀態
  const [isLoading, setIsLoading] = useState(false);

  // Modal表單-變更事件
  const handleModalInputChange = e => {
    // Modal 表單變更事件
    const { name, value, checked, type } = e.target;
    setModalData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value, //透過type判斷是否為checkbox，綁定 checkbox 的勾選狀態時，應透過 checked 屬性，而非 value
    }));
  };
  const handleImageChange = (e, index) => {
    // 副圖表單變更事件
    const { value } = e.target;
    const newImageUrl = [...modalData.imagesUrl]; // 複製一份原本的副圖陣列
    newImageUrl[index] = value; // 找出要修改的陣列index，進行修改
    setModalData(prev => ({
      ...prev,
      imagesUrl: newImageUrl,
    }));
  };
  // Modal表單 - 新增、刪除副圖
  const handleAddImage = () => {
    const newImagesUrl = [...modalData.imagesUrl, '']; // 複製一份原本的副圖陣列
    setModalData(prev => ({
      ...prev,
      imagesUrl: newImagesUrl,
    }));
  };
  const handleDeleteImage = () => {
    const newImagesUrl = [...modalData.imagesUrl]; // 複製一份原本的副圖陣列
    newImagesUrl.pop(); // 移除最後一筆
    setModalData(prev => ({
      ...prev,
      imagesUrl: newImagesUrl,
    }));
  };
  // Modal表單 - 主圖上傳
  const handleFileChange = async e => {
    const file = e.target.files[0];
    const formData = new FormData(); // 先確認後端api接收檔案時，所使用 FormData 格式。 enctype="multipart/form-data"
    formData.append('file-to-upload', file); // file-to-upload 也是先確認後端api接收檔案的 key
    try {
      const res = await axios.post(
        `${baseURL}/v2/api/${apiPath}/admin/upload`,
        formData
      );
      const imgUploadUrl = res.data.imageUrl;
      console.log(imgUploadUrl);
      setModalData(prev => ({
        ...prev,
        imageUrl: imgUploadUrl,
      }));
    } catch (error) {
      const rawMessage = error.response?.data?.message;
      const errorMessage = Array.isArray(rawMessage)
        ? rawMessage.join('、')
        : rawMessage || '發生錯誤，請稍後再試';
      dispatch(pushMessage({ text: errorMessage, status: 'failed' }));
    }
  };

  // 新增、編輯、刪除產品動點 => 調整成由 handleUpdateProduct 來顯示 dispatch 模式和訊息
  const handleUpdateProduct = async () => {
    setIsLoading(true);
    const apiCall = modalMode === 'create' ? createProduct : updateProduct;
    try {
      await apiCall(); // 呼叫對應的 createProduct 或 updateProduct
      getProducts(); // 更新完畢後，驅動外部頁面重新查詢資料
      handleCloseProductModal();
      dispatch(
        pushMessage({
          text: `${modalMode === 'create' ? '新增' : '編輯'}產品成功`,
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
  // 新增
  const createProduct = async () => {
    await axios.post(`${baseURL}/v2/api/${apiPath}/admin/product`, {
      data: {
        ...modalData,
        origin_price: Number(modalData.origin_price),
        price: Number(modalData.price),
        is_enabled: modalData.is_enabled ? 1 : 0,
      },
    });
  };
  // 編輯
  const updateProduct = async () => {
    await axios.put(
      `${baseURL}/v2/api/${apiPath}/admin/product/${modalData.id}`,
      {
        data: {
          ...modalData,
          origin_price: Number(modalData.origin_price),
          price: Number(modalData.price),
          is_enabled: modalData.is_enabled ? 1 : 0,
        },
      }
    );
  };

  // Modal 開關控制
  const handleCloseProductModal = () => {
    setIsOpen(false);
  };

  //初始化 Modal
  useEffect(() => {
    if (productModalRef.current) {
      // new Modal(productModalRef.current, { backdrop: false });
      modalInstanceRef.current = new Modal(productModalRef.current, {
        backdrop: false,
      });
    }
    //以下幾行處理 綁定 Modal hide 事件（當 Modal 被 ESC 關閉，或點 backdrop 關閉）
    const handleHidden = () => {
      setIsOpen(false); // 同步更新 React 狀態

      // 你在關閉 ProductModal 時，Bootstrap 自動加上 aria-hidden="true"，但 Modal 裡面的按鈕還有焦點。
      // React、Bootstrap 在執行 .hide() 或切換 Modal 狀態時出現 焦點未移除，就會出現這個警告。
      document.activeElement.blur(); // 在 Modal 關閉時，把焦點移走（如移到 body），讓 ARIA 不衝突。
    };
    const refCurrent = productModalRef.current;
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

  // 當外部 tempProduct 有異動時，更新modalData
  useEffect(() => {
    setModalData({
      ...(tempProduct || {
        imageUrl: '',
        title: '',
        category: '',
        unit: '',
        origin_price: 0,
        price: 0,
        description: '',
        content: '',
        is_enabled: 0,
        imagesUrl: [''],
      }),
    });
  }, [tempProduct]);

  return (
    <div
      id='productModal'
      ref={productModalRef}
      className='modal'
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
    >
      <div className='modal-dialog modal-dialog-centered modal-xl'>
        <div className='modal-content border-0 shadow'>
          <div className='modal-header border-bottom'>
            <h5 className='modal-title fs-4'>
              {modalMode === 'create'
                ? '新增產品'
                : '編輯 - ' + modalData.title}
            </h5>
            <button
              type='button'
              onClick={handleCloseProductModal}
              className='btn-close'
              aria-label='Close'
            ></button>
          </div>

          <div className='modal-body p-4'>
            <div className='row g-4'>
              <div className='col-md-4'>
                <div className='mb-5'>
                  <label htmlFor='fileInput' className='form-label'>
                    {' '}
                    圖片上傳 僅限使用 jpg、jpeg 與 png 格式，檔案大小限制為 3MB
                    以下。
                  </label>
                  <input
                    onChange={handleFileChange}
                    type='file'
                    accept='.jpg,.jpeg,.png'
                    className='form-control'
                    id='fileInput'
                  />
                </div>
                <div className='mb-4'>
                  <label htmlFor='primary-image' className='form-label'>
                    主圖
                  </label>
                  <div className='input-group'>
                    <input
                      value={modalData.imageUrl}
                      onChange={handleModalInputChange}
                      name='imageUrl'
                      type='text'
                      id='primary-image'
                      className='form-control'
                      placeholder='請輸入圖片連結'
                    />
                  </div>
                  <img
                    src={modalData.imageUrl || null}
                    alt=''
                    className='img-fluid'
                  />
                </div>

                {/* 副圖 */}
                <div className='border border-2 border-dashed rounded-3 p-3'>
                  {modalData.imagesUrl?.map((image, index) => (
                    <div key={index} className='mb-2'>
                      <label
                        htmlFor={`imagesUrl-${index + 1}`}
                        className='form-label'
                      >
                        副圖 {index + 1}
                      </label>
                      <input
                        id={`imagesUrl-${index + 1}`}
                        value={image}
                        onChange={e => {
                          handleImageChange(e, index);
                        }}
                        type='text'
                        placeholder={`圖片網址 ${index + 1}`}
                        className='form-control mb-2'
                      />
                      {image && (
                        <img
                          src={image || null}
                          alt={`副圖 ${index + 1}`}
                          className='img-fluid mb-2'
                        />
                      )}
                    </div>
                  ))}
                </div>
                <div className='btn-group w-100'>
                  {modalData.imagesUrl.length < 5 &&
                    modalData.imagesUrl[modalData.imagesUrl.length - 1] !==
                      '' && (
                      <button
                        onClick={handleAddImage}
                        className='btn btn-outline-primary btn-sm w-100'
                      >
                        新增圖片
                      </button>
                    )}
                  {modalData.imagesUrl.length > 1 && (
                    <button
                      onClick={handleDeleteImage}
                      className='btn btn-outline-danger btn-sm w-100'
                    >
                      刪除圖片
                    </button>
                  )}
                </div>
              </div>

              <div className='col-md-8'>
                <div className='mb-3'>
                  <label htmlFor='title' className='form-label'>
                    標題
                  </label>
                  <input
                    value={modalData.title}
                    onChange={handleModalInputChange}
                    name='title'
                    id='title'
                    type='text'
                    className='form-control'
                    placeholder='請輸入標題'
                  />
                </div>

                <div className='mb-3'>
                  <label htmlFor='category' className='form-label'>
                    分類
                  </label>
                  <input
                    value={modalData.category}
                    onChange={handleModalInputChange}
                    name='category'
                    id='category'
                    type='text'
                    className='form-control'
                    placeholder='請輸入分類'
                  />
                </div>

                <div className='mb-3'>
                  <label htmlFor='unit' className='form-label'>
                    單位
                  </label>
                  <input
                    value={modalData.unit}
                    onChange={handleModalInputChange}
                    name='unit'
                    id='unit'
                    type='text'
                    className='form-control'
                    placeholder='請輸入單位'
                  />
                </div>

                <div className='row g-3 mb-3'>
                  <div className='col-6'>
                    <label htmlFor='origin_price' className='form-label'>
                      原價
                    </label>
                    <input
                      value={modalData.origin_price}
                      onChange={handleModalInputChange}
                      name='origin_price'
                      id='origin_price'
                      type='number'
                      className='form-control'
                      placeholder='請輸入原價'
                    />
                  </div>
                  <div className='col-6'>
                    <label htmlFor='price' className='form-label'>
                      售價
                    </label>
                    <input
                      value={modalData.price}
                      onChange={handleModalInputChange}
                      name='price'
                      id='price'
                      type='number'
                      className='form-control'
                      placeholder='請輸入售價'
                    />
                  </div>
                </div>

                <div className='mb-3'>
                  <label htmlFor='description' className='form-label'>
                    產品描述
                  </label>
                  <textarea
                    value={modalData.description}
                    onChange={handleModalInputChange}
                    name='description'
                    id='description'
                    className='form-control'
                    rows={4}
                    placeholder='請輸入產品描述'
                  ></textarea>
                </div>

                <div className='mb-3'>
                  <label htmlFor='content' className='form-label'>
                    說明內容
                  </label>
                  <textarea
                    value={modalData.content}
                    onChange={handleModalInputChange}
                    name='content'
                    id='content'
                    className='form-control'
                    rows={4}
                    placeholder='請輸入說明內容'
                  ></textarea>
                </div>

                <div className='form-check'>
                  <input
                    checked={Boolean(modalData.is_enabled)}
                    onChange={handleModalInputChange}
                    name='is_enabled'
                    type='checkbox'
                    className='form-check-input'
                    id='isEnabled'
                  />
                  <label className='form-check-label' htmlFor='isEnabled'>
                    是否啟用
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className='modal-footer border-top bg-light'>
            <button
              type='button'
              onClick={handleUpdateProduct}
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
              onClick={handleCloseProductModal}
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
