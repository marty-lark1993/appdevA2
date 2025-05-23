import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { selectCurrentUser } from './userSlice';

const initialState = {
  items: [],
  loading: false,
  error: null,
};


export const uploadCart = createAsyncThunk(
  'cart/uploadCart',
  async (_, { getState }) => {
    console.log('upload cart')
    const state = getState();
    const token = selectCurrentUser(state)?.token;
    const cartItems = state.cart.items.map(({ id, price, quantity, title, image, description }) => ({
      id,
      price,
      count: quantity,
      title,
      image,
      description,
    }));

    const res = await fetch('http://192.168.1.112:3000/cart', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ items: cartItems }),
    });

    if (!res.ok) {
      throw new Error('Failed to upload cart');
    }
    return await res.json();
  }
);


export const loadCart = createAsyncThunk(
  'cart/loadCart',
  async (_, { getState }) => {
    const state = getState();
    console.log('loadcart')
    const token = selectCurrentUser(state)?.token;

    const res = await fetch('http://192.168.1.112:3000/cart', {
      method:'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error('Failed to load cart');
    }

    const data = await res.json();
    return data.items.map(item => ({
      id: item.id,
      price: item.price,
      quantity: item.count,
    }));
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload.id);
    },
    increaseQuantity: (state, action) => {
      const item = state.items.find(item => item.id === action.payload.id);
      if (item) item.quantity += 1;
    },
    decreaseQuantity: (state, action) => {
      const item = state.items.find(item => item.id === action.payload.id);
      if (item && item.quantity > 1) item.quantity -= 1;
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(loadCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const {
  addToCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;

export const selectTotalCartQuantity = (state) =>
  state.cart.items.reduce((total, item) => total + item.quantity, 0);
