import { useRef } from 'react';
import PropTypes from 'prop-types';

export default function ImportExportBox({
  title = '匯入 / 匯出資料',
  fileFormat,
  setFileFormat,
  onExport,
  onImport,
  notes = [],
}) {
  const fileInputRef = useRef(null);

  return (
    <section className='mt-4'>
      <div className='card mt-4'>
        <div className='card-header bg-light d-flex justify-content-between align-items-center'>
          <h5 className='mb-0'>{title}</h5>
          <div className='d-flex align-items-center'>
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

            <button
              className='btn btn-outline-primary btn-sm me-2'
              onClick={onExport}
            >
              匯出資料
            </button>

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
    </section>
  );
}

ImportExportBox.propTypes = {
  title: PropTypes.string,
  fileFormat: PropTypes.string.isRequired,
  setFileFormat: PropTypes.func.isRequired,
  onExport: PropTypes.func.isRequired,
  onImport: PropTypes.func.isRequired,
  notes: PropTypes.arrayOf(PropTypes.string),
};
