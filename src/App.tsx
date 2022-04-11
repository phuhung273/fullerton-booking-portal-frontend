import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';

import { Route, Routes } from 'react-router-dom';
import RequireAuth from './components/RequireAuth';
import SignIn from './pages/SignIn';
import Dashboard from './pages/dashboard/Dashboard';
import authService from './services/authService';
import { useAppDispatch, useAppSelector } from './state/hooks';
import { removeAuth, setAuth, setToken } from './state/authSlice';
import { Alert, Backdrop, CircularProgress, Snackbar } from '@mui/material';
import { hideLoading, hideSnackBar, selectLoading, selectSnackBar } from './state/appSlice';

export default function App() {

  const [hasHandshake, setHasHandshake] = useState(false);
  const doneHandshake = () => setHasHandshake(true);

  const dispatch = useAppDispatch();

  const loading = useAppSelector(selectLoading);
  const snackBar = useAppSelector(selectSnackBar);
  
  const handleCloseSnackBar = () => dispatch(hideSnackBar());

  const eraseAuthAndStopLoading = () => {
    dispatch(removeAuth());
    dispatch(hideLoading());
    doneHandshake();
  }

  // On init, handshake
  useEffect(() => {
    const token = localStorage.getItem('token');

    // No token saved, finish loading
    if(!token) {
      eraseAuthAndStopLoading()
      return;
    }

    // Set token, init handshake flow
    dispatch(setToken(token));
    authService.handshake()
      .then((response) => {
        const { data, success } = response.data;
        if(!success) {
          eraseAuthAndStopLoading()
          return;
        }

        doneHandshake();
        dispatch(setAuth(data));
        dispatch(hideLoading());
      })
      .catch((error) => {
        console.log(error);
        eraseAuthAndStopLoading();
      });
  }, [])

  const main = () => {
    return (
      <Box sx={{ my: 4 }}>
        <Routes>
          <Route path="/dashboard" element={ 
            <RequireAuth children={ <Dashboard /> } />
            } />
          <Route path="/login" element={ <SignIn /> } />
        </Routes>
      </Box>
    )
  }
  
  return (
    <div>
      {loading && 
        <Backdrop
          sx={{ color: '#fff', zIndex: 9999 }}
          open={loading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      }

      {hasHandshake &&
        main()
      }
      
      <Snackbar open={snackBar.visible} autoHideDuration={3000} onClose={handleCloseSnackBar}>
        <Alert onClose={handleCloseSnackBar} severity={snackBar.type} sx={{ width: '100%' }}>
          {snackBar.message}
        </Alert>
      </Snackbar>
    </div>
  )
}
