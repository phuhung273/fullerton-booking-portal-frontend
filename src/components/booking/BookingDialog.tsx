import React, { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import { Button, TextField } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { DateTimePicker } from '@mui/x-date-pickers';
import IBooking from '../../interfaces/booking';
import { useForm } from 'react-hook-form';
import InputText from '../form/InputText';
import Dropdown, { DropdownOption } from '../form/Dropdown';
import InputDateTime from '../form/InputDateTime';
import { isValidDateTime } from '../../utils/time';

type Props = {
  open: boolean;
  handleClose: () => void;
  onConfirm: (data: IBooking) => void;
}


const eventTypes: Array<DropdownOption> = [
  { label: "Health Talk", value: "Health Talk" },
  { label: "Wellness Events", value: "Wellness Events" },
  { label: "Fitness Activities", value: "Fitness Activities" },
];

export default function BookingDialog({
  open,
  handleClose,
  onConfirm
}: Props) {

  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<{
    type: string,
    location: string,
    proposedTime1: Date | null,
    proposedTime2: Date | null,
    proposedTime3: Date | null,
  }>({
    defaultValues: {
      type: '',
      location: '',
      proposedTime1: null,
      proposedTime2: null,
      proposedTime3: null,
    }
  });

  useEffect(() => {
    register('location', {
      required: 'Location is required.',
      minLength: {
        value: 3,
        message: 'Location too short.'
      }
    });

    register('type', {
      required: 'Event type is required.',
    });

    register('proposedTime1', {
      required: 'Time is required.',
      validate: value => isValidDateTime(value) || 'Invalid time.'
    });

    register('proposedTime2', {
      required: 'Time is required.',
      validate: value => isValidDateTime(value) || 'Invalid time.'
    });

    register('proposedTime3', {
      required: 'Time is required.',
      validate: value => isValidDateTime(value) || 'Invalid time.'
    });
  }, [register]);

  const onSubmit = handleSubmit((data) => {
    const { type, location, proposedTime1, proposedTime2, proposedTime3 } = data;

    onConfirm({
      type,
      location: location.toString(),
      proposedTimes: [ proposedTime1!, proposedTime2!, proposedTime3! ]
    })

    reset();
  });

  return (
    <Dialog
      onClose={handleClose}
      open={open}
      fullWidth
      maxWidth="sm"
    >
      <form onSubmit={onSubmit}>
        <DialogTitle>Create new Booking</DialogTitle>
        <DialogContent dividers>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              m: 'auto',
            }}
          > 

            <Dropdown
              name="type"
              label="Event Type"
              options={eventTypes}
              sx={{ mt: 2, minWidth: 120 }}
              formError={errors?.type}
              control={control}
            />

            <InputText
              name="location"
              label="Location"
              sx={{ mt: 2, minWidth: 120 }}
              formError={errors?.location}
              control={control}
            />

            <InputDateTime 
              name="proposedTime1"
              label="Proposed Time 1"
              sx={{ mt: 2, minWidth: 120 }}
              formError={errors?.proposedTime1}
              control={control}
            />

            <InputDateTime 
              name="proposedTime2"
              label="Proposed Time 3"
              sx={{ mt: 2, minWidth: 120 }}
              formError={errors?.proposedTime2}
              control={control}
            />

            <InputDateTime 
              name="proposedTime3"
              label="Proposed Time 3"
              sx={{ mt: 2, minWidth: 120 }}
              formError={errors?.proposedTime3}
              control={control}
            />
          </Box>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={handleClose} color="inherit">
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained" 
            color="primary"
            disableElevation
          >
            Save
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}