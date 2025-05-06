// 分類、字串拆解

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
