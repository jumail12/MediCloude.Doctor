import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Badge,
  CircularProgress,
  Skeleton,
  Box,
  Button,
  IconButton,
  Pagination,
  useMediaQuery,
} from "@mui/material";
import { toast } from "react-toastify";
import { DeleteOutline } from "@mui/icons-material";
import { useState } from "react";
import { businessAxios } from "../api/axiosInstance";

const NotificationContainer = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;
  const isMobile = useMediaQuery("(max-width:550px)"); // Detect mobile view

  const {
    data: notifications,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["notfi", currentPage],
    queryFn: async () => {
      const res = await businessAxios.get(
        `/Notification/notifications?recipient_type=Doctor&pageNumber=${currentPage}&pageSize=${pageSize}`
      );
      return res.data.data;
    },
    placeholderData: (prevData) => prevData,
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (id) => {
      await businessAxios.patch(
        `/Notification/IsRead?nId=${id}&recipient_type=Doctor`
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notfi"] });
      queryClient.invalidateQueries({ queryKey: ["notfi-count"] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to mark as read");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await businessAxios.delete(
        `/Notification/notification?nId=${id}&recipient_type=Doctor`
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notfi"] });
      queryClient.invalidateQueries({ queryKey: ["notfi-count"] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to delete notification");
    },
  });

  const token = localStorage.getItem("token");

  const handlePageChange = (_: any, value: number) => {
    setCurrentPage(value);
  };

  if (isLoading) {
    return (
      <Box maxWidth={1000} margin="auto" padding={2} textAlign="center">
        <Typography variant="h5" fontWeight="bold" mb={2}>
          Notifications
        </Typography>
        <CircularProgress size={40} />
        <Box mt={2}>
          {[...Array(5)].map((_, index) => (
            <Card key={index} sx={{ mb: 2, width: "100%" }}>
              <CardContent
                sx={{ display: "flex", alignItems: "center", gap: 2 }}
              >
                <Skeleton variant="circular" width={50} height={50} />
                <Box sx={{ flexGrow: 1 }}>
                  <Skeleton variant="text" width="80%" height={20} />
                  <Skeleton variant="text" width="60%" height={15} />
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>
    );
  }

  if (isError || !token) {
    return (
      <Typography textAlign="center">Error loading notifications</Typography>
    );
  }

  return (
    <Box maxWidth={1000} margin="auto" padding={2}>
      <Typography variant="h5" fontWeight="bold" mb={2}>
        Notifications
      </Typography>

      {notifications?.items?.length === 0 && (
        <Typography textAlign="center">
          You don't have any notifications yet..!
        </Typography>
      )}

      {/* Scrollable Notification List */}
      <Box
        sx={{
          maxHeight: "1000px",
          overflowY: "auto",
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        {notifications?.items
          ?.sort((a: any, b: any) => {
            if (a.isRead !== b.isRead) {
              return a.isRead ? 1 : -1;
            }

            return (
              new Date(b.created_on).getTime() -
              new Date(a.created_on).getTime()
            );
          })
          .map((notification: any) => {
            const formattedDate = new Intl.DateTimeFormat("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: true,
            }).format(new Date(notification.created_on));

            return (
              <Card
                key={notification.id}
                sx={{
                  mb: 2,
                  width: "100%",
                  backgroundColor: notification.isRead ? "#f5f5f5" : "#e3f2fd",
                  borderLeft: notification.isRead
                    ? "none"
                    : "4px solid #000000",
                  display: "flex",
                  flexDirection: "column",
                  cursor: "pointer",
                }}
              >
                <CardContent
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    flexDirection: isMobile ? "row" : "row",
                  }}
                >
                  <Badge
                    color="primary"
                    variant={notification.isRead ? "standard" : "dot"}
                  >
                    <Avatar
                      src={notification.sender_Profile}
                      alt={notification.sender_Name}
                      sx={{ width: 50, height: 50 }}
                    />
                  </Badge>

                  <Box sx={{ flexGrow: 1 }}>
                    <Typography sx={{ fontWeight: "bold", fontSize: "16px" }}>
                      {notification.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      sx={{
                        display: "-webkit-box",
                        WebkitBoxOrient: "vertical",
                        WebkitLineClamp: 3,
                        overflow: "hidden",
                      }}
                    >
                      {notification.message}
                    </Typography>

                    {/* Hide sender & date on mobile */}
                    {!isMobile && (
                      <>
                        <Typography variant="caption" color="textSecondary">
                          From: {notification.sender_Name}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          📅 {formattedDate}
                        </Typography>
                      </>
                    )}
                  </Box>

                  {notification.isRead && (
                    <IconButton
                      color="error"
                      onClick={() => deleteMutation.mutate(notification.id)}
                    >
                      <DeleteOutline />
                    </IconButton>
                  )}
                  {!notification.isRead && (
                    <Button
                      variant="contained"
                      onClick={() => mutation.mutate(notification.id)}
                      sx={{ backgroundColor: "#000000" }}
                    >
                      Mark as Read
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
      </Box>

      {!isLoading && !isError && notifications?.total_pages > 1 && (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          mt={4}
          width="100%"
        >
          <Pagination
            count={notifications.total_pages}
            page={currentPage}
            onChange={handlePageChange}
            variant="outlined"
            shape="rounded"
            sx={{
              "& .MuiPaginationItem-root": {
                backgroundColor: "black",
                color: "white",
                border: "1px solid white",
              },
              "& .Mui-selected": {
                backgroundColor: "white",
                color: "black",
                fontWeight: "bold",
              },
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default NotificationContainer;
