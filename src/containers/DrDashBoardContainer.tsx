import {
    Box,
    Typography,
    Pagination,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    CircularProgress,
    Alert,
  } from '@mui/material';
  import { useQuery } from '@tanstack/react-query';
  import { businessAxios } from '../api/axiosInstance';
  import { useState } from 'react';
  import { format } from 'date-fns';
  
  const DrDashBoardContainer = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 6;
  
    const { data: paymentDetails, isLoading, isError } = useQuery({
      queryKey: ['dashboard', currentPage],
      queryFn: async () => {
        const res = await businessAxios.get(
          `/Payment/dr-dashboard?pageNumber=${currentPage}&pageSize=${pageSize}`
        );
        return res.data.data ?? {
            profit: 0,
            total_appoinments_taken: 0,
            toatal_appoinments_completed: 0,
            toatal_appoinments_pending: 0,
            payment_pending: 0,
            payment_failed: 0,
            payment_deatils: {
              total_pages: 0,
              drPayments: [],
            },
          };
      },
    });
  
    const handlePageChange = (_: any, value: number) => {
      setCurrentPage(value);
    };
  
    if (isLoading) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" height="200px">
          <CircularProgress />
        </Box>
      );
    }
  
    if (isError) {
      return (
        <Box mt={2}>
          <Alert severity="error">Failed to load payment details</Alert>
        </Box>
      );
    }
  
    return (
      <Box p={3}>
        {/* Summary Cards */}
        <Box display="flex" flexWrap="wrap" gap={3} mb={4}>
          <SummaryCard title="Total Profit" value={`₹${paymentDetails?.profit?.toFixed(2) || '0.00'}`} color="#4caf50" />
          <SummaryCard title="Appointments Taken" value={paymentDetails?.total_appoinments_taken || 0} color="#2196f3" />
          <SummaryCard title="Completed Appointments" value={paymentDetails?.toatal_appoinments_completed || 0} color="#009688" />
          <SummaryCard title="Pending Appointments" value={paymentDetails?.toatal_appoinments_pending || 0} color="#ff9800" />
          <SummaryCard title="Pending Payments" value={paymentDetails?.payment_pending || 0} color="#f44336" />
          <SummaryCard title="Failed Payments" value={paymentDetails?.payment_failed || 0} color="#9e9e9e" />
        </Box>
  
        {/* Payment Details Table */}
        <Typography variant="h6" gutterBottom>
          Payment Details
        </Typography>
        <TableContainer component={Paper} sx={{ mb: 3 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell>Date & Time</TableCell>
                <TableCell>Patient</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Transaction ID</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Payment Method</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paymentDetails?.payment_deatils?.drPayments?.length ? (
                paymentDetails.payment_deatils.drPayments.map((payment:any) => (
                  <TableRow key={payment.id}>
                    <TableCell>
                      {format(new Date(payment.appointmentDate), 'dd MMM yyyy')} <br />
                      {payment.appointmentTime}
                    </TableCell>
                    <TableCell>{payment.patient_name}</TableCell>
                    <TableCell>{payment.email}</TableCell>
                    <TableCell>{payment.transactionId}</TableCell>
                    <TableCell>₹{payment.doctorAmount.toFixed(2)}</TableCell>
                    <TableCell>{payment.paymentMethod}</TableCell>
                    <TableCell>
                      <StatusBadge status={payment.paymentStatus} />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No payment details available.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
  
        {/* Pagination */}
        {!isLoading && !isError && paymentDetails.payment_deatils?.total_pages > 1 && (
          <Box display="flex" justifyContent="center" alignItems="center" mt={4} width="100%">
            <Pagination
              count={paymentDetails.payment_deatils.total_pages}
              page={currentPage}
              onChange={handlePageChange}
              variant="outlined"
              shape="rounded"
              sx={{
                '& .MuiPaginationItem-root': {
                  backgroundColor: 'black',
                  color: 'white',
                  border: '1px solid white',
                },
                '& .Mui-selected': {
                  backgroundColor: 'white',
                  color: 'black',
                  fontWeight: 'bold',
                },
              }}
            />
          </Box>
        )}
      </Box>
    );
  };
  
  // Helper Components
  const SummaryCard = ({
    title,
    value,
    color,
  }: {
    title: string;
    value: string | number;
    color: string;
  }) => (
    <Paper
      sx={{
        p: 2,
        minWidth: 200,
        flexGrow: 1,
        backgroundColor: color,
        color: 'white',
        borderRadius: 2,
      }}
    >
      <Typography variant="subtitle2">{title}</Typography>
      <Typography variant="h5" fontWeight="bold">
        {value}
      </Typography>
    </Paper>
  );
  
  const StatusBadge = ({ status }: { status: string }) => {
    let color = '';
    switch (status.toLowerCase()) {
      case 'completed':
        color = '#4caf50';
        break;
      case 'pending':
        color = '#ff9800';
        break;
      case 'failed':
        color = '#f44336';
        break;
      default:
        color = '#9e9e9e';
    }
  
    return (
      <Box
        component="span"
        sx={{
          px: 1.5,
          py: 0.5,
          borderRadius: 1,
          backgroundColor: `${color}20`,
          color: color,
          fontWeight: 'medium',
          display: 'inline-block',
        }}
      >
        {status}
      </Box>
    );
  };
  
  export default DrDashBoardContainer;
  