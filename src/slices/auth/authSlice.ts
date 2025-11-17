import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';

import type {UserInfo} from '../../interface/userInfo';

type AuthState = {
  user: UserInfo | null;
};

// 初期値(ログイン時はnull)
const initialState: AuthState = {
  user: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<UserInfo>) => {
      state.user = action.payload;  // ログイン時にセット
    },
    logout: (state) => {
      state.user = null;  // ログアウト時にクリア
    },
  },
});

export const {login, logout} = authSlice.actions;
export default authSlice.reducer;
