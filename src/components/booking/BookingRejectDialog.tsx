import React, { useEffect } from 'react';

import Box from '@mui/material/Box';
import { Button, Typography } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { useForm } from 'react-hook-form';
import IBooking from '../../interfaces/booking';
import InputText from '../form/InputText';

type Props = {
  data?: IBooking;
  handleClose: () => void;
  onConfirm: (id: string, reason: string) => void;
}

export default function BookingRejectDialog({
  data,
  handleClose,
  onConfirm,
}: Props) {
  if (!data) return null;

  const {
    register, handleSubmit, reset, control, formState: { errors },
  } = useForm<{
    reason: string,
  }>({
    defaultValues: {
      reason: '',
    },
  });

  useEffect(() => {
    register('reason', {
      required: 'Reason is required.',
      minLength: {
        value: 3,
        message: 'Reason too short.',
      },
    });
  }, [register]);

  const onSubmit = handleSubmit((formData) => {
    const { reason } = formData;
    if (!data._id) return;
    onConfirm(data._id, reason);

    reset();
  });

  return (
    <Dialog
      onClose={handleClose}
      open={data != null}
      fullWidth
      maxWidth="sm"
    >
      <form onSubmit={onSubmit}>
        <DialogTitle>Reject this Booking</DialogTitle>
        <DialogContent dividers>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              m: 'auto',
            }}
          >
            <InputText
              name="reason"
              label="Reason for rejection"
              sx={{ mt: 2, minWidth: 120 }}
              formError={errors?.reason}
              control={control}
            />

            <Typography style={{ marginTop: '1em' }} gutterBottom>
              Are you sure to reject this Booking?
            </Typography>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="inherit">
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="error"
            disableElevation
          >
            Reject
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
