import React from 'react';
import { FormControl, FormHelperText, TextField, TextFieldProps } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import { Control, Controller, FieldError } from 'react-hook-form';

type Props = {
  name: string;
  control: Control<any>;
  formError?: FieldError;
}

export default function InputDateTime({
  name,
  label,
  control,
  formError,
  sx,
}: Props & TextFieldProps) {

  return (
    <Controller 
      name={name}
      control={control}
      render={({ field: { onChange, value } }) => (
        <FormControl error={Boolean(formError)}>
          <DateTimePicker
            renderInput={(props) =>
              <TextField
                sx={sx}
                {...props} 
              />
            }
            label={label}
            value={value}
            onChange={onChange}
          />
          <FormHelperText>{formError?.message}</FormHelperText>
        </FormControl>
      )}
    />
  )
}