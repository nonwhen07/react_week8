// import { Link } from "react-router-dom"

export default function Pagination({ pageInfo, handlePageChange }) {
  return (
    <div className='d-flex justify-content-center'>
      <nav className={`${pageInfo.total_pages === 1 ? 'd-none' : ''}`}>
        <ul className='pagination'>
          <li className={`page-item ${!pageInfo.has_pre && 'disabled'}`}>
            {/* <a href="#" className="page-link"
              onClick={(e) => {
                e.preventDefault(); // 阻止跳回 `/`
                handlePageChange(pageInfo.current_page - 1);
              }}
              
            >
              上一頁
            </a> */}

            <button
              type='button'
              onClick={() => handlePageChange(pageInfo.current_page - 1)}
              className='page-link'
            >
              上一頁
            </button>
            {/* <Link to={`?page=${pageInfo.current_page - 1}`} className="page-link">
              上一頁
            </Link>
            <button
              onClick={() => handlePageChange(pageInfo.current_page - 1)}
              className="page-link"
              disabled={!pageInfo.has_pre}
            >
              上一頁
            </button> */}
          </li>
          {Array.from({ length: pageInfo.total_pages }).map((_, index) => (
            <li
              key={index}
              className={`pageitem ${
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
              className='page-link'
            >
              下一頁
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}
