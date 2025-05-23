import { createSlice } from '@reduxjs/toolkit';
import { act } from 'react';

const initialState = {
  user: null, 
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    signIn: (state, action) => {
      state.user = action.payload;
    },
    signOut: (state) => {
      state.user = null;
    },
    updateUserName(state, action) {
      if (state.user) {
        state.user.name = action.payload;
      }
    },
  },
});

export const { signIn, signOut, updateUserName } = userSlice.actions;
export const selectCurrentUser = (state) => state.user.user;
export default userSlice.reducer;
