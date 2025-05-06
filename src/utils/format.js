// 處理各種js格式化;

// 格式化價格（數字或字串），錯誤回傳「無價格」
export const formatPrice = price => {
  const num = Number(price);
  return !isNaN(num) ? num.toLocaleString() : '無價格';
};

// 格式化純數字（不加單位，回傳千分位）
export const formatNumber = value => {
  const num = Number(value);
  return !isNaN(num) ? num.toLocaleString() : '無數值';
};

// 格式化日期（yyyy/mm/dd）
export const formatDate = dateInput => {
  const date = new Date(dateInput);
  if (isNaN(date)) return '無日期';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份從0開始
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}/${month}/${day}`;
};

// 格式化日期時間（yyyy/mm/dd hh:mm）
export const formatDateTime = dateInput => {
  const date = new Date(dateInput * 1000); // 假設 dateInput 是以秒為單位的時間戳記
  if (isNaN(date)) return '無日期時間';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');
  return `${year}/${month}/${day} ${hour}:${minute}`;
};
