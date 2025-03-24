import { Box, Button, Typography } from "@mui/material";
import back from "../assets/Images/3d-cartoon-hospital-healthcare-scene.jpg"; // Replace with a relevant doctor-related image

const HomeBackground = () => {
  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        backgroundImage: `url(${back})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "top",
        display: "flex",
        alignItems: "center",
        justifyContent: { xs: "center", md: "flex-end" },
      }}
    >
      <Box
        sx={{
          width: { xs: "90%", sm: "80%", md: "420px" },
          padding: { xs: "20px", sm: "30px" },
          backgroundColor: "#F4F9FC",
          backdropFilter: "blur(10px)",
          borderRadius: "12px",
          boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.2)",
          textAlign: "center",
          border: "1px solid rgba(255, 255, 255, 0.3)",
          mr: 15,
        }}
      >
        <Typography
          sx={{
            fontFamily: "Convergence",
            fontWeight: 900,
            fontSize: { xs: "18px", sm: "20px" },
            color: "#000000",
            marginBottom: "8px",
          }}
        >
          Streamline Your <span style={{ color: "#3CBDED" }}>Practice</span>
        </Typography>

        <Typography
          sx={{
            fontFamily: "Convergence",
            fontWeight: 900,
            fontSize: { xs: "32px", sm: "38px", md: "42px" },
            lineHeight: { xs: "36px", sm: "40px", md: "42px" },
            color: "#000000",
            marginBottom: "15px",
          }}
        >
          Enhance <span style={{ color: "#3CBDED" }}>Efficiency</span> & Care
        </Typography>

        <Button
          sx={{
            backgroundColor: "#000000",
            color: "#ffffff",
            fontWeight: "bold",
            fontSize: { xs: "12px", sm: "14px" },
            padding: { xs: "8px 16px", sm: "10px 20px" },
            borderRadius: "6px",
            textTransform: "none",
            transition: "0.3s",
            "&:hover": { backgroundColor: "#333333" },
          }}
        >
          Get Started as a Doctor
        </Button>
      </Box>
    </Box>
  );
};

export default HomeBackground;
