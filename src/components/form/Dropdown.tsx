import {
  FormControl, FormHelperText, InputLabel, MenuItem, Select, SelectProps,
} from '@mui/material';
import React from 'react';
import { Control, Controller, FieldError } from 'react-hook-form';

export type DropdownOption = {
  label: React.ReactNode;
  value: string | number;
}

type Props = {
  name: string;
  control: Control<any>;
  formError?: FieldError;
  options: Array<DropdownOption>;
}

export default function Dropdown({
  name,
  label,
  control,
  formError,
  options,
  sx,
  ...props
}: Props & SelectProps) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value } }) => (
        <FormControl sx={sx} error={Boolean(formError)}>
          <InputLabel>{label}</InputLabel>
          <Select
            onChange={onChange}
            value={value}
            {...props}
          >
            {options.map((option) => (
              <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
            ))}
          </Select>
          <FormHelperText>{formError?.message}</FormHelperText>
        </FormControl>
      )}
    />
  );
}
