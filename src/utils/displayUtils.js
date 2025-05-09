//共用modal透過動態資訊 用文字標籤生成邏輯

//根據api類型與資料，取得標題文字
export function getTitleText(apiType, modalData) {
  const typeName = (() => {
    switch (apiType) {
      case 'order':
        return '訂單';
      case 'product':
        return '產品';
      case 'coupon':
        return '優惠券';
      case 'news':
        return '最新消息';
      default:
        return '資料';
    }
  })();

  const itemLabel =
    modalData.id || modalData.title || modalData.user?.name || '這筆資料';

  return { typeName, itemLabel };
}
