import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@/store/store';
import { getCookie } from 'cookies-next';

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
    initializeUser: (state) => {
      // 从 Cookie 中读取用户信息
      const userCookie = getCookie('user'); // 从 cookies-next 获取 Cookie
      if (userCookie) {
        const user = JSON.parse(userCookie as string); // 解析 JSON
        state.id = user.id;
        state.nickname = user.nickname;
        state.avatar = user.avatar;
      } else {
        // 如果 Cookie 不存在，清空状态
        state.id = null;
        state.nickname = '';
        state.avatar = '';
      }
    },
  }
});

export const { setUser, initializeUser } = userSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectUser = (state: RootState) => state.user;

export default userSlice.reducer;