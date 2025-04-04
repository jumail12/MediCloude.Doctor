import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Typography,
} from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { businessAxios } from "../api/axiosInstance";
import { toast } from "sonner";

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

  const { mutate: alert,isPending:alertPending } = useMutation({
    mutationFn: async (id : any) => {
      const res = await businessAxios.post(`DrUpcomingAppoinments/Appinment-alert-patient?appID=${id}`);
      return res.data.data;
    },
    onSuccess: (data: any) => {
      toast.success(data);
    },
    onError: (err: any) => {
      toast.error(err);
    },
  });

  // Format Time
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

  // Format Date
  const formatDate = (dateString: any) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("en-US", {
      weekday: "long",
      month: "long",
      day: "2-digit",
    });
  };

  const handleStartCall = () => {
    if (details?.roomId) {
      navigate(`/video-call/${details.roomId}`);
    }
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
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
        }}
      >
        <Typography variant="h6" color="error">
          Error: Appointment not found.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f5f5f5",
      }}
    >
      <Paper
        sx={{
          padding: 4,
          width: "85%",
          maxWidth: 900,
          borderRadius: 4,
          background: "white",
          boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.1)",
          textAlign: "center",
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 3, color: "#333" }}>
          Appointment Details
        </Typography>

        <Box
          sx={{
            textAlign: "left",
            padding: "20px",
            borderRadius: "8px",
            backgroundColor: "#f8f8f8",
            mb: 3,
          }}
        >
          <Typography sx={{ fontSize: "16px", mb: 2, color: "#555" }}>
            <strong>Patient Name:</strong> {details?.patient_name || "N/A"}
          </Typography>
          <Typography sx={{ fontSize: "16px", mb: 2, color: "#555" }}>
            <strong>Email:</strong> {details?.email || "N/A"}
          </Typography>
          <Typography sx={{ fontSize: "16px", mb: 2, color: "#555" }}>
            <strong>Date:</strong> {formatDate(details?.appointmentDate)}
          </Typography>
          <Typography sx={{ fontSize: "16px", mb: 2, color: "#555" }}>
            <strong>Time:</strong> {formatTime(details?.appointmentTime)}
          </Typography>
          <Button
            onClick={()=>alert(details.id)}
            sx={{
              mt: 2,
              backgroundColor: "orange",
              color: "white",
              borderRadius: "8px",
              padding: "12px 24px",
              fontWeight: "600",
              "&:hover": {
                backgroundColor: "white",
                color: "black",
                border: "1px solid black",
              },
            }}
          >
          {alertPending? "Loading.." : "Alert user" }
          </Button>
        </Box>

        {details?.roomId && (
          <Button
            onClick={handleStartCall}
            sx={{
              mt: 2,
              backgroundColor: "black",
              color: "white",
              borderRadius: "8px",
              padding: "12px 24px",
              fontWeight: "600",
              "&:hover": {
                backgroundColor: "white",
                color: "black",
                border: "1px solid black",
              },
            }}
          >
            Start Video Call
          </Button>
        )}
      </Paper>
    </Box>
  );
};

export default AppoinmentByIdContainer;
