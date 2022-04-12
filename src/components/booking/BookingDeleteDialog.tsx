import React from 'react';

import Box from '@mui/material/Box';
import { Button, TextField, Typography } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IBooking from '../../interfaces/booking';

type Props = {
  data?: IBooking;
  handleClose: () => void;
  onConfirm: (id: string) => void;
}

export default function BookingDeleteDialog({
  data,
  handleClose,
  onConfirm,
}: Props) {

  if(!data) return null;

  const handleConfirm = () => {
    if(!data?._id) return;
    onConfirm(data._id);
  }

  const getProposedTimeLabel = (index: number) => {
    const num = index + 1;
    return `Proposed Time ${num}`;
  }

  return (
    <Dialog
      onClose={handleClose}
      open={data != null}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>Delete this Booking</DialogTitle>
      <DialogContent dividers>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            m: 'auto',
          }}
        > 
          <TextField
            sx={{ mt: 2, minWidth: 120 }}
            label="Type"
            value={data.type}
            InputProps={{
              readOnly: true,
            }}
          />

          <TextField
            sx={{ mt: 2, minWidth: 120 }}
            label="Location"
            value={data.location}
            InputProps={{
              readOnly: true,
            }}
          />

          {data.proposedTimes.map((item, index) => 
            <TextField
              key={index}
              sx={{ mt: 2, minWidth: 120 }}
              label={getProposedTimeLabel(index)}
              value={new Date(item).toLocaleString()}
              InputProps={{
                readOnly: true,
              }}
            />
          )}

          <Typography style={{ marginTop: '1em' }} gutterBottom>
            Are you sure to delete this Booking?
          </Typography>
        </Box>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={handleClose} color="inherit">
          Cancel
        </Button>
        <Button
          variant="contained" 
          color="error"
          disableElevation
          onClick={handleConfirm}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  )
}