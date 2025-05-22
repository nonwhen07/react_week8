import { useRef } from 'react';
import PropTypes from 'prop-types';

export default function DataTransferPanel({
  typeMode = 'default', // 可為 'coupon' | 'product' | 'order' | 'news'
  fileFormat,
  setFileFormat,
  onExport,
  onImport = () => {}, // 預設為空函式，避免 order 類型報錯
}) {
  const fileInputRef = useRef(null);

  // 根據 typeMode 自動決定區塊標題與備註說明
  const typeSettings = {
    coupon: {
      title: '📁 匯入 / 匯出優惠券資料',
      notes: [
        '📤 匯出：可選擇 CSV（表格）或 JSON（結構）格式',
        '📥 匯入：請使用對應格式（CSV / JSON）上傳資料',
        '上傳資料將逐筆新增優惠券，請勿重複',
        '建議單次匯入不超過 100 筆，避免錯誤與延遲',
      ],
      showFormat: true,
      showImport: true,
    },
    product: {
      title: '📦 產品資料批次處理',
      notes: [
        '📤 可將產品清單匯出為 CSV / JSON 格式',
        '📥 支援批次上傳產品資訊（尚需符合欄位格式）',
      ],
      showFormat: true,
      showImport: true,
    },
    order: {
      title: '📑 訂單資料匯出',
      notes: [
        '📤 僅支援訂單資料匯出，格式為報表型 CSV / JSON 結構',
        '⛔ 匯入功能不適用訂單頁面',
      ],
      showFormat: true,
      showImport: false,
    },
    news: {
      title: '📰 消息資料處理（可選）',
      notes: [
        '📤 匯出消息清單資料',
        '📥 匯入功能僅建議用於大量草稿建立或搬遷使用',
      ],
      showFormat: true,
      showImport: true,
    },
    default: {
      title: '匯入 / 匯出資料',
      notes: [],
      showFormat: true,
      showImport: true,
    },
  };

  const { title, notes, showFormat, showImport } =
    typeSettings[typeMode] || typeSettings.default;

  return (
    <div className='card mt-4'>
      <div className='card-header bg-light d-flex justify-content-between align-items-center'>
        <h5 className='mb-0'>{title}</h5>
        <div className='d-flex align-items-center'>
          {showFormat && (
            <>
              <label htmlFor='fileFormat' className='me-2 mb-0'>
                格式：
              </label>
              <select
                id='fileFormat'
                className='form-select form-select-sm me-2'
                style={{ width: '100px' }}
                value={fileFormat}
                onChange={e => setFileFormat(e.target.value)}
              >
                <option value='csv'>CSV</option>
                <option value='json'>JSON</option>
              </select>
            </>
          )}

          <button
            className='btn btn-outline-primary btn-sm me-2'
            onClick={onExport}
          >
            匯出資料
          </button>

          {showImport && (
            <>
              <button
                className='btn btn-outline-success btn-sm'
                onClick={() => fileInputRef.current.click()}
              >
                匯入資料
              </button>
              <input
                type='file'
                accept={fileFormat === 'csv' ? '.csv' : '.json'}
                className='d-none'
                ref={fileInputRef}
                onChange={onImport}
              />
            </>
          )}
        </div>
      </div>

      {notes.length > 0 && (
        <div className='card-body text-muted small'>
          <ul className='mb-0'>
            {notes.map((note, index) => (
              <li key={index}>{note}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

DataTransferPanel.propTypes = {
  typeMode: PropTypes.string,
  fileFormat: PropTypes.string.isRequired,
  setFileFormat: PropTypes.func.isRequired,
  onExport: PropTypes.func.isRequired,
  onImport: PropTypes.func, // 改為非 required
};
