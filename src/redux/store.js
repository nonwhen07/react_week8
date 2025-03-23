import { configureStore } from '@reduxjs/toolkit';
import toastReducer from './toastSlice';
import cartReducer from './cartSlice';

const store = configureStore({
  reducer: {
    toast: toastReducer,
    cart: cartReducer,
  },
});

export default store;
