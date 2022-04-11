import React, { useState, useEffect } from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Layout from '../../components/Layout'
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import AddIcon from '@mui/icons-material/Add';
import { Button, IconButton } from '@mui/material';
import { StripedTableCell, StripedTableRow } from '../../components/StripedTable';
import BookingDialog from '../../components/booking/BookingDialog';
import IBooking from '../../interfaces/booking';
import bookingService from '../../services/bookingService';
import { useAppDispatch } from '../../state/hooks';
import { hideLoading, showErrorSnackBar, showLoading, showSuccessSnackBar } from '../../state/appSlice';
import BookingDeleteDialog from '../../components/booking/BookingDeleteDialog';

type Props = {}

export default function Dashboard({}: Props) {

  const dispatch = useAppDispatch();

  const [data, setData] = useState<Array<IBooking>>([]);
  const addData = (item: IBooking) => {
    setData([...data, item])
  };
  const deleteData = (id: string) => {
    dispatch(showLoading());
    bookingService.remove(id)
      .then((response) => {
        dispatch(hideLoading());
        const { success, message } = response.data;
        if(!success) {
          dispatch(showErrorSnackBar('Fail to delete booking'));
          console.log(message);
          return;
        }

        dispatch(showSuccessSnackBar('Booking deleted successfully'));
        handleCloseDeleteDialog()
        setData(data.filter(data => data._id !== id));
      })
      .catch((error) => {
        dispatch(hideLoading());
        dispatch(showErrorSnackBar('Fail to delete booking'));
        console.log(error);
      })
  };

  const [openFormDialog, setOpenFormDialog] = useState(false);
  const handleOpenFormDialog = () => setOpenFormDialog(true);
  const handleCloseFromDialog = () => setOpenFormDialog(false);

  const [dataDeleteDialog, setDataDeleteDialog] = useState<IBooking | undefined>();
  const handleOpenDeleteDialog = (item: IBooking) => setDataDeleteDialog(item);
  const handleCloseDeleteDialog = () => setDataDeleteDialog(undefined);

  useEffect(() => {
    dispatch(showLoading());
    bookingService.index()
      .then((response) => {
        dispatch(hideLoading());
        const { data, success, message } = response.data;
        if(!success) {
          console.log(message);
          return;
        }

        setData(data);
      })
      .catch((error) => {
        dispatch(hideLoading());
        console.log(error);
      })
  }, [])
  

  const handleSubmitValidated = (data: IBooking) => {
    dispatch(showLoading());

    bookingService.store(data)
      .then((response) => {
        const { data, success, message } = response.data;

        dispatch(hideLoading());
        if(!success) {
          dispatch(showErrorSnackBar('Fail to create new booking'));
          console.log(message);
          return;
        }

        addData(data);
        dispatch(showSuccessSnackBar('New booking created successfully'));
        handleCloseFromDialog()
      })
      .catch((error) => {
        dispatch(hideLoading());
        dispatch(showErrorSnackBar('Fail to create new booking'));
        console.log(error);
      });
  }

  return (
    <>
      <Layout>

        <div style={{ float: 'right', marginBottom: '4em' }}>
          <Button 
            variant="contained" 
            size="large" 
            startIcon={<AddIcon fontSize="inherit" />} 
            onClick={handleOpenFormDialog}
          >
            New Booking
          </Button>
        </div>

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StripedTableCell>Type</StripedTableCell>
                <StripedTableCell>Location</StripedTableCell>
                <StripedTableCell>Status</StripedTableCell>
                <StripedTableCell align="center">Actions</StripedTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row) => (
                <StripedTableRow key={row._id}>
                  <StripedTableCell component="th" scope="row">
                    {row.type}
                  </StripedTableCell>
                  <StripedTableCell>{row.location}</StripedTableCell>
                  <StripedTableCell>{row.status}</StripedTableCell>

                  <StripedTableCell align="center">
                    <IconButton onClick={() => handleOpenDeleteDialog(row)}>
                      <DeleteIcon color="error" />
                    </IconButton>
                    <IconButton>
                      <CheckCircleIcon color="success" />
                    </IconButton>
                    <IconButton>
                      <CancelIcon color="action" />
                    </IconButton>
                  </StripedTableCell>
                </StripedTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Layout>

      <BookingDialog
        open={openFormDialog}
        handleClose={handleCloseFromDialog}
        onSubmitValidated={handleSubmitValidated}
      />

      <BookingDeleteDialog 
        data={dataDeleteDialog}
        handleClose={handleCloseDeleteDialog}
        onDelete={deleteData}
      />
    </>
  )
}