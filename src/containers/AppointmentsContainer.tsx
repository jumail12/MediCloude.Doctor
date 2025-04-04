import {
  Box,
  CircularProgress,
  Grid,
  Pagination,
  Paper,
  Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { businessAxios } from "../api/axiosInstance";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AppointmentsContainer = () => {
  const pageSize = 5;
  const [currentPage, setCurrentPage] = useState(1);

  const { data: upcomingAppointments, isLoading: appoLoading } = useQuery({
    queryKey: ["upcoming-appo", currentPage], // Ensure query refetches when page changes
    queryFn: async () => {
      const res = await businessAxios.get(
        `/DrUpcomingAppoinments/dr-upcoming-appoiments?pageNumber=${currentPage}&pageSize=${pageSize}`
      );
      return res.data.data;
    },
    placeholderData: (prevData) => prevData,
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

  const nav = useNavigate();
  const handlePageChange = (_: any, value: number) => {
    setCurrentPage(value);
  };

  return (
    <Box
      sx={{
        p: 3,
        borderRadius: 4,
      }}
    >
      <Grid container justifyContent="center">
        <Grid item xs={12} md={8}>
          <Typography
            variant="h6"
            fontWeight={700}
            sx={{ mb: 3, textAlign: "center", color: "#333" }}
          >
            📅 Upcoming Appointments
          </Typography>

          {appoLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
              <CircularProgress size={40} />
            </Box>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {Array.isArray(upcomingAppointments?.items) &&
              upcomingAppointments?.items.length > 0 ? (
                <>
                  {upcomingAppointments.items.map((appointment: any) => (
                    <Paper
                    onClick={() => nav(`/appointments/${appointment.id}`)} 
                      key={appointment.id}
                      sx={{
                        p: 3,
                        borderRadius: 4,
                        background: "white",
                        boxShadow: "0px 6px 16px rgba(0, 0, 0, 0.1)",
                        transition: "all 0.3s ease-in-out",
                        "&:hover": {
                          boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.2)",
                          transform: "translateY(-2px)",
                          cursor:"pointer"
                        },
                      }}
                    >
                      <Typography
                        variant="h6"
                        fontWeight={700}
                        sx={{ color: "#1E3A8A" }}
                      >
                        {appointment.patient_name}
                      </Typography>

                      <Typography variant="body2" color="text.secondary">
                        🗓{" "}
                        {new Date(appointment.appointmentDate).toLocaleString(
                          "en-US",
                          { weekday: "long", month: "long", day: "2-digit" }
                        )}{" "}
                        at ⏰ {formatTime(appointment.appointmentTime)}
                      </Typography>
                    </Paper>
                  ))}
                </>
              ) : (
                <Typography textAlign="center" fontSize={16} color="gray">
                  No upcoming appointments
                </Typography>
              )}
            </Box>
          )}

          {/* Pagination */}
          {!appoLoading && upcomingAppointments?.total_pages > 1 && (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              mt={4}
              width="100%"
            >
              <Pagination
                count={upcomingAppointments.total_pages}
                page={currentPage}
                onChange={handlePageChange}
                variant="outlined"
                shape="rounded"
                sx={{
                  "& .MuiPaginationItem-root": {
                    color: "#1E3A8A",
                    border: "1px solid #1E3A8A",
                    transition: "all 0.3s ease",
                  },
                  "& .Mui-selected": {
                    backgroundColor: "#1E3A8A",
                    color: "white",
                    fontWeight: "bold",
                  },
                  "& .MuiPaginationItem-root:hover": {
                    backgroundColor: "#1E3A8A",
                    color: "white",
                  },
                }}
              />
            </Box>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default AppointmentsContainer;
