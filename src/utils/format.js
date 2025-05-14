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

// 顯示用格式：timestamp → yyyy/mm/dd hh:mm
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

//來自於 <input type="date"> 對於 value 的格式要求非常嚴格，只接受 yyyy-MM-dd（必須是 ISO 日期格式的字串），而你目前傳進來的是用 formatDateTime() 格式化後的結果，像是：2025/12/04 或 2025/12/04 00:00，這樣會無法正常顯示。新增一個專用格式轉換工具 formatDateInputValue()
export const formatDateInputValue = timestamp => {
  if (!timestamp) return '';
  const date = new Date(timestamp * 1000);
  if (isNaN(date)) return '';
  return date.toISOString().split('T')[0]; // ✅ yyyy-MM-dd
};

// 將 date 格式的字串 → 轉為 Unix timestamp，若無效則回傳 null（yyyy/mm/dd hh:mm 2025/05/03 hh:mm => 1555459200）
// export const toTimestamp = dateInput => {
//   const time = new Date(dateInput).getTime();
//   if (isNaN(time)) return null; // ✅ 改為 null，API 可以判斷
//   return time / 1000;
// };

export const toTimestamp = (dateInput, toSeconds = false) => {
  const time = new Date(dateInput).getTime();
  if (isNaN(time)) return null;
  return toSeconds ? time : Math.floor(time / 1000);
};
