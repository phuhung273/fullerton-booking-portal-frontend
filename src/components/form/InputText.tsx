import React from 'react';
import { TextField, TextFieldProps } from '@mui/material';
import { Control, Controller, FieldError } from 'react-hook-form';

type Props = {
  name: string;
  control: Control<any>;
  formError?: FieldError;
}

export default function InputText({
  name,
  label,
  control,
  formError,
  ...props
}: Props & TextFieldProps) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <TextField
          {...field}
          label={label}
          error={Boolean(formError)}
          helperText={formError?.message}
          {...props}
        />
      )}
    />
  );
}
