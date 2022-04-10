import React from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import { selectToken } from "../features/auth/authSlice";

export default function RequireAuth({ children }: { children: JSX.Element }) {

  const token = useAppSelector(selectToken)

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}