import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  messages: [],
};

const toastSlice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    pushMessage(state, action) {
      const { text, status } = action.payload;
      const id = Date.now();
      state.messages.push({
        id,
        text,
        status,
      });
    },
    removeMessage(state, action) {
      const message_id = action.payload;
      const index = state.messages.findIndex(
        message => message.id === message_id
      );

      if (index !== -1) {
        state.messages.splice(index, 1);
      }
    },
  },
});

// 用 actions 將設定好的方法匯出
export const { pushMessage, removeMessage } = toastSlice.actions;

export default toastSlice.reducer;
