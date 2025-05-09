// import { useEffect } from 'react';
// import axios from 'axios';

export default function Pagination({
  pageInfo,
  handlePageChange,
  pageSize = 10,
}) {
  // const baseURL = import.meta.env.VITE_BASE_URL;
  // const apiPath = import.meta.env.VITE_API_PATH;

  const total = pageInfo.total ?? 0;
  // const startIndex = ((pageInfo.current_page ?? 1) - 1) * pageSize;
  // const endIndex = Math.min(startIndex + pageSize, total);
  const currentPage = Number(pageInfo.current_page ?? 1);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, total);
  return (
    <div className='d-flex flex-column align-items-center gap-2 mt-4'>
      <nav>
        <ul className='pagination mb-0'>
          <li className={`page-item ${!pageInfo.has_pre && 'disabled'}`}>
            <button
              type='button'
              onClick={() => handlePageChange(pageInfo.current_page - 1)}
              className={`page-link ${
                pageInfo.total_pages === 1 ? 'd-none' : ''
              }`}
            >
              上一頁
            </button>
          </li>
          {Array.from({ length: pageInfo.total_pages }).map((_, index) => (
            <li
              key={index}
              className={`page-item ${
                pageInfo.current_page === index + 1 ? 'active' : ''
              }`}
            >
              <button
                type='button'
                onClick={() => handlePageChange(index + 1)}
                className='page-link'
              >
                {index + 1}
              </button>
            </li>
          ))}
          <li className={`page-item ${!pageInfo.has_next && 'disabled'}`}>
            <button
              type='button'
              onClick={() => handlePageChange(pageInfo.current_page + 1)}
              className={`page-link ${
                pageInfo.total_pages === 1 ? 'd-none' : ''
              }`}
            >
              下一頁
            </button>
          </li>
        </ul>
      </nav>
      <p className='text-muted small mb-0'>
        顯示第 {startIndex + 1} - {endIndex} 筆，共 {total} 筆
      </p>
    </div>
  );
}
