import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import ReactLoading from 'react-loading';

import Pagination from '../../components/Pagination';
import NewsModal from '../../components/backend/NewsModal';
import DeleteModal from '../../components/backend/DeleteModal';
import { checkLogin } from '../../redux/authSlice';
import { pushMessage } from '../../redux/toastSlice';

export default function NewsListPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { status, error } = useSelector(state => state.auth);

  const baseURL = import.meta.env.VITE_BASE_URL;
  const apiPath = import.meta.env.VITE_API_PATH;

  const defaultNews = {
    title: '',
    content: '',
    imageUrl: '',
    is_enabled: 0,
    create_at: new Date().toISOString().split('T')[0],
  };

  const [newsList, setNewsList] = useState([]);
  const [pageInfo, setPageInfo] = useState({});
  const [tempNews, setTempNews] = useState(defaultNews);
  const [modalMode, setModalMode] = useState(null);

  const [isNewsModalOpen, setIsNewsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isScreenLoading, setIsScreenLoading] = useState(false);

  // 登入驗證
  useEffect(() => {
    dispatch(checkLogin());
  }, []);

  useEffect(() => {
    if (status === 'failed') {
      dispatch(pushMessage({ text: error || '請重新登入', status: 'failed' }));
      navigate('/login');
      return;
    }
    if (status === 'succeeded') {
      getNews();
    }
  }, [status]);

  const getNews = async (page = 1) => {
    setIsScreenLoading(true);
    try {
      const res = await axios.get(
        `${baseURL}/v2/api/${apiPath}/admin/articles?page=${page}`
      );
      const articles = res.data.articles;
      setNewsList(articles); // 更新文章列表
      setPageInfo({ ...res.data.pagination, total: articles.length }); // 更新分頁資訊
    } catch (error) {
      const msg = error.response?.data?.message;
      dispatch(
        pushMessage({
          text: Array.isArray(msg) ? msg.join('、') : msg || '取得文章列表失敗',
          status: 'failed',
        })
      );
    } finally {
      setIsScreenLoading(false);
    }
  };

  const handlePageChange = (page = 1) => {
    getNews(page);
  };

  const handleOpenNewsModal = (mode, news = defaultNews) => {
    setModalMode(mode);
    setTempNews(news && Object.keys(news).length > 0 ? news : defaultNews);
    setIsNewsModalOpen(true);
  };

  const handleOpenDeleteModal = (news = defaultNews) => {
    setTempNews(news && Object.keys(news).length > 0 ? news : defaultNews);
    setIsDeleteModalOpen(true);
  };

  return (
    <>
      <div className='container py-5'>
        <div className='d-flex justify-content-between align-items-center'>
          <h2>最新消息列表</h2>
          <button
            className='btn btn-primary'
            onClick={() => handleOpenNewsModal('create')}
          >
            新增消息
          </button>
        </div>

        <table className='table mt-4'>
          <thead>
            <tr>
              <th>標題</th>
              <th>發佈日期</th>
              <th>狀態</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {newsList.map(news => (
              <tr key={news.id}>
                <td>{news.title}</td>
                <td>{new Date(news.create_at * 1000).toLocaleDateString()}</td>
                <td>
                  {news.is_enabled ? (
                    <span className='text-success'>啟用</span>
                  ) : (
                    <span>未啟用</span>
                  )}
                </td>
                <td>
                  <button
                    className='btn btn-sm btn-outline-primary me-2'
                    onClick={() => handleOpenNewsModal('edit', news)}
                  >
                    編輯
                  </button>
                  <button
                    className='btn btn-sm btn-outline-danger'
                    onClick={() => handleOpenDeleteModal(news)}
                  >
                    刪除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Pagination pageInfo={pageInfo} handlePageChange={handlePageChange} />
      </div>

      <NewsModal
        modalMode={modalMode}
        tempNews={tempNews}
        getNews={getNews}
        isOpen={isNewsModalOpen}
        setIsOpen={setIsNewsModalOpen}
      />

      <DeleteModal
        apiType='news'
        modalData={tempNews}
        onRefetch={getNews}
        isOpen={isDeleteModalOpen}
        setIsOpen={setIsDeleteModalOpen}
      />

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
