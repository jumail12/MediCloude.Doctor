import { Box, Button, TextField, Typography } from "@mui/material";
import { FormikProps } from "formik";

interface ResetPwProps {
  formik: FormikProps<{
    password: string;
    confirmPassword: string;
  }>;
  isLoading: boolean;
}

const ResetPwForm: React.FC<ResetPwProps> = ({ formik, isLoading }) => {
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
        backgroundColor: "#f8f9fa",
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
          Reset Your Password
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
          Enter a new password for your account.
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
            label="New Password"
            type="password"
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            fullWidth
            required
          />
          <TextField
            sx={textFieldStyles}
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.confirmPassword &&
              Boolean(formik.errors.confirmPassword)
            }
            helperText={
              formik.touched.confirmPassword && formik.errors.confirmPassword
            }
            fullWidth
            required
          />

          {/* Confirm Button */}
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
              cursor: "pointer",
              "&:hover": {
                backgroundColor: "#333333",
              },
            }}
            type="submit"
            variant="contained"
          >
            {isLoading ? "Resetting..." : "Confirm Password"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ResetPwForm;
