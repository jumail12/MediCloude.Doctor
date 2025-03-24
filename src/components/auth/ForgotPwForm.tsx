import { Box, Button, TextField, Typography } from "@mui/material";
import { FormikProps } from "formik";
import React from "react";

interface ForgotPwPropsp {
  formik: FormikProps<{ email: string }>;
  isLoading: boolean;
}

const ForgotPwForm: React.FC<ForgotPwPropsp> = ({ formik, isLoading }) => {
  const textFieldStyles = {
    backgroundColor: "#F4F9FC",
    fontFamily: "Convergence",
    fontSize: "10px",
    width: "100%",
    "& .MuiInputBase-root": {
      height: "38px",
    },
    "& .MuiOutlinedInput-input": {
      padding: "10px",
    },
    "& .MuiInputLabel-root": {
      color: "#B3B4B5",
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "#B3B4B5",
    },
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
        backgroundColor: "#f9f9f9", // Optional background for better visibility
      }}
    >
      <Box
        sx={{
          width: { xs: "90%", sm: "400px" }, // Responsive width
          padding: "32px",
          backgroundColor: "white",
          borderRadius: "12px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "16px", // Adds spacing between elements
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
          Forgot Your Password?
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
          Enter your email address and we'll send you an OTP to reset your
          password.
        </Typography>

        {/* Form */}
        <Box
          component="form"
          onSubmit={formik.handleSubmit}
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "12px", // Ensures spacing between inputs & button
          }}
        >
          <TextField
            sx={textFieldStyles}
            label="Email"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
            fullWidth
            required
          />

          <Button
            sx={{
              width: "100%",
              height: "40px",
              backgroundColor: "#000000",
              color: "#FFFFFF",
              fontSize: "16px",
              textTransform: "none",
              fontWeight: "600",
              "&:hover": {
                backgroundColor: "#333333",
              },
            }}
            type="submit"
            variant="contained"
          >
            {isLoading ? "Loading..." : "Verify"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ForgotPwForm;
