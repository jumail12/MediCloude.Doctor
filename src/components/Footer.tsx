import {
  Box,
  Container,
  Link,
  Tooltip,
  Typography,
  Grid,
} from "@mui/material";
import { NavLink } from "react-router-dom";
import icon from "../assets/Images/ICON.png";

const Footer = () => {
  return (
    <Box
      sx={{
        width: "100%",
        backgroundColor: "#ffffff",
        py: 5,
        boxShadow: "0px -2px 10px rgba(0,0,0,0.1)",
      }}
    >
      <Container maxWidth="xl">
        <Grid
          container
          spacing={4}
          justifyContent="space-between"
          alignItems="flex-start"
        >
          {/* About Section */}
          <Grid item xs={12} sm={6} md={4}>
            <Link
              component={NavLink}
              to="/"
              underline="none"
              sx={{ display: "flex", alignItems: "center",position:"relative",right:40 }}
            >
              <Box
                sx={{
                  width: "120px",
                  height: "120px",
                  backgroundImage: `url(${icon})`,
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "contain",
                  backgroundPosition: "center",
                }}
              />
              <Box sx={{ display: "flex", flexDirection: "row", ml: -2 }}>
                <Typography sx={logoStyles}>MEDI</Typography>
                <Typography sx={logoStylesDark}>CLOUDE</Typography>
              </Box>
            </Link>
            <Typography sx={{ fontSize: "14px", color: "#555" }}>
              MEDICLOUDE is an online patient management system that simplifies
              healthcare access. Patients can book appointments, receive
              prescriptions, and consult doctors online or in person. Doctors
              manage records and reports, while administrators oversee
              operations, ensuring a seamless healthcare experience.
            </Typography>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={3} mt={4}>
            <Typography sx={sectionTitleStyles}>Quick Links</Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {menuItems.map(({ title, path }) => (
                <Tooltip title={title} arrow key={title}>
                  <Link
                    component={NavLink}
                    to={path}
                    underline="none"
                    sx={navLinkStyles}
                  >
                    <Typography>{title}</Typography>
                  </Link>
                </Tooltip>
              ))}
            </Box>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} sm={6} md={3} mt={4}>
            <Typography sx={sectionTitleStyles}>Contact Us</Typography>
            <Typography sx={contactTextStyles}>
              <strong>Phone:</strong> 123-456-789
            </Typography>
            <Typography sx={contactTextStyles}>
              <strong>Email:</strong> medicloude2@gmail.com
            </Typography>
          </Grid>
        </Grid>

        {/* Copyright Section */}
        <Box sx={{ textAlign: "center", mt: 5 }}>
          <Typography sx={{ fontSize: "14px", color: "#777" }}>
            © {new Date().getFullYear()} MediCloude. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;

/** Styles */
const logoStyles = {
  fontFamily: "'Concert One', sans-serif",
  fontWeight: 800,
  color: "#3CBDED",
  fontSize: "26px",
  lineHeight: 1,
};

const logoStylesDark = {
  fontFamily: "'Concert One', sans-serif",
  fontWeight: 800,
  color: "#1E293B",
  fontSize: "26px",
  lineHeight: 1,
};

const sectionTitleStyles = {
  fontSize: "18px",
  fontWeight: 600,
  color: "#000",
  mb: 2,
};

const navLinkStyles = {
  color: "#000",
  fontWeight: "600",
  fontSize: "14px",
  "&.active": { color: "#3CBDED", fontWeight: "bold" },
  "&:hover": { color: "#3CBDED" },
};

const contactTextStyles = {
  fontSize: "14px",
  color: "#555",
  mb: 1,
};

const menuItems = [
  { title: "Home", path: "/" },
  { title: "Consult", path: "/consult" },
  { title: "Appointments", path: "/appointments" },
  { title: "Help", path: "/help" },
];
