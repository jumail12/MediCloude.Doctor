import { useState } from "react";
import { Avatar, Box, CircularProgress, Typography, Paper, Grid, Divider, IconButton, Modal, Button } from "@mui/material";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";  // MUI Logout Icon
import { useQuery } from "@tanstack/react-query";
import { businessAxios } from "../api/axiosInstance";
import { useNavigate } from "react-router-dom"; // For redirection
import profile_bg from "../assets/Images/profile.webp"; // Default profile image

const DrProfileContainer = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false); // Modal state
  const id = localStorage.getItem("id");

  const { data: doctor, isLoading } = useQuery({
    queryKey: ["dr"],
    queryFn: async () => {
      const res = await businessAxios.get(`/DoctorView/id?Id=${id}`);
      return res.data.data;
    },
  });

  console.log(doctor);

  const mockAppointments = [
    { date: "2025-04-10", time: "10:00 AM", patient: "John Doe" },
    { date: "2025-04-11", time: "11:30 AM", patient: "Jane Smith" },
    { date: "2025-04-12", time: "2:00 PM", patient: "Alice Brown" },
  ];

  // Logout function
  const handleLogout = () => {
    localStorage.clear(); // Clears all stored data
    navigate("/"); // Redirects to login page
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 1620, mx: "auto" }}>  {/* Increased width by 20% */}
      <Paper elevation={3} sx={{ p: 4, borderRadius: 4, backgroundColor: "#ffffff", color: "#000" }}>

        <Grid container spacing={3}>
          {/* Profile Section */}
          <Grid 
            item xs={12} md={4} 
            display="flex" 
            flexDirection="column" 
            alignItems="center" 
            position="relative"
            sx={{ pb: 3 }}
          >
            {/* Logout Icon Positioned Inside the Profile Section */}
            <IconButton 
              onClick={() => setOpen(true)} // Open modal on click
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                color: "#d32f2f",
                backgroundColor: "rgba(255, 255, 255, 0.7)",
                ":hover": {
                  backgroundColor: "#d32f2f",
                  color: "white",
                }
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
            <Typography variant="h6" fontWeight={600}>Upcoming Appointments</Typography>
            <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
              {mockAppointments.length === 0 ? (
                <Typography>No upcoming appointments</Typography>
              ) : (
                mockAppointments.map((appointment, index) => (
                  <Paper key={index} sx={{ p: 2, borderRadius: 2, boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.2)" }}>
                    <Typography variant="body1" fontWeight={600}>{appointment.patient}</Typography>
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
        <Typography variant="h6" fontWeight={600}>Doctor Details</Typography>
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={6}>
            <Typography variant="body1"><strong>Email:</strong> {doctor?.email || "Not provided"}</Typography>
            <Typography variant="body1"><strong>Phone:</strong> {doctor?.phone || "Not available"}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body1"><strong>Gender:</strong> {doctor?.gender || "Not specified"}</Typography>
            <Typography variant="body1"><strong>Experience:</strong> {doctor?.field_experience || "Not available"} years</Typography>
          </Grid>
        </Grid>

        {/* Divider for separating sections */}
        <Divider sx={{ my: 3 }} />

        {/* About Section - Full Width */}
        <Typography variant="h6" fontWeight={600}>About</Typography>
        <Box sx={{ mt: 2, p: 2, bgcolor: "#f9f9f9", borderRadius: 2, minHeight: "150px" }}>
          <Typography variant="body1">
            {doctor?.about || "No information provided."}
          </Typography>
        </Box>
      </Paper>

      {/* Logout Confirmation Modal */}
      <Modal open={open} onClose={() => setOpen(false)} sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Paper sx={{ p: 4, textAlign: "center", width: 300 }}>
          <Typography variant="h6" fontWeight={600}>Are you sure you want to log out?</Typography>
          <Box sx={{ mt: 3, display: "flex", justifyContent: "space-between" }}>
            <Button variant="outlined" onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="contained" color="error" onClick={handleLogout}>Confirm</Button>
          </Box>
        </Paper>
      </Modal>

    </Box>
  );
};

export default DrProfileContainer;
