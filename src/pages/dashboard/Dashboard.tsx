import React, { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import AddIcon from '@mui/icons-material/Add';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { Button, Chip, IconButton } from '@mui/material';
import Layout from '../../components/Layout';
import { StripedTableCell, StripedTableRow } from '../../components/StripedTable';
import BookingDialog from '../../components/booking/BookingDialog';
import IBooking from '../../interfaces/booking';
import bookingService from '../../services/bookingService';
import { useAppDispatch } from '../../state/hooks';
import {
  hideLoading, showErrorSnackBar, showLoading, showSuccessSnackBar,
} from '../../state/appSlice';
import BookingDeleteDialog from '../../components/booking/BookingDeleteDialog';
import RequireRole from '../../components/RequireRole';
import BookingApproveDialog from '../../components/booking/BookingApproveDialog';
import BookingRejectDialog from '../../components/booking/BookingRejectDialog';

export default function Dashboard() {
  const dispatch = useAppDispatch();

  const [openFormDialog, setOpenFormDialog] = useState(false);
  const handleOpenFormDialog = () => setOpenFormDialog(true);
  const handleCloseFromDialog = () => setOpenFormDialog(false);

  const [dataDeleteDialog, setDataDeleteDialog] = useState<IBooking | undefined>();
  const handleOpenDeleteDialog = (item: IBooking) => setDataDeleteDialog(item);
  const handleCloseDeleteDialog = () => setDataDeleteDialog(undefined);

  const [dataApproveDialog, setDataApproveDialog] = useState<IBooking | undefined>();
  const handleOpenApproveDialog = (item: IBooking) => setDataApproveDialog(item);
  const handleCloseApproveDialog = () => setDataApproveDialog(undefined);

  const [dataRejectDialog, setDataRejectDialog] = useState<IBooking | undefined>();
  const handleOpenRejectDialog = (item: IBooking) => setDataRejectDialog(item);
  const handleCloseRejectDialog = () => setDataRejectDialog(undefined);

  const [tableData, setTableData] = useState<Array<IBooking>>([]);
  const addData = (item: IBooking) => {
    setTableData([item, ...tableData]);
  };
  const deleteData = (id: string) => {
    dispatch(showLoading());
    bookingService.remove(id)
      .then((response) => {
        dispatch(hideLoading());
        const { success, message } = response.data;
        if (!success) {
          dispatch(showErrorSnackBar('Fail to delete booking'));
          console.log(message);
          return;
        }

        dispatch(showSuccessSnackBar('Booking deleted successfully'));
        handleCloseDeleteDialog();
        setTableData(tableData.filter((item) => item._id !== id));
      })
      .catch((error) => {
        dispatch(hideLoading());
        dispatch(showErrorSnackBar('Fail to delete booking'));
        console.log(error);
      });
  };
  const approveData = (item: IBooking) => {
    setTableData(tableData.map((oldItem) => {
      const newItem = oldItem;
      if (newItem._id === item._id) {
        newItem.selectedTime = item.selectedTime;
        newItem.status = 'approve';
      }

      return newItem;
    }));
  };
  const rejectData = (item: IBooking) => {
    setTableData(tableData.map((oldItem) => {
      const newItem = oldItem;
      if (newItem._id === item._id) {
        newItem.rejectReason = item.rejectReason;
        newItem.status = 'reject';
      }

      return newItem;
    }));
  };

  useEffect(() => {
    dispatch(showLoading());
    bookingService.index()
      .then((response) => {
        dispatch(hideLoading());
        const { data, success, message } = response.data;
        if (!success) {
          console.log(message);
          return;
        }

        setTableData(data);
      })
      .catch((error) => {
        dispatch(hideLoading());
        console.log(error);
      });
  }, []);

  const handleSubmitValidated = (item: IBooking) => {
    dispatch(showLoading());

    bookingService.store(item)
      .then((response) => {
        const { data, success, message } = response.data;

        dispatch(hideLoading());
        if (!success) {
          dispatch(showErrorSnackBar('Fail to create new booking'));
          console.log(message);
          return;
        }

        addData(data);
        dispatch(showSuccessSnackBar('New booking created successfully'));
        handleCloseFromDialog();
      })
      .catch((error) => {
        dispatch(hideLoading());
        dispatch(showErrorSnackBar('Fail to create new booking'));
        console.log(error);
      });
  };

  const handleApprove = (id: string, index: number) => {
    dispatch(showLoading());

    bookingService.approve(id, index)
      .then((response) => {
        const { data, success, message } = response.data;

        dispatch(hideLoading());
        if (!success) {
          dispatch(showErrorSnackBar('Fail to approve booking'));
          console.log(message);
          return;
        }

        approveData(data);
        dispatch(showSuccessSnackBar('Booking has been approved'));
        handleCloseApproveDialog();
      })
      .catch((error) => {
        dispatch(hideLoading());
        dispatch(showErrorSnackBar('Fail to approve booking'));
        console.log(error);
      });
  };

  const handleReject = (id: string, reason: string) => {
    dispatch(showLoading());

    bookingService.reject(id, reason)
      .then((response) => {
        const { data, success, message } = response.data;

        dispatch(hideLoading());
        if (!success) {
          dispatch(showErrorSnackBar('Fail to reject booking'));
          console.log(message);
          return;
        }

        rejectData(data);
        dispatch(showSuccessSnackBar('Booking has been rejected'));
        handleCloseRejectDialog();
      })
      .catch((error) => {
        dispatch(hideLoading());
        dispatch(showErrorSnackBar('Fail to reject booking'));
        console.log(error);
      });
  };

  const buildStatusChip = (status?: string) => {
    switch (status) {
      case 'review':
        return <Chip icon={<MoreHorizIcon />} color="default" label="Pending review" />;
      case 'approve':
        return <Chip icon={<CheckCircleIcon />} color="success" label="Approved" />;
      case 'reject':
        return <Chip icon={<CancelIcon />} color="error" label="Rejected" />;
      default:
        return null;
    }
  };

  return (
    <>
      <Layout>

        <RequireRole roles={['staff']}>
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
        </RequireRole>

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StripedTableCell>Type</StripedTableCell>
                <StripedTableCell>Location</StripedTableCell>
                <StripedTableCell>Status</StripedTableCell>
                <StripedTableCell>Approved Time</StripedTableCell>
                <StripedTableCell>Reject Reason</StripedTableCell>
                <StripedTableCell align="center">Actions</StripedTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tableData.map((row) => (
                <StripedTableRow key={row._id}>
                  <StripedTableCell component="th" scope="row">
                    {row.type}
                  </StripedTableCell>
                  <StripedTableCell>{row.location}</StripedTableCell>
                  <StripedTableCell>{buildStatusChip(row.status)}</StripedTableCell>
                  <StripedTableCell>{row.selectedTime ? new Date(row.selectedTime).toLocaleString() : ''}</StripedTableCell>
                  <StripedTableCell>{row.rejectReason ?? ''}</StripedTableCell>

                  <StripedTableCell align="center">

                    {row.status === 'review'
                      && (
                      <RequireRole roles={['staff']}>
                        <IconButton onClick={() => handleOpenDeleteDialog(row)}>
                          <DeleteIcon color="error" />
                        </IconButton>
                      </RequireRole>
                      )}

                    {row.status === 'review'
                      && (
                      <RequireRole roles={['admin']}>
                        <IconButton onClick={() => handleOpenApproveDialog(row)}>
                          <CheckCircleIcon color="success" />
                        </IconButton>
                        <IconButton onClick={() => handleOpenRejectDialog(row)}>
                          <CancelIcon color="action" />
                        </IconButton>
                      </RequireRole>
                      )}
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
        onConfirm={handleSubmitValidated}
      />

      <BookingDeleteDialog
        data={dataDeleteDialog}
        handleClose={handleCloseDeleteDialog}
        onConfirm={deleteData}
      />

      <BookingApproveDialog
        data={dataApproveDialog}
        handleClose={handleCloseApproveDialog}
        onConfirm={handleApprove}
      />

      <BookingRejectDialog
        data={dataRejectDialog}
        handleClose={handleCloseRejectDialog}
        onConfirm={handleReject}
      />
    </>
  );
}
