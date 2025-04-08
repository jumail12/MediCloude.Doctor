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
  Select,
  MenuItem,
  Chip,
} from "@mui/material";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import { useQuery } from "@tanstack/react-query";
import { businessAxios } from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import profile_bg from "../assets/Images/profile.webp";
import DoctorProfileUpdateModal from "../components/modals/DoctorProfileUpdateModal";
import AddSlotModal from "../components/modals/AddSlotModal ";


const DrProfileContainer = () => {
  const navigate = useNavigate();
  const id = localStorage.getItem("id");
  const [days, setDays] = useState(7);

  // Color scheme
  const colors = {
    primary: "#3CBDED",
    secondary: "#2D9596",
    background: "#F5F7FA",
    textDark: "#1E293B",
    textLight: "#64748B",
    white: "#FFFFFF",
    border: "#E2E8F0",
  };

  const { data: doctor, isLoading } = useQuery({
    queryKey: ["dr", id],
    queryFn: async () => {
      const res = await businessAxios.get(`/DoctorView/id?Id=${id}`);
      return res.data.data;
    },
  });

  const { data: availableSlots, isLoading: slotLoading } = useQuery({
    queryKey: ["slots", days],
    queryFn: async () => {
      const res = await businessAxios.get(
        `/DrAvailability/dr-profile-slots?days=${days}`
      );
      return res.data.data;
    },
  });

  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);

  const [slotopen, SetSlotAddOpen] = useState(false);
  const handleCloseAddSlot = () => SetSlotAddOpen(false);

  const [openLogout, setOpenLogout] = useState(false);
  const handleCloseLogout = () => setOpenLogout(false);

  const { data: upcomingAppointments, isLoading: appoLoading } = useQuery({
    queryKey: ["upcoming-appo"],
    queryFn: async () => {
      const res = await businessAxios.get(
        `/DrUpcomingAppoinments/dr-upcoming-appoiments?pageNumber=1&pageSize=3`
      );
      return res.data.data;
    },
  });

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(":").map(Number);
    const date = new Date();
    date.setHours(hours, minutes);
    return date.toLocaleString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleShowMore = () => navigate("/appointments");
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
        <CircularProgress size={60} sx={{ color: colors.primary }} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1400, mx: "auto" }}>
      {/* Main Profile Card */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 4 },
          borderRadius: 4,
          backgroundColor: colors.white,
          boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.08)",
          mb: 4,
        }}
      >
        <Grid container spacing={4}>
          {/* Profile Section */}
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                position: "relative",
              }}
            >
              {/* Logout Button */}
              <IconButton
                onClick={() => setOpenLogout(true)}
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  color: colors.textDark,
                  "&:hover": { color: colors.primary },
                }}
              >
                <LogoutOutlinedIcon />
              </IconButton>

              {/* Doctor Avatar */}
              <Avatar
                src={doctor?.profile || profile_bg}
                sx={{
                  width: 150,
                  height: 150,
                  mb: 3,
                  border: `3px solid ${colors.primary}`,
                  bgcolor: colors.primary,
                  fontSize: "3rem",
                }}
              >
                {doctor?.doctor_name?.charAt(0) || "D"}
              </Avatar>

              {/* Doctor Info */}
              <Typography variant="h4" fontWeight={700} textAlign="center">
                Dr. {doctor?.doctor_name || "Unknown Doctor"}
              </Typography>
              
              <Chip
                label={doctor?.category || "Specialization"}
                sx={{
                  mt: 2,
                  bgcolor: colors.primary,
                  color: colors.white,
                  fontWeight: 600,
                }}
              />

              <Typography variant="body1" sx={{ mt: 2, textAlign: "center" }}>
                {doctor?.qualification || "Qualification not provided"}
              </Typography>

              <Box
                sx={{
                  mt: 3,
                  p: 2,
                  width: "100%",
                  textAlign: "center",
                  bgcolor: colors.background,
                  borderRadius: 2,
                }}
              >
                <Typography variant="h6" color={colors.primary} fontWeight={700}>
                  Consultation Fee: ₹{doctor?.drfee ?? "Not specified"}
                </Typography>
              </Box>

              {/* Update Profile Button */}
              <Button
                variant="contained"
                fullWidth
                sx={{
                  mt: 3,
                  py: 1.5,
                  bgcolor: colors.primary,
                  fontWeight: 600,
                  "&:hover": { bgcolor: "#2CA8D8" },
                }}
                onClick={() => setOpen(true)}
              >
                Update Profile
              </Button>
            </Box>
          </Grid>

          {/* Content Section */}
          <Grid item xs={12} md={8}>
            {/* Upcoming Appointments */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
                Upcoming Appointments
              </Typography>

              {appoLoading ? (
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <CircularProgress size={40} sx={{ color: colors.primary }} />
                </Box>
              ) : (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {Array.isArray(upcomingAppointments?.items) &&
                  upcomingAppointments.items.length > 0 ? (
                    <>
                      {upcomingAppointments.items.map((appointment: any) => (
                        <Paper
                          key={appointment.id}
                          onClick={() => navigate(`/appointments/${appointment.id}`)}
                          elevation={2}
                          sx={{
                            p: 2,
                            borderRadius: 2,
                            transition: "all 0.3s ease",
                            cursor: "pointer",
                            "&:hover": {
                              transform: "translateY(-2px)",
                              boxShadow: "0px 6px 16px rgba(0, 0, 0, 0.1)",
                              borderLeft: `4px solid ${colors.primary}`,
                            },
                          }}
                        >
                          <Typography variant="h6" fontWeight={600}>
                            {appointment.patient_name}
                          </Typography>
                          <Typography variant="body1" color={colors.textLight}>
                            {new Date(appointment.appointmentDate).toLocaleString(
                              "en-US",
                              {
                                weekday: "long",
                                month: "long",
                                day: "numeric",
                              }
                            )}{" "}
                            at {formatTime(appointment.appointmentTime)}
                          </Typography>
                        </Paper>
                      ))}

                      <Button
                        variant="outlined"
                        sx={{
                          alignSelf: "flex-start",
                          mt: 2,
                          px: 3,
                          py: 1,
                          borderColor: colors.primary,
                          color: colors.primary,
                          fontWeight: 600,
                          "&:hover": {
                            bgcolor: `${colors.primary}10`,
                            borderColor: colors.primary,
                          },
                        }}
                        onClick={handleShowMore}
                      >
                        View All Appointments
                      </Button>
                    </>
                  ) : (
                    <Paper
                      sx={{
                        p: 3,
                        textAlign: "center",
                        bgcolor: colors.background,
                        borderRadius: 2,
                      }}
                    >
                      <Typography variant="h6" color={colors.textLight}>
                        No upcoming appointments
                      </Typography>
                    </Paper>
                  )}
                </Box>
              )}
            </Box>

            <Divider sx={{ my: 4, borderColor: colors.border }} />

            {/* Doctor Details */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
                Professional Details
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <DetailItem label="Email" value={doctor?.email} />
                  <DetailItem label="Phone" value={doctor?.phone} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DetailItem label="Gender" value={doctor?.gender} />
                  <DetailItem 
                    label="Experience" 
                    value={`${doctor?.field_experience || "N/A"} years`} 
                  />
                </Grid>
              </Grid>
            </Box>

            <Divider sx={{ my: 4, borderColor: colors.border }} />

            {/* About Section */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
                About Dr. {doctor?.doctor_name?.split(" ")[0]}
              </Typography>
              <Paper
                sx={{
                  p: 3,
                  bgcolor: colors.background,
                  borderRadius: 2,
                  minHeight: 150,
                }}
              >
                <Typography variant="body1" paragraph>
                  {doctor?.about || "No professional bio available."}
                </Typography>
              </Paper>
            </Box>

            <Divider sx={{ my: 4, borderColor: colors.border }} />

            {/* Available Slots Section */}
            <Box>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mb: 3 }}
              >
                <Typography variant="h5" fontWeight={700}>
                  Available Time Slots
                </Typography>

                <Stack direction="row" spacing={2}>
                  <Select
                    value={days}
                    onChange={(e) => setDays(Number(e.target.value))}
                    sx={{
                      minWidth: 120,
                      bgcolor: colors.white,
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: colors.border,
                      },
                    }}
                  >
                    <MenuItem value={0}>All</MenuItem>
                    <MenuItem value={1}>1 Day</MenuItem>
                    <MenuItem value={3}>3 Days</MenuItem>
                    <MenuItem value={7}>7 Days</MenuItem>
                    <MenuItem value={14}>14 Days</MenuItem>
                    <MenuItem value={30}>30 Days</MenuItem>
                  </Select>

                  <Button
                    variant="contained"
                    sx={{
                      px: 3,
                      py: 1,
                      bgcolor: colors.primary,
                      fontWeight: 600,
                      "&:hover": { bgcolor: "#2CA8D8" },
                    }}
                    onClick={() => SetSlotAddOpen(true)}
                  >
                    Add New Slot
                  </Button>
                </Stack>
              </Stack>

              {slotLoading ? (
                <Box display="flex" justifyContent="center" py={4}>
                  <CircularProgress size={40} sx={{ color: colors.primary }} />
                </Box>
              ) : availableSlots && availableSlots.length > 0 ? (
                <Box
                  sx={{
                    p: 3,
                    bgcolor: colors.background,
                    borderRadius: 2,
                    border: `1px solid ${colors.border}`,
                  }}
                >
                  {availableSlots.map((slot: any, index: number) => (
                    <Box key={index} sx={{ mb: 4 }}>
                      <Typography
                        variant="h6"
                        fontWeight={600}
                        sx={{
                          mb: 2,
                          color: colors.primary,
                          borderBottom: `2px solid ${colors.primary}`,
                          display: "inline-block",
                          pb: 0.5,
                        }}
                      >
                        {new Date(slot.appointmentDate).toLocaleDateString(
                          "en-US",
                          {
                            weekday: "long",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </Typography>

                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                        {slot.appointmentTimes.map((timeSlot: any) => (
                          <Paper
                            key={timeSlot.id}
                            elevation={1}
                            sx={{
                              p: 2,
                              borderRadius: 2,
                              bgcolor: timeSlot.isAvailable
                                ? colors.white
                                : "#e0e0e0",
                              cursor: timeSlot.isAvailable
                                ? "pointer"
                                : "not-allowed",
                              minWidth: 120,
                              textAlign: "center",
                              transition: "all 0.2s ease",
                              "&:hover": timeSlot.isAvailable
                                ? {
                                    transform: "translateY(-2px)",
                                    boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
                                  }
                                : {},
                            }}
                          >
                            <Typography
                              variant="subtitle1"
                              fontWeight={600}
                              sx={{
                                color: timeSlot.isAvailable
                                  ? colors.primary
                                  : colors.textLight,
                              }}
                            >
                              {timeSlot.appointmentTime}
                            </Typography>
                            {!timeSlot.isAvailable && (
                              <Typography
                                variant="caption"
                                sx={{ color: "error.main", fontWeight: 500 }}
                              >
                               Sold
                              </Typography>
                            )}
                          </Paper>
                        ))}
                      </Box>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Paper
                  sx={{
                    p: 4,
                    textAlign: "center",
                    bgcolor: colors.background,
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="h6" color={colors.textLight}>
                    No available slots found
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Add new slots to make yourself available for appointments
                  </Typography>
                </Paper>
              )}
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Modals */}
      <DoctorProfileUpdateModal
        open={open}
        handleClose={handleClose}
        doctor={doctor}
      />

      <AddSlotModal slotopen={slotopen} handleCloseAddSlot={handleCloseAddSlot} />

      <Dialog
        open={openLogout}
        onClose={handleCloseLogout}
        fullWidth
        maxWidth="xs"
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 2,
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, color: colors.textDark }}>
          Confirm Logout
        </DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to log out of your account?</Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseLogout}
            sx={{
              color: colors.textLight,
              fontWeight: 600,
              "&:hover": { color: colors.primary },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleLogout}
            variant="contained"
            sx={{
              bgcolor: colors.primary,
              fontWeight: 600,
              "&:hover": { bgcolor: "#2CA8D8" },
            }}
          >
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

// Reusable detail item component
const DetailItem = ({ label, value }: { label: string; value?: string }) => (
  <Box sx={{ mb: 2 }}>
    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
      {label}
    </Typography>
    <Typography variant="body1" fontWeight={500}>
      {value || "Not provided"}
    </Typography>
  </Box>
);

export default DrProfileContainer;