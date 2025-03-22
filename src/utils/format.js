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
  const date = new Date(dateInput);
  if (isNaN(date)) return '無日期時間';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');
  return `${year}/${month}/${day} ${hour}:${minute}`;
};

/**
 * 將分類字串安全拆分為主分類與副分類
 * @param {string} categoryStr - 產品分類字串，如 '服飾|衣服3'
 * @param {string} delimiter - 分隔符號，預設為 '|'
 * @returns {[string, string]} - [主分類, 副分類]
 * 例如： const [main, sub] = parseCategory('飲品>經典咖啡', '>');
 */
export const parseCategory = (categoryStr, delimiter = '>') => {
  if (typeof categoryStr !== 'string') {
    return ['', '']; // 非字串時，回傳空分類
  }

  if (categoryStr.includes(delimiter)) {
    const [main, sub] = categoryStr.split(delimiter);
    return [main.trim(), sub.trim()];
  } else {
    return [categoryStr.trim(), '']; // 無分隔符，副分類留空
  }
};

export const parseProductCategory = (product, delimiter = '>') => {
  if (!product || typeof product !== 'object') {
    return {}; // 防呆：資料異常時回傳空物件
  }

  const categoryStr = product.category || '';
  const [mainCategory, subCategory] = parseCategory(categoryStr, delimiter);

  return {
    ...product,
    mainCategory,
    subCategory,
  };
};
