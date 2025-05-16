import Papa from 'papaparse';

/**
 * 匯出資料為 CSV 或 JSON 格式，並觸發下載
 * @param {Array} data - 要匯出的資料
 * @param {String} format - 匯出格式：'csv' 或 'json'
 * @param {String} filename - 匯出的檔名（不含副檔名）
 */
export const exportData = (data, format = 'csv', filename = 'export') => {
  let content = '';
  let mimeType = '';

  if (format === 'csv') {
    content = Papa.unparse(data);
    mimeType = 'text/csv;charset=utf-8;';
  } else {
    content = JSON.stringify(data, null, 2);
    mimeType = 'application/json';
  }

  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${filename}.${format}`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * 解析上傳檔案（CSV / JSON），回傳資料陣列
 * @param {File} file - 上傳的檔案物件
 * @param {String} format - 格式：csv 或 json
 * @returns {Promise<Array>} 回傳解析後的資料陣列
 */
export const importData = (file, format = 'csv') => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = e => {
      try {
        if (format === 'csv') {
          const result = Papa.parse(e.target.result, {
            header: true,
            skipEmptyLines: true,
          });
          if (result.errors.length > 0) {
            return reject(
              new Error(`CSV 格式錯誤：第 ${result.errors[0].row + 1} 列`)
            );
          }
          return resolve(result.data);
        } else {
          const jsonData = JSON.parse(e.target.result);
          return resolve(jsonData);
        }
      } catch (err) {
        reject(err);
      }
    };

    reader.onerror = () => {
      reject(new Error('檔案讀取失敗'));
    };

    reader.readAsText(file);
  });
};
