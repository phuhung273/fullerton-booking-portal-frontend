import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from './store'

// Define a type for the slice state
interface AuthState {
  username?: number;
  token?: string;
  role?: IRole;
}

interface IRole {
  name: string;
  permission: Array<IPermission>;
}

interface IPermission {
  name: string;
}

// Define the initial state using that type
const initialState: AuthState = {
  username: undefined,
  token: undefined,
  role: undefined,
}

export const authSlice = createSlice({
  name: 'auth',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    setAuth: (state, action: PayloadAction<AuthState>) => {
      const { username, token, role } = action.payload;
      if(!username || !token || !role) {
        state.username = undefined;
        state.token = undefined;
        state.role = undefined;
        localStorage.removeItem('token');
        return;
      }

      state.username = username;
      state.token = token;
      state.role = role;

      localStorage.setItem('token', token);
    },
    removeAuth: (state) => {
      state.username = undefined;
      state.token = undefined;
      state.role = undefined;
      localStorage.removeItem('token');
    } 
  },
})

export const { setToken, setAuth, removeAuth } = authSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectToken = (state: RootState) => state.auth.token

export default authSlice.reducer