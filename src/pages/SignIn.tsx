import React, { useState, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import authService from '../services/authService';
import { selectToken, setAuth } from '../state/authSlice';
import { useAppDispatch, useAppSelector } from '../state/hooks';
import { Navigate, useNavigate } from 'react-router-dom';
import { hideLoading, showLoading } from '../state/appSlice';
import { useForm } from 'react-hook-form';
import InputText from '../components/form/InputText';

const theme = createTheme();

export default function SignIn() {

  const token = useAppSelector(selectToken);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [error, setError] = useState<string|null>();

  const removeError = () => setError(null);

  const { register, handleSubmit, control, formState: { errors } } = useForm<{
    username: string,
    password: string,
  }>({
    defaultValues: {
      username: '',
      password: '',
    }
  });

  useEffect(() => {
    register('username', {
      required: 'Username is required.',
      minLength: {
        value: 3,
        message: 'Username too short'
      }
    });

    register('password', {
      required: 'Password is required.',
      minLength: {
        value: 3,
        message: 'Password too short'
      }
    });
  }, [register]);

  const onSubmit = handleSubmit((data) => {
    const { username, password } = data;

    dispatch(showLoading());
    authService.login(username, password)
      .then((response) => {
        dispatch(hideLoading());
        const { data, success, message } = response.data;
        if(!success) {
          setError(message);
          return;
        }

        removeError();
        dispatch(setAuth(data));
        navigate('/dashboard');
      })
      .catch((error) => {
        dispatch(hideLoading());
        console.log(error);
      });
  });

  if (token) {
    return <Navigate to="/" replace />;
  }

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>

          {error &&
            <Typography variant="h6" color="error">
              {error}
            </Typography>
          }

          <Box component="form" onSubmit={onSubmit} sx={{ mt: 1 }}>

            <InputText
              name="username"
              control={control}
              label="Username"
              formError={errors?.username}
              margin="normal"
              fullWidth
              autoFocus
            />

            <InputText
              name="password"
              control={control}
              label="Password"
              formError={errors?.password}
              type="password"
              margin="normal"
              fullWidth
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
          </Box>

          <Box
            sx={{
                marginTop: 4,
            }}
          >

            <Typography variant="subtitle1">
              Username: staff1 - Password: 123456
            </Typography>
            <Typography variant="subtitle1">
              Username: staff2 - Password: 123456
            </Typography>
            <Typography variant="subtitle1">
              Username: admin - Password: 123456
            </Typography>

          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}