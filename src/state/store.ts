import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice';
import appReducer from './appSlice';

const store = configureStore({
  reducer: {
    app: appReducer,
    auth: authReducer,
  },
})

export default store;

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch