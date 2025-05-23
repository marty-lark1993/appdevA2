import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchOrders = createAsyncThunk(
    'order/fetchOrders',
    async (_, thunkAPI) => {
      const state = thunkAPI.getState();
      const token = state.user.user?.token; 
  
      try {
        console.log('test', token)
        const response = await fetch(`http://192.168.1.112:3000/orders/all`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await response.json();
        return data.orders;
      } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
      }
    }
  );

const initialState = {
  orders: [],
  newOrders: 0,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    incrementNewOrders: (state) => {
      state.newOrders += 1;
    },
    clearNewOrders: (state) => {
      state.newOrders = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
        state.newOrders = action.payload.length; // or filter for "new" ones
        state.status = 'succeeded';
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { incrementNewOrders, clearNewOrders } = orderSlice.actions;
export const selectOrders = (state) => state.order.orders;
export default orderSlice.reducer;