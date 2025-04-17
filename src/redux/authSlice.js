import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// 環境變數
const baseURL = import.meta.env.VITE_BASE_URL;
// const apiPath = import.meta.env.VITE_API_PATH;
const tokenKey = import.meta.env.VITE_TOKEN_KEY;

// 🔄 檢查登入狀態 建立 login 非同步動作
export const login = createAsyncThunk(
  'auth/login',
  async (account, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${baseURL}/v2/admin/signin`, account);
      const { token, expired } = res.data;
      document.cookie = `${tokenKey}=${token}; expires=${new Date(
        expired
      )}; path=/`;
      axios.defaults.headers.common['Authorization'] = token;
      return { token };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || '登入失敗');
    }
  }
);
// 🔄 檢查登入狀態 建立 checkLogin 非同步動作
export const checkLogin = createAsyncThunk(
  'auth/checkLogin',
  async (_, { rejectWithValue }) => {
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)${tokenKey}\s*=\s*([^;]*).*$)|^.*$/,
      '$1'
    );
    axios.defaults.headers.common['Authorization'] = token;

    try {
      // await axios.post(`${import.meta.env.VITE_BASE_URL}/v2/api/user/check`);
      await axios.post(`${baseURL}/v2/api/user/check`);
      return { isLogin: true, token };
    } catch (error) {
      console.error('登入驗證失敗', error);
      return rejectWithValue('未登入或驗證失敗');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isLogin: false,
    token: '',
    status: 'idle',
    error: null,
  },
  reducers: {
    logout(state) {
      state.isLogin = false;
      state.token = '';
      document.cookie = `${tokenKey}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
    },
  },
  // Redux Toolkit 中，非同步邏輯不能直接寫在 reducers 裡面，因為：
  // reducers 只能處理同步邏輯
  // 而 createAsyncThunk() 會產生三種狀態的 action（pending, fulfilled, rejected）
  // 為了處理這些額外的 action，就必須用 extraReducers。

  extraReducers: builder => {
    builder
      .addCase(login.pending, state => {
        state.status = 'loading';
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.token = action.payload.token;
        state.isLogin = true;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
