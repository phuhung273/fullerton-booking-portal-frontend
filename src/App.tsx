import * as React from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';

import { Route, Routes } from 'react-router-dom';
import RequireAuth from './components/RequireAuth';
import SignIn from './pages/SignIn';
import Dashboard from './pages/Dashboard';

export default function App() {
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
