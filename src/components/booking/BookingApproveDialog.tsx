import React, { useState } from 'react';

import Box from '@mui/material/Box';
import { Button, Grid, IconButton, TextField, Typography } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import IBooking from '../../interfaces/booking';

type Props = {
  data?: IBooking;
  handleClose: () => void;
  onConfirm: (id:string, index: number) => void;
}

export default function BookingApproveDialog({
  data,
  handleClose,
  onConfirm,
}: Props) {

  if(!data) return null;

  const [approveIndex, setApproveIndex] = useState<number|null>(null);

  const handleConfirm = () => {
    if(approveIndex === null || !data._id) return;
    onConfirm(data._id, approveIndex);
  }

  const getProposedTimeLabel = (index: number) => {
    const num = index + 1;
    return `Proposed Time ${num}`;
  }

  const buildTimeRow = (time: Date, index: number) => {
    return (
      <Grid key={index} container spacing={2}>
        <Grid item xs={4} alignSelf="end">
          <Button 
            onClick={() => setApproveIndex(index)} 
            endIcon={index === approveIndex &&
              <CheckCircleIcon color="inherit" />
            }
            variant={index === approveIndex ? "contained" : "outlined"}
            color={index === approveIndex ? "success" : "inherit"}
            fullWidth
            disableElevation
          >
            Select
          </Button>
        </Grid>
        <Grid item xs={8} >
          <TextField
            disabled={index !== approveIndex}
            label={getProposedTimeLabel(index)}
            value={new Date(time).toLocaleString()}
            sx={{ mt: 2, minWidth: 120 }}
            fullWidth
          />
        </Grid>
      </Grid>
    )
  }

  return (
    <Dialog
      onClose={handleClose}
      open={data != null}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>Choose a time for this Booking</DialogTitle>
      <DialogContent dividers>

        {approveIndex === null &&
          <Typography variant="body1" color="error">Please choose a time</Typography>
        }

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            m: 'auto',
          }}
        > 

          {data.proposedTimes.map((item, index) => 
            buildTimeRow(item, index)
          )}

        </Box>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={handleClose} color="inherit">
          Cancel
        </Button>
        <Button
          variant="contained" 
          color="success"
          disableElevation
          onClick={handleConfirm}
        >
          Approve
        </Button>
      </DialogActions>
    </Dialog>
  )
}