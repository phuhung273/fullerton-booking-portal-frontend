import { AlertColor } from '@mui/material';
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from './store'

// Define a type for the slice state
interface AppState {
  loading: boolean;
  snackbar: SnackbarState;
}

interface SnackbarState {
  visible: boolean;
  type: AlertColor;
  message: string;
}

const initialSnackbarState: SnackbarState = {
  visible: false,
  type: 'success',
  message: ''
}
// Define the initial state using that type
const initialState: AppState = {
  loading: true,
  snackbar: initialSnackbarState,
}

export const appSlice = createSlice({
  name: 'app',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    showLoading: (state) => {
      state.loading = true;
    },
    hideLoading: (state) => {
      state.loading = false;
    },
    showSuccessSnackBar: (state, action: PayloadAction<string>) => {
      state.snackbar = {
        visible: true,
        type: 'success',
        message: action.payload
      };
    },
    showErrorSnackBar: (state, action: PayloadAction<string>) => {
      state.snackbar = {
        visible: true,
        type: 'error',
        message: action.payload
      };
    },
    hideSnackBar: (state) => {
      state.snackbar = initialSnackbarState
    }
  },
})

export const { 
  showLoading,
  hideLoading,
  showSuccessSnackBar,
  showErrorSnackBar,
  hideSnackBar 
} = appSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectLoading = (state: RootState) => state.app.loading
export const selectSnackBar = (state: RootState) => state.app.snackbar

export default appSlice.reducer