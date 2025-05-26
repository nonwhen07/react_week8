// paymentOptions.js
export const paymentOptions = [
  {
    value: '現金支付',
    label: '現金支付',
    extraFields: [], // 現金不需要額外欄位
  },
  {
    value: 'Apple Pay',
    label: 'Apple Pay',
    extraFields: [
      {
        name: 'cardNumber',
        label: '信用卡號',
        type: 'text',
        placeholder: 'XXXX-XXXX-XXXX-XXXX',
        required: true,
      },
      // {
      //   name: 'expiry',
      //   label: '有效期限',
      //   type: 'text',
      //   placeholder: 'MM/YY',
      //   required: true,
      // },
      // {
      //   name: 'cvc',
      //   label: 'CVC',
      //   type: 'text',
      //   placeholder: 'XXX',
      //   required: true,
      // },
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
        placeholder: '09XXXXXXXX',
        required: true,
      },
    ],
  },
];
