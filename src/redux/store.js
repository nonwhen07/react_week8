import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import toastReducer from './toastSlice';
import cartReducer from './cartSlice';

// 🧾 補充筆記：refreshToken 與 getUserInfo 的設計時機（備註）
// 這兩個功能可視後端支援與實際需求再補上，先記下概念與用途：
// 🔁 refreshToken（延長登入狀態）
// 用途：當 access token 過期時，用 refresh token 向後端換一組新的 token，避免使用者被強制登出。
// 條件：
// 後端需提供 refresh token API（如 /v2/auth/refresh-token）
// 前端能安全儲存 refresh token（通常放 HttpOnly cookie）
// 可結合 axios interceptor 進行錯誤攔截、自動續 token
// 適用情境：後台管理系統、需要久留登入的頁面。
// 🙍‍♂️ getUserInfo（取得登入者個資 / 權限）
// 用途：使用 token 查詢目前登入者的資料（如 email、名稱、角色）
// 條件：
// 登入後可取得 token，並在 header 中帶入查詢
// 通常與後台導覽列 / Header 顯示登入人資訊有關
// 適用情境：多使用者系統、多角色管理系統、展示個人資料用

const store = configureStore({
  reducer: {
    auth: authReducer,
    toast: toastReducer,
    cart: cartReducer,
  },
});

export default store;
