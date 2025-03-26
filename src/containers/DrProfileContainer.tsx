import { useState } from "react";
import {
  Avatar,
  Box,
  CircularProgress,
  Typography,
  Paper,
  Grid,
  Divider,
  IconButton,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
} from "@mui/material";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined"; // MUI Logout Icon
import {useQuery } from "@tanstack/react-query";
import { businessAxios } from "../api/axiosInstance";
import { useNavigate } from "react-router-dom"; // For redirection
import profile_bg from "../assets/Images/profile.webp"; // Default profile image
import DoctorProfileUpdateModal from "../components/modals/DoctorProfileUpdateModal";
import AddSlotModal from "../components/modals/AddSlotModal ";

const DrProfileContainer = () => {
  const navigate = useNavigate();
  const id = localStorage.getItem("id");

  const { data: doctor, isLoading } = useQuery({
    queryKey: ["dr"],
    queryFn: async () => {
      const res = await businessAxios.get(`/DoctorView/id?Id=${id}`);
      return res.data.data;
    },
  });

  const { data: availableSlots, isLoading: slotLoading } = useQuery({
    queryKey: ["slots"],
    queryFn: async () => {
      const res = await businessAxios.get(
        `/DrAvailability/available-slots?drid=${id}`
      );
      return res.data.data;
    },
  });


  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);

  const [slotopen,SetSlotAddOpen]=useState(false);
  const handleCloseAddSlot =()=> SetSlotAddOpen(false);

  const [openLogout, setOpenLogout] = useState(false);
  const handleCloseLogout = () => setOpenLogout(false);

  const mockAppointments = [
    { date: "2025-04-10", time: "10:00 AM", patient: "John Doe" },
    { date: "2025-04-11", time: "11:30 AM", patient: "Jane Smith" },
    { date: "2025-04-12", time: "2:00 PM", patient: "Alice Brown" },
  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 1620, mx: "auto" }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 4,
          backgroundColor: "#ffffff",
          color: "#000",
        }}
      >
        <Grid container spacing={3}>
          {/* Profile Section */}
          <Grid
            item
            xs={12}
            md={4}
            display="flex"
            flexDirection="column"
            alignItems="center"
            position="relative"
            sx={{ pb: 3 }}
          >
            <IconButton
              onClick={() => setOpenLogout(true)}
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                color: "#d32f2f",
                backgroundColor: "rgba(255, 255, 255, 0.7)",
                ":hover": { backgroundColor: "#d32f2f", color: "white" },
              }}
            >
              <LogoutOutlinedIcon />
            </IconButton>

            <Avatar
              src={doctor?.profile || profile_bg}
              sx={{ width: 120, height: 120, bgcolor: "#000", mt: 3 }}
            />
            <Typography variant="h5" fontWeight={600} mt={2}>
              {doctor?.doctor_name || "Unknown Doctor"}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {doctor?.category || "Specialization not provided"}
            </Typography>
            <Typography variant="body2" mt={1}>
              {doctor?.qualification || "Not provided"}
            </Typography>
          </Grid>

          {/* Appointment Section */}
          <Grid item xs={12} md={8}>
            <Typography variant="h6" fontWeight={600}>
              Upcoming Appointments
            </Typography>
            <Box
              sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}
            >
              {mockAppointments.length === 0 ? (
                <Typography>No upcoming appointments</Typography>
              ) : (
                mockAppointments.map((appointment, index) => (
                  <Paper
                    key={index}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.2)",
                    }}
                  >
                    <Typography variant="body1" fontWeight={600}>
                      {appointment.patient}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {appointment.date} at {appointment.time}
                    </Typography>
                  </Paper>
                ))
              )}
            </Box>
          </Grid>
        </Grid>

        {/* Divider for separating sections */}
        <Divider sx={{ my: 3 }} />

        {/* Doctor Details Section */}
        <Typography variant="h6" fontWeight={600}>
          Doctor Details
        </Typography>
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={6}>
            <Typography variant="body1">
              <strong>Email:</strong> {doctor?.email || "Not provided"}
            </Typography>
            <Typography variant="body1">
              <strong>Phone:</strong> {doctor?.phone || "Not available"}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body1">
              <strong>Gender:</strong> {doctor?.gender || "Not specified"}
            </Typography>
            <Typography variant="body1">
              <strong>Experience:</strong>{" "}
              {doctor?.field_experience || "Not available"} years
            </Typography>

            {/* Update Profile Button (Black) */}
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#000",
                color: "#fff",
                mt: 2,
                ":hover": { backgroundColor: "#333" },
              }}
              onClick={() => setOpen(true)}
            >
              Update Profile
            </Button>
          </Grid>
        </Grid>

        {/* Divider for separating sections */}
        <Divider sx={{ my: 3 }} />

        {/* About Section - Full Width */}
        <Typography variant="h6" fontWeight={600}>
          About
        </Typography>
        <Box
          sx={{
            mt: 2,
            p: 2,
            bgcolor: "#f9f9f9",
            borderRadius: 2,
            minHeight: "150px",
          }}
        >
          <Typography variant="body1">
            {doctor?.about || "No information provided."}
          </Typography>
        </Box>

{/* avaalbe slots */}
   
<Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ my: 3 }}
      >
        <Typography variant="h6" fontWeight={600}>
          Available Slots
        </Typography>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#000",
            color: "#fff",
            ":hover": { backgroundColor: "#333" },
          }}
          onClick={() => SetSlotAddOpen(true)}
        >
          Add Slot
        </Button>
      </Stack>

      {/* Available Slots Section */}
      <Box
        sx={{
          mt: 2,
          p: 2,
          bgcolor: "#f9f9f9",
          borderRadius: 2,
          minHeight: "150px",
        }}
      >
        {slotLoading ? (
          <Typography>Loading available slots...</Typography>
        ) : availableSlots && availableSlots.length > 0 ? (
          availableSlots.map((slot: any, index: number) => (
            <Box key={index} sx={{ mb: 3 }}>
              {/* Day Header */}
              <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                {slot.appointmentDay}
              </Typography>

              {/* Time Slots Grid */}
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {slot.appoinmentTimes.map((timeSlot: any) => (
                  <Paper
                    key={timeSlot.id}
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.2)",
                      backgroundColor: timeSlot.isAvailable
                        ? "#ffffff"
                        : "#d3d3d3",
                      cursor: timeSlot.isAvailable ? "pointer" : "not-allowed",
                      minWidth: "100px",
                      textAlign: "center",
                    }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {timeSlot.appointmentTime}
                    </Typography>
                    {!timeSlot.isAvailable && (
                      <Typography variant="caption" color="error">
                        Booked
                      </Typography>
                    )}
                  </Paper>
                ))}
              </Box>
            </Box>
          ))
        ) : (
          <Typography>No available slots.</Typography>
        )}
      </Box>
      </Paper>

      {/* Profile Update Modal */}
      <DoctorProfileUpdateModal
        open={open}
        handleClose={handleClose}
        doctor={doctor}
      />

      {/* for slot add modal */}
      <AddSlotModal 
      slotopen={slotopen} 
      handleCloseAddSlot={handleCloseAddSlot}

      />

      {/* Logout Confirmation Modal */}
      <Dialog
        open={openLogout}
        onClose={handleCloseLogout}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Logout Confirmation</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to log out?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseLogout} sx={{ color: "#000" }}>
            Cancel
          </Button>
          <Button
            onClick={handleLogout}
            variant="contained"
            sx={{
              backgroundColor: "#d32f2f",
              color: "#fff",
              ":hover": { backgroundColor: "#b71c1c" },
            }}
          >
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DrProfileContainer;
