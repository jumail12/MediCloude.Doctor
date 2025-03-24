import { Box, Typography } from "@mui/material";
import image from "../assets/Images/whoweare.jpg"; // Replace with a relevant image

const WhoWeArePage = () => {
  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "1850px",
        height: "900px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        overflowX: "hidden",
      }}
    >
      <Box
        sx={{
          width: "100%",
          height: "800px",
          backgroundColor: "white",
          borderRadius: "10px",
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          overflow: "hidden",
        }}
      >
        {/* Left Section: Image */}
        <Box
          sx={{
            width: { xs: "100%", md: "50%" },
            height: "800px",
            backgroundImage: `url(${image})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        {/* Right Section: Text */}
        <Box
          sx={{
            flexGrow: 1,
            width: { xs: "100%", md: "50%" },
            padding: "40px",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* Heading */}
          <Typography
            variant="h3"
            sx={{
              fontSize: "36px",
              fontWeight: "800",
              fontFamily: "ConcertOne",
            }}
          >
            <span style={{ color: "#3CBDED" }}>Empowering</span>{" "}
            <span style={{ color: "black" }}>Doctors</span>
          </Typography>

          {/* Doctor-Centric Description */}
          <Typography
            sx={{
              fontWeight: "500",
              fontFamily: "Convergence",
              fontSize: "18px",
              lineHeight: "1.6",
              color: "black",
              marginTop: "20px",
              maxWidth: "90%",
            }}
          >
            <span style={{ color: "#3CBDED", fontWeight: "bold" }}>MEDI</span>
            <span style={{ color: "black", fontWeight: "bold" }}>CLOUDE</span>{" "}
            is designed to help doctors **streamline their practice** with
            efficient **patient management tools**. From online appointment
            scheduling and automated prescription generation to secure patient
            records, our platform enables doctors to **focus on care rather than
            paperwork**.  
            <br />
            <br />
            Whether you're an independent practitioner or part of a larger
            hospital network,{" "}
            <span style={{ color: "#3CBDED", fontWeight: "bold" }}>MEDI</span>
            <span style={{ color: "black", fontWeight: "bold" }}>CLOUDE</span>{" "}
            provides the **intelligent solutions** you need to enhance patient
            care, improve efficiency, and grow your medical practice.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default WhoWeArePage;
