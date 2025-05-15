import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@/store/store';

// 状态类型
export interface userState {
  id: number | null ,
  nickname: string,
  avatar: string,
};

// 定义初始状态
const initialState:userState = {
  id: null,
  nickname: '',
  avatar: '',
};

export const userSlice = createSlice({
  name: 'user',
  // 引入初始状态
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<userState>) => {
      state.id = action.payload.id
      state.nickname = action.payload.nickname
      state.avatar = action.payload.avatar
    },
  }
});

export const { setUser } = userSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectUser = (state: RootState) => state.user;

export default userSlice.reducer;