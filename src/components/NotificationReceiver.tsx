import React, { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";
import { useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, Avatar, Slide } from "@mui/material";
import logo from "../assets/images/ICON.png";

interface Notification {
  title?: string;
  message?: string;
  recipient_id?: string;
  sender_Name?: string;
  sender_Profile?: string;
}

const NotificationReceiver: React.FC = () => {
  const [userId, setUserId] = useState<string>("");
  const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
  const [notification, setNotification] = useState<Notification>({});
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const id = localStorage.getItem("id")?.toString() || "";
      setUserId(id);
    }
  }, []);

  useEffect(() => {
    if (!userId) return;

    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(`https://localhost:7233/nothub?drId=${userId}`, {
        transport: signalR.HttpTransportType.WebSockets
      })
      .configureLogging(signalR.LogLevel.Information)
      .withAutomaticReconnect([0, 2000, 5000, 10000])
      .build();

    newConnection.on("receivenotificationdr", (message: Notification) => {
      setNotification(message);
      console.log(message);
      
      setOpen(true);
      queryClient.invalidateQueries({ queryKey: ["notfi"] });
      queryClient.invalidateQueries({ queryKey: ["notfi-count"] });
      setTimeout(() => setOpen(false), 5000);
    });

    newConnection
      .start()
      .then(() => setConnection(newConnection))
      .catch((err) => console.error("Connection error:", err));

    return () => {
      if (newConnection) newConnection.stop();
    };
  }, [userId, queryClient]);

  return (
    <Box sx={{ position: "fixed", top: 16, right: 16, zIndex: 1500 }}>
      <Dialog open={open} onClose={() => setOpen(false)} TransitionComponent={Slide} transitionDuration={{ enter: 400, exit: 200 }}
        sx={{ position: "fixed", top: 16, right: 16, m: 0, "& .MuiDialog-container": { alignItems: "flex-start", justifyContent: "flex-end", marginRight: "16px" },
             "& .MuiPaper-root": { width: 350, borderRadius: 3, backgroundColor: "#121212", color: "#ffffff", boxShadow: "0px 5px 15px rgba(255, 255, 255, 0.2)" } }}>
        <DialogTitle sx={{ display: "flex", alignItems: "center", fontSize: "1rem", fontWeight: "bold", p: 2, backgroundColor: "#000000", color: "#ffffff" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Avatar src={logo} alt="PlotLink Logo" sx={{ width: 30, height: 30, objectFit: "cover" }} />
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>MEDICLOUDE</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Avatar src={notification.sender_Profile} alt={notification.sender_Name} sx={{ width: 40, height: 40 }} />
            <Typography sx={{ fontWeight: "bold", fontSize: "18px", color: "#ffffff" }}>{notification.title}</Typography>
          </Box>
          <Typography variant="body2" sx={{ mt: 3, whiteSpace: "pre-wrap", maxHeight: 150, overflowY: "auto", color: "#bbbbbb" }}>
            {notification.message}
          </Typography>
          <Typography variant="caption" sx={{ mt: 2, color: "#888888" }}>From: {notification.sender_Name}</Typography>
        </DialogContent>
        <DialogActions sx={{ backgroundColor: "#000000" }}>
          <Button onClick={() => setOpen(false)} sx={{ color: "#ffffff", backgroundColor: "#222222", "&:hover": { backgroundColor: "#333333" } }}>
            Dismiss
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default NotificationReceiver;
