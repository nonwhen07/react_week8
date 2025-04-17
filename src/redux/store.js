import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import toastReducer from './toastSlice';
import cartReducer from './cartSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    toast: toastReducer,
    cart: cartReducer,
  },
});

export default store;
