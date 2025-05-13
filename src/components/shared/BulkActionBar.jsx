// components/shared/BulkActionBar.jsx
export default function BulkActionBar({
  selectedIds = [],
  onDelete,
  onEnable,
  onDisable,
}) {
  return (
    <div className='bulk-bar'>
      <span className='me-3'>
        已選取 <strong>{selectedIds.length}</strong> 筆資料
      </span>
      <button
        className='btn btn-outline-danger btn-sm'
        disabled={selectedIds.length === 0}
        onClick={onDelete}
      >
        批次刪除
      </button>
      <button
        className='btn btn-outline-secondary btn-sm'
        disabled={selectedIds.length === 0}
        onClick={onDisable}
      >
        批次停用
      </button>
      <button
        className='btn btn-outline-success btn-sm'
        disabled={selectedIds.length === 0}
        onClick={onEnable}
      >
        批次啟用
      </button>
    </div>
  );
}
