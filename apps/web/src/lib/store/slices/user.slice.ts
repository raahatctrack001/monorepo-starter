import { IUser, UserSliceStateSchema } from '@/types/user/user.types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: UserSliceStateSchema = {
  currentUser: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logInSuccess: (state, action: PayloadAction<IUser>) => {
      state.currentUser = action.payload;
    },
    logOutSuccess: (state) => {
      state.currentUser = null;
    },
    updateSuccess: (state, action: PayloadAction<IUser>) => {
      state.currentUser = action.payload;
    },
    deleteUserSuccess: (state) => {
      state.currentUser = null;
    },
  },
});

export const {
  logInSuccess,  
  updateSuccess,
  deleteUserSuccess,
  logOutSuccess,
} = userSlice.actions;

export default userSlice.reducer;