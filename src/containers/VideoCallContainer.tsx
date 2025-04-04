import React, { useEffect, useRef, useState, forwardRef } from "react";
import * as signalR from "@microsoft/signalr";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Slide,
  Typography,
  IconButton,
  ButtonGroup,
  Avatar,
} from "@mui/material";
import {
  Mic,
  MicOff,
  Videocam,
  VideocamOff,
  Call,
  CallEnd,
} from "@mui/icons-material";
import { TransitionProps } from "@mui/material/transitions";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const Transition = forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement },
  ref: React.Ref<unknown>
) {
  return <Slide direction="left" ref={ref} {...props} />;
});

const VideoCallContainer: React.FC = () => {
  const { vId: roomName } = useParams();
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  const [connection, setConnection] = useState<signalR.HubConnection | null>(
    null
  );
  const [callStarted, setCallStarted] = useState(false);
  const [incomingCall, setIncomingCall] = useState(false);
  const [callerId, setCallerId] = useState("");
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const Navigate=useNavigate();

  useEffect(() => {
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:7233/videohub")
      .withAutomaticReconnect()
      .build();

    newConnection.start().then(() => {
      newConnection.invoke("JoinRoom", roomName);
    });

    setConnection(newConnection);

    return () => {
      if (newConnection) {
        newConnection.invoke("LeaveRoom", roomName);
        newConnection.stop();
      }
    };
  }, []);

  const toggleAudio = () => {
    if (localStreamRef.current) {
      const audioTracks = localStreamRef.current.getAudioTracks();
      audioTracks.forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsAudioMuted(!isAudioMuted);
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTracks = localStreamRef.current.getVideoTracks();
      videoTracks.forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsVideoMuted(!isVideoMuted);
    }
  };

  const startCall = async () => {
    connection?.invoke("CallUser", roomName);
  };

  const acceptCall = async () => {
    setIncomingCall(false);
    connection?.invoke("AcceptCall", roomName);
    await startMediaAndOffer(false); // Receiver
  };

  const rejectCall = () => {
    setIncomingCall(false);
    connection?.invoke("RejectCall", roomName);
  };

  const cleanupStream = (ref: React.RefObject<HTMLVideoElement | null>) => {
    const stream = ref.current?.srcObject as MediaStream | null;
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      ref.current!.srcObject = null;
    }
  };

  const endCall = () => {
    if (peerRef.current) {
      peerRef.current.close();
      peerRef.current = null;
    }

    cleanupStream(localVideoRef);
    cleanupStream(remoteVideoRef);

    connection?.invoke("LeaveRoom", roomName);
    setCallStarted(false);
    setIncomingCall(false);
    setCallerId("");
    setIsAudioMuted(false);
    setIsVideoMuted(false);
    localStreamRef.current = null;
    Navigate(-1);
  };

  const startMediaAndOffer = async (
    isCaller = true,
    offerData: string | null = null
  ) => {
    try {
      const localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      
      localStreamRef.current = localStream;
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = localStream;
      }

      const peer = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });

      peerRef.current = peer;

      localStream
        .getTracks()
        .forEach((track) => peer.addTrack(track, localStream));

      peer.onicecandidate = (event) => {
        if (event.candidate) {
          connection?.invoke(
            "SendIceCandidate",
            roomName,
            JSON.stringify(event.candidate)
          );
        }
      };

      peer.ontrack = (event) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };

      if (isCaller) {
        const offer = await peer.createOffer();
        await peer.setLocalDescription(offer);
        connection?.invoke("SendOffer", roomName, JSON.stringify(offer));
      } else if (offerData) {
        await peer.setRemoteDescription(
          new RTCSessionDescription(JSON.parse(offerData))
        );
        const answer = await peer.createAnswer();
        await peer.setLocalDescription(answer);
        connection?.invoke("SendAnswer", roomName, JSON.stringify(answer));
      }
      setCallStarted(true);
    } catch (error) {
      console.error("Error starting media:", error);
      toast.error("Failed to access camera or microphone");
    }
  };

  useEffect(() => {
    if (!connection) return;

    const handleIncomingCall = (caller: string) => {
      setIncomingCall(true);
      setCallerId(caller);
    };

    const handleCallAccepted = () => {
      startMediaAndOffer(true); // Caller
    };

    const handleCallRejected = () => {
      toast.error("Call was rejected!");
    };

    const handleReceiveOffer = async (offer: string) => {
      await startMediaAndOffer(false, offer);
    };

    const handleReceiveAnswer = async (answer: string) => {
      if (peerRef.current) {
        await peerRef.current.setRemoteDescription(
          new RTCSessionDescription(JSON.parse(answer))
        );
      }
    };

    const handleReceiveIce = async (candidate: string) => {
      if (peerRef.current) {
        try {
          await peerRef.current.addIceCandidate(
            new RTCIceCandidate(JSON.parse(candidate))
          );
        } catch (err) {
          console.error("Error adding received ICE candidate", err);
        }
      }
    };

    const handleForceEnd = () => endCall();

    connection.on("IncomingCall", handleIncomingCall);
    connection.on("CallAccepted", handleCallAccepted);
    connection.on("CallRejected", handleCallRejected);
    connection.on("ReceiveOffer", handleReceiveOffer);
    connection.on("ReceiveAnswer", handleReceiveAnswer);
    connection.on("ReceiveIceCandidate", handleReceiveIce);
    connection.on("ForceEndCall", handleForceEnd);

    return () => {
      connection.off("IncomingCall", handleIncomingCall);
      connection.off("CallAccepted", handleCallAccepted);
      connection.off("CallRejected", handleCallRejected);
      connection.off("ReceiveOffer", handleReceiveOffer);
      connection.off("ReceiveAnswer", handleReceiveAnswer);
      connection.off("ReceiveIceCandidate", handleReceiveIce);
      connection.off("ForceEndCall", handleForceEnd);
    };
  }, [connection]);

  return (
    <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 3,
      p: 4,
      height: "100vh",
      background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
      borderRadius: 2,
      boxShadow: "0 8px 32px rgba(31, 38, 135, 0.15)",
      position: "relative",
      overflow: "hidden",
      "&::before": {
        content: '""',
        position: "absolute",
        width: "200%",
        height: "200%",
        top: "-50%",
        left: "-50%",
        background: "radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)",
        zIndex: 0,
      }
    }}
  >
    {/* Header */}
    <Box sx={{ 
      display: "flex", 
      flexDirection: "column", 
      alignItems: "center", 
      zIndex: 1,
      textAlign: "center"
    }}>
      <Typography variant="h4" sx={{ 
        fontWeight: 700, 
        color: "#2d3748",
        mb: 1,
        background: "linear-gradient(90deg, #4f46e5, #06b6d4)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent"
      }}>
        Video Connect
      </Typography>
      <Typography variant="subtitle1" sx={{ color: "#4a5568" }}>
        {callStarted ? "Live Call" : "Ready to connect"}
      </Typography>
    </Box>
  
    {/* Video Containers */}
    <Box sx={{ 
      display: "flex", 
      gap: 4, 
      zIndex: 1,
      flexWrap: "wrap",
      justifyContent: "center"
    }}>
      {/* Local Video */}
      <Box sx={{
        position: "relative",
        borderRadius: 3,
        overflow: "hidden",
        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
        border: "3px solid white",
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)"
        }
      }}>
        <Box sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bgcolor: "rgba(0,0,0,0.5)",
          color: "white",
          px: 2,
          py: 1,
          textAlign: "center",
          zIndex: 2
        }}>
          <Typography variant="subtitle2">You</Typography>
        </Box>
        <video
          ref={localVideoRef}
          autoPlay
          playsInline
          muted
          style={{ 
            width: 320, 
            height: 240, 
            display: "block",
            backgroundColor: isVideoMuted ? "#1a202c" : "transparent",
            transform: "scaleX(-1)" // Mirror effect
          }}
        />
        {isVideoMuted && (
          <Box sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "rgba(0,0,0,0.7)",
            zIndex: 1
          }}>
            <VideocamOff sx={{ fontSize: 60, color: "white" }} />
          </Box>
        )}
      </Box>
  
      {/* Remote Video */}
      <Box sx={{
        position: "relative",
        borderRadius: 3,
        overflow: "hidden",
        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
        border: "3px solid white",
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)"
        }
      }}>
        <Box sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bgcolor: "rgba(0,0,0,0.5)",
          color: "white",
          px: 2,
          py: 1,
          textAlign: "center",
          zIndex: 2
        }}>
          <Typography variant="subtitle2">{callStarted ? "Participant" : "Waiting..."}</Typography>
        </Box>
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          style={{ 
            width: 320, 
            height: 240, 
            display: "block",
            backgroundColor: "#1a202c"
          }}
        />
      </Box>
    </Box>
  
    {/* Call Controls */}
    <Box sx={{ 
      display: "flex", 
      flexDirection: "column", 
      alignItems: "center", 
      gap: 2,
      zIndex: 1,
      width: "100%",
      maxWidth: 500
    }}>
      {!callStarted && !incomingCall && (
        <Button 
          onClick={startCall} 
          variant="contained" 
          color="primary"
          startIcon={<Call sx={{ transform: "rotate(135deg)" }} />}
          sx={{
            px: 4,
            py: 1.5,
            borderRadius: 50,
            fontSize: "1rem",
            fontWeight: 600,
            background: "linear-gradient(90deg, #4f46e5, #06b6d4)",
            boxShadow: "0 4px 6px rgba(79, 70, 229, 0.3)",
            "&:hover": {
              boxShadow: "0 6px 8px rgba(79, 70, 229, 0.4)",
              background: "linear-gradient(90deg, #4f46e5, #06b6d4)"
            }
          }}
        >
          Start Call
        </Button>
      )}
  
      {callStarted && (
        <Box sx={{ 
          display: "flex", 
          gap: 2, 
          alignItems: "center",
          bgcolor: "rgba(255,255,255,0.8)",
          p: 2,
          borderRadius: 50,
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)"
        }}>
          <IconButton
            onClick={toggleAudio}
            sx={{
              bgcolor: isAudioMuted ? "#e53e3e" : "#4f46e5",
              color: "white",
              "&:hover": {
                bgcolor: isAudioMuted ? "#c53030" : "#4338ca"
              }
            }}
            title={isAudioMuted ? "Unmute microphone" : "Mute microphone"}
          >
            {isAudioMuted ? <MicOff /> : <Mic />}
          </IconButton>
          
          <IconButton
            onClick={toggleVideo}
            sx={{
              bgcolor: isVideoMuted ? "#e53e3e" : "#4f46e5",
              color: "white",
              "&:hover": {
                bgcolor: isVideoMuted ? "#c53030" : "#4338ca"
              }
            }}
            title={isVideoMuted ? "Turn on camera" : "Turn off camera"}
          >
            {isVideoMuted ? <VideocamOff /> : <Videocam />}
          </IconButton>
          
          <Button 
            onClick={endCall} 
            variant="contained" 
            color="error"
            startIcon={<CallEnd />}
            sx={{
              px: 3,
              py: 1,
              borderRadius: 50,
              fontWeight: 600,
              bgcolor: "#e53e3e",
              "&:hover": {
                bgcolor: "#c53030"
              }
            }}
          >
            End Call
          </Button>
        </Box>
      )}
    </Box>
  
    {/* Incoming Call Modal */}
    <Dialog
      open={incomingCall}
      TransitionComponent={Transition}
      keepMounted
      onClose={rejectCall}
      PaperProps={{
        sx: {
          position: "fixed",
          right: 40,
          top: "50%",
          transform: "translateY(-50%)",
          m: 0,
          p: 3,
          borderRadius: 3,
          minWidth: 320,
          bgcolor: "white",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          borderLeft: "4px solid #4f46e5",
          zIndex: 1300
        },
      }}
    >
      <DialogTitle sx={{ 
        fontWeight: 600, 
        color: "#4f46e5",
        display: "flex",
        alignItems: "center",
        gap: 1
      }}>
        <Call sx={{ fontSize: 28 }} />
        Incoming Video Call
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1" sx={{ color: "#4a5568", mb: 2 }}>
          {callerId || "Unknown caller"} is calling you
        </Typography>
        <Box sx={{ 
          display: "flex", 
          justifyContent: "center",
          my: 2
        }}>
          <Avatar sx={{ 
            width: 80, 
            height: 80, 
            bgcolor: "#4f46e5",
            fontSize: "2rem"
          }}>
            {callerId ? callerId.charAt(0).toUpperCase() : "?"}
          </Avatar>
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center", gap: 2 }}>
        <Button 
          onClick={rejectCall} 
          variant="outlined" 
          color="error"
          sx={{
            px: 3,
            py: 1,
            borderRadius: 50,
            fontWeight: 600,
            borderWidth: 2,
            "&:hover": {
              borderWidth: 2
            }
          }}
        >
          Decline
        </Button>
        <Button 
          onClick={acceptCall} 
          variant="contained" 
          color="primary"
          sx={{
            px: 3,
            py: 1,
            borderRadius: 50,
            fontWeight: 600,
            bgcolor: "#4f46e5",
            "&:hover": {
              bgcolor: "#4338ca"
            }
          }}
        >
          Accept
        </Button>
      </DialogActions>
    </Dialog>
  </Box>
  );
};

export default VideoCallContainer;