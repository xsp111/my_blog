import { configureStore } from '@reduxjs/toolkit'
import { userSlice } from './modules/userStore'
import { paginationSlice } from './modules/paginationStore'
// ...

export const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    page: paginationSlice.reducer
  }
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;