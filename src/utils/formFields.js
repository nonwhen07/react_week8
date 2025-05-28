// src/utils/formFields.js
export const formFields = [
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    placeholder: 'example@gmail.com',
    validation: {
      required: 'Email 欄位必填',
      pattern: {
        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        message: 'Email 格式錯誤',
      },
    },
  },
  {
    name: 'name',
    label: 'Name',
    type: 'text',
    placeholder: 'Carmen A. Rose',
    validation: { required: '姓名 欄位必填' },
  },
  {
    name: 'tel',
    label: 'Phone',
    type: 'text',
    placeholder: '0955xxxxxx',
    validation: {
      required: '電話 欄位必填',
      pattern: {
        value: /^(0[2-8]\d{7}|09\d{8})$/,
        message: '電話 格式錯誤',
      },
    },
  },
  {
    name: 'address',
    label: 'Address',
    type: 'text',
    placeholder: 'Your address',
    validation: { required: '地址 欄位必填' },
  },
  {
    name: 'message',
    label: 'Message',
    type: 'textarea',
    placeholder: 'message ...',
    validation: {}, // 選填
  },
];
