import React, { useState } from 'react';

import Box from '@mui/material/Box';
import { Button, TextField } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { DateTimePicker } from '@mui/x-date-pickers';
import IBooking from '../../interfaces/booking';

type Props = {
  open: boolean;
  handleClose: () => void;
  onSubmitValidated: (data: IBooking) => void;
}


const eventTypes = [
  "Health Talk",
  "Wellness Events",
  "Fitness Activities"
];

export default function BookingDialog({
  open,
  handleClose,
  onSubmitValidated
}: Props) {

  const [time1, setTime1] = useState<Date | null>(null);
  const [time2, setTime2] = useState<Date | null>(null);
  const [time3, setTime3] = useState<Date | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const type = formData.get('type');
    const location = formData.get('location')

    if(!type || !location || !time1 || !time2 || !time3){
      return;
    }

    onSubmitValidated({
      type: type.toString(),
      location: location.toString(),
      proposedTimes: [ time1, time2, time3 ]
    })
  };

  return (
    <Dialog
      onClose={handleClose}
      open={open}
      fullWidth
      maxWidth="sm"
    >
      <form noValidate onSubmit={handleSubmit}>
        <DialogTitle>Create new Booking</DialogTitle>
        <DialogContent dividers>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              m: 'auto',
            }}
          > 
            <FormControl sx={{ mt: 2, minWidth: 120 }}>
              <InputLabel htmlFor="max-width">Event Type</InputLabel>
              <Select
                label="type"
                value={eventTypes[0]}
                inputProps={{
                  name: 'type',
                }}
              >
                {eventTypes.map((value) =>
                  <MenuItem key={value} value={value}>{value}</MenuItem>
                )}
              </Select>
            </FormControl>

            <TextField
              name="location"
              label="Location"
              sx={{ mt: 2, minWidth: 120 }}
            />

            <DateTimePicker
              renderInput={(props) => 
                <TextField 
                sx={{ mt: 2, minWidth: 120 }}
                {...props} 
                />
              }
              label="Proposed Time 1"
              value={time1}
              onChange={setTime1}
            />

            <DateTimePicker
              renderInput={(props) => 
                <TextField 
                sx={{ mt: 2, minWidth: 120 }}
                {...props} 
                />
              }
              label="Proposed Time 2"
              value={time2}
              onChange={setTime2}
            />

            <DateTimePicker
              renderInput={(props) => 
                <TextField 
                sx={{ mt: 2, minWidth: 120 }}
                {...props} 
                />
              }
              label="Proposed Time 3"
              value={time3}
              onChange={setTime3}
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