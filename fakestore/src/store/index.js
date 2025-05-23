// src/store/index.js
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import  userReducer from './userSlice';
import orderReducer from './orderSlice'

const store = configureStore({
  reducer: {
    cart: cartReducer,
    user: userReducer,
    order: orderReducer,
  },
});

export default store;
