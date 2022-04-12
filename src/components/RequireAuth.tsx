import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../state/hooks';
import { selectToken } from '../state/authSlice';

type Props = {
  children: React.ReactNode;
}

export default function RequireAuth({ children }: Props) {
  const token = useAppSelector(selectToken);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
