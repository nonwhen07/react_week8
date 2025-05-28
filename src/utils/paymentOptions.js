// paymentOptions.js
export const paymentOptions = [
  {
    value: '現金支付',
    label: '現金支付',
    extraFields: [],
  },
  {
    value: 'Apple Pay',
    label: 'Apple Pay',
    extraFields: [
      {
        name: 'cardNumber',
        label: '信用卡號',
        type: 'text',
        placeholder: '16 位數字，不含空格',
        validation: {
          required: '請填寫信用卡號',
          pattern: {
            value: /^\d{16}$/,
            message: '信用卡號需為 16 位數字',
          },
        },
      },
      {
        name: 'expiry',
        label: '有效期限',
        type: 'text',
        placeholder: 'MM/YY',
        validation: {
          required: '請填寫有效期限',
          pattern: {
            // 簡易 mm/yy
            value: /^(0[1-9]|1[0-2])\/\d{2}$/,
            message: '格式需為 MM/YY',
          },
        },
      },
      {
        name: 'cvc',
        label: 'CVC',
        type: 'text',
        placeholder: '3 位數',
        validation: {
          required: '請填寫 CVC',
          pattern: {
            value: /^\d{3}$/,
            message: 'CVC 為 3 位數字',
          },
        },
      },
    ],
  },
  {
    value: 'Line Pay',
    label: 'Line Pay',
    extraFields: [
      {
        name: 'linePhone',
        label: 'Line Pay 電話',
        type: 'tel',
        placeholder: '09xxxxxxxx',
        validation: {
          required: '請填寫電話',
          pattern: {
            value: /^09\d{8}$/,
            message: '請填 09 開頭共 10 碼',
          },
        },
      },
    ],
  },
];
