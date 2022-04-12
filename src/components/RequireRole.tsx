import React from 'react';
import { useAppSelector } from '../state/hooks';
import { selectRole } from '../state/authSlice';

type Props = {
  children: React.ReactNode;
  roles: Array<string>
}

export default function RequireRole({ children, roles }: Props) {

  const role = useAppSelector(selectRole);

  if(!role || !roles.includes(role.name)) return null;

  return <>{children}</>;
}