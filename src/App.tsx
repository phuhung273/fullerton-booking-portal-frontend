import React, { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';

import { Route, Routes } from 'react-router-dom';
import RequireAuth from './components/RequireAuth';
import SignIn from './pages/SignIn';
import Dashboard from './pages/Dashboard';
import authService from './services/authService';
import { useAppDispatch } from './state/hooks';
import { removeAuth, setAuth, setToken } from './state/authSlice';
import { CircularProgress } from '@mui/material';

export default function App() {

  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(true)

  const stopLoading = () => setLoading(false);

  const eraseAuthAndStopLoading = () => {
    dispatch(removeAuth());
    stopLoading();
  }

  useEffect(() => {
    console.log('Render')
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

        stopLoading();
        dispatch(setAuth(data));
      })
      .catch((error) => {
        console.log(error);
        eraseAuthAndStopLoading();
      });
  })
  

  if(loading) {
    return <CircularProgress />
  } else {
    return (
      <Container maxWidth="sm">
        <Box sx={{ my: 4 }}>
          <Routes>
            <Route path="/dashboard" element={ 
              <RequireAuth children={ <Dashboard /> } />
             } />
            <Route path="/login" element={ <SignIn /> } />
          </Routes>
        </Box>
      </Container>
    );
  }
}
