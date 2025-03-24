import { Box, Button, Typography } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { toast } from "sonner";
import OTP from "../../components/OtpInput";
import { authAxios } from "../../api/axiosInstance";

const VerifyOtpContainer = () => {
  const [otp, setOtp] = useState("");
  const email = localStorage.getItem("email");
  const navigate = useNavigate();

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const verificationType = searchParams.get("type");

  const getApiEndpoint = () => {
    return verificationType === "reset"
      ? "/DoctorAuth/verify-otp-reset-password"
      : "/DoctorAuth/verify-otp";
  };

  const verifyOtpMutation = useMutation({
    mutationFn: async () => {
      const res = await authAxios.post(getApiEndpoint(), {
        email,
        otp,
      });
      return res.data.data;
    },
    onSuccess: (data: any) => {
      toast.success(data, {
        duration: 3000,
        onAutoClose: () =>
          navigate(
            verificationType === "reset" ? "/auth/resetpw" : "/auth/verifylicense"
          ),
      });
    },
    onError: (error: any) => {
      toast.error(error || "OTP verification failed. Please try again.");
    },
  });

  const handleSubmit = () => {
    if (otp.length !== 6) {
      toast.error("Please enter a 6-digit OTP.");
      return;
    }
    verifyOtpMutation.mutate();
  };
  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        backgroundColor: "#f8f9fa",
      }}
    >
      <Box
        sx={{
          width: { xs: "90%", sm: "400px" },
          padding: "32px",
          backgroundColor: "white",
          borderRadius: "12px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "16px",
        }}
      >
        {/* Heading */}
        <Typography
          sx={{
            fontSize: "24px",
            fontWeight: "800",
            fontFamily: "Convergence",
            color: "#000000",
            textAlign: "center",
          }}
        >
          {verificationType === "reset"
            ? "Reset Password Verification"
            : "Email Verification"}
        </Typography>

        {/* Subtext */}
        <Typography
          sx={{
            fontSize: "14px",
            fontWeight: "600",
            fontFamily: "Convergence",
            color: "#555",
            textAlign: "center",
            maxWidth: "300px",
          }}
        >
          {verificationType === "reset"
            ? "We’ve sent a 6-digit OTP to your email. Enter it below to reset your password."
            : "A 6-digit OTP has been sent to your email. Enter it below to verify your account."}
        </Typography>

        {/* OTP Input */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            alignItems: "center",
          }}
        >
          <OTP
            separator={<span></span>}
            value={otp}
            onChange={setOtp}
            length={6}
          />
        </Box>

        {/* Verify Button */}
        <Button
          sx={{
            width: "100%",
            height: "40px",
            backgroundColor: "#000000",
            color: "#FFFFFF",
            fontSize: "16px",
            textTransform: "none",
            fontWeight: "600",
            borderRadius: "8px",
            "&:hover": {
              backgroundColor: "#333333",
            },
          }}
          onClick={handleSubmit}
          variant="contained"
        >
          {verifyOtpMutation.isPending ? "Verifying..." : "Verify OTP"}
        </Button>
      </Box>
    </Box>
  );
};

export default VerifyOtpContainer;
