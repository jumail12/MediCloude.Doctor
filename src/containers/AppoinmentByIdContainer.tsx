import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Typography,
  Avatar,
  Divider,
  Chip,
  Stack,
} from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { businessAxios } from "../api/axiosInstance";
import { toast } from "sonner";
import { useState } from "react";
import PrescriptionAddModal from "../components/modals/PrescriptionAddModal";
import {
  Email,
  CalendarToday,
  AccessTime,
  VideoCall,
  Notifications,
  LocalHospital,
} from "@mui/icons-material";

const AppoinmentByIdContainer = () => {
  const { apid } = useParams();
  const navigate = useNavigate();

  const {
    data: details,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["app-details", apid],
    queryFn: async () => {
      const res = await businessAxios.get(
        `/DrUpcomingAppoinments/ap-by-id?id=${apid}`
      );
      return res.data.data;
    },
    enabled: !!apid,
  });

  const { mutate: alert, isPending: alertPending } = useMutation({
    mutationFn: async (id: any) => {
      const res = await businessAxios.post(
        `DrUpcomingAppoinments/Appinment-alert-patient?appID=${id}`
      );
      return res.data.data;
    },
    onSuccess: (data: any) => {
      toast.success(data);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to send alert");
    },
  });

  const formatTime = (timeString: any) => {
    if (!timeString) return "N/A";
    const [hours, minutes] = timeString.split(":").map(Number);
    const date = new Date();
    date.setHours(hours, minutes);
    return date.toLocaleString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (dateString: any) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("en-US", {
      weekday: "long",
      month: "long",
      day: "2-digit",
      year: "numeric",
    });
  };

  const handleStartCall = () => {
    if (details?.roomId) {
      navigate(`/video-call/${details.roomId}`);
    }
  };

  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "#fff",
        }}
      >
        <CircularProgress size={60} thickness={4} sx={{ color: "#3CBDED" }} />
      </Box>
    );
  }

  if (isError || !details) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "#fff",
        }}
      >
        <Paper
          sx={{
            p: 4,
            textAlign: "center",
            maxWidth: 500,
            borderRadius: 2,
            backgroundColor: "#fff",
            border: "1px solid #3CBDED",
            boxShadow: "0 0 20px rgba(60, 189, 237, 0.3)",
          }}
        >
          <Typography variant="h5" color="#3CBDED" sx={{ mb: 2 }}>
            Appointment Not Found
          </Typography>
          <Typography sx={{ mb: 3, color: "#000" }}>
            The requested appointment could not be loaded.
          </Typography>
          <Button
            variant="outlined"
            onClick={() => navigate(-1)}
            sx={{
              borderColor: "#3CBDED",
              color: "#000",
              fontWeight: "bold",
              "&:hover": {
                backgroundColor: "rgba(60, 189, 237, 0.1)",
              },
            }}
          >
            Go Back
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        py: 4,
        px: 2,
        backgroundColor: "#fff",
      }}
    >
      <Paper
        sx={{
          width: "100%",
          maxWidth: 900,
          borderRadius: 2,
          overflow: "hidden",
          backgroundColor: "#fff",
          border: "1px solid #3CBDED",
          boxShadow: "0 0 30px rgba(60, 189, 237, 0.2)",
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: "#3CBDED",
          },
        }}
      >
        <Box sx={{ p: { xs: 3, md: 4 } }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              mb: 3,
              textAlign: "center",
              color: "#3CBDED",
              textShadow: "0 0 10px rgba(60, 189, 237, 0.5)",
            }}
          >
            Appointment Details
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: 4,
              mb: 4,
            }}
          >
            <Box sx={{ flex: 1 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  mb: 3,
                }}
              >
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    bgcolor: "#3CBDED",
                    color: "#000",
                    fontSize: "2rem",
                    border: "2px solid #3CBDED",
                  }}
                >
                  {details?.patient_name?.charAt(0)?.toUpperCase() || "P"}
                </Avatar>
                <Box>
                  <Typography variant="h5" fontWeight={600} color="#000">
                    {details?.patient_name || "N/A"}
                  </Typography>
                  <Chip
                    label="Active"
                    size="small"
                    sx={{
                      mt: 1,
                      bgcolor: "rgba(60, 189, 237, 0.1)",
                      color: "#000",
                      fontWeight: "bold",
                      border: "1px solid #3CBDED",
                    }}
                  />
                </Box>
              </Box>

              <Box
                sx={{
                  p: 3,
                  borderRadius: 2,
                  backgroundColor: "#f9f9f9",
                  border: "1px solid #3CBDED",
                }}
              >
                <Stack spacing={2}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Email sx={{ color: "#3CBDED" }} />
                    <Typography color="#000">
                      {details?.email || "N/A"}
                    </Typography>
                  </Box>
                  <Divider sx={{ borderColor: "#3CBDED" }} />
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <CalendarToday sx={{ color: "#3CBDED" }} />
                    <Typography color="#000">
                      {formatDate(details?.appointmentDate)}
                    </Typography>
                  </Box>
                  <Divider sx={{ borderColor: "#3CBDED" }} />
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <AccessTime sx={{ color: "#3CBDED" }} />
                    <Typography color="#000">
                      {formatTime(details?.appointmentTime)}
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            </Box>

            <Box
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, color: "#3CBDED" }}
              >
                Appointment Actions
              </Typography>

              <Button
                onClick={() => alert(details.id)}
                startIcon={<Notifications sx={{ color: "#000" }} />}
                variant="outlined"
                disabled={alertPending}
                sx={{
                  py: 1.5,
                  borderRadius: 1,
                  borderColor: "#3CBDED",
                  color: "#000",
                  fontWeight: "bold",
                  "&:hover": {
                    backgroundColor: "rgba(60, 189, 237, 0.1)",
                  },
                  "&.Mui-disabled": {
                    borderColor: "#ccc",
                    color: "#888",
                  },
                }}
              >
                {alertPending ? "Sending..." : "Alert Patient"}
              </Button>

              <Button
                onClick={() => setOpen(true)}
                disabled={details?.appoinmentStatus === "Success"}
                startIcon={<LocalHospital sx={{ color: "#000" }} />}
                variant="outlined"
                sx={{
                  py: 1.5,
                  borderRadius: 1,
                  borderColor: "#3CBDED",
                  color: "#000",
                  fontWeight: "bold",
                  "&:hover": {
                    backgroundColor:
                      details?.appoinmentStatus === "Success"
                        ? "transparent"
                        : "rgba(60, 189, 237, 0.1)",
                  },
                  "&.Mui-disabled": {
                    borderColor: "#ccc",
                    color: "#888",
                  },
                }}
              >
                Add Prescription
                {details?.appoinmentStatus === "Success" && (
                  <Chip
                    label="Completed"
                    size="small"
                    sx={{
                      ml: 1,
                      bgcolor: "rgba(60, 189, 237, 0.1)",
                      color: "#000",
                      fontSize: "0.75rem",
                      height: "20px",
                      border: "1px solid #3CBDED",
                    }}
                  />
                )}
              </Button>

              {details?.roomId && (
                <Button
                  onClick={handleStartCall}
                  disabled={details?.appoinmentStatus === "Success"}
                  startIcon={<VideoCall sx={{ color: "#000" }} />}
                  variant="outlined"
                  sx={{
                    py: 1.5,
                    borderRadius: 1,
                    borderColor: "#3CBDED",
                    color: "#000",
                    fontWeight: "bold",
                    "&:hover": {
                      backgroundColor: "rgba(60, 189, 237, 0.1)",
                    },
                    "&.Mui-disabled": {
                      borderColor: "#ccc",
                      color: "#888",
                    },
                  }}
                >
                  Start Video Call
                </Button>
              )}
            </Box>
          </Box>
        </Box>
      </Paper>

      <PrescriptionAddModal
        AppId={details.id}
        open={open}
        handleClose={handleClose}
      />
    </Box>
  );
};

export default AppoinmentByIdContainer;