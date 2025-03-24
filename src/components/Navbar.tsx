import {
  Box,
  Typography,
  Link,
  Container,
  Tooltip,
  Badge,
  Avatar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
} from "@mui/material";
import { NavLink, useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useState } from "react";
import icon from "../assets/Images/ICON.png";
import profile from "../assets/Images/profile.webp";

const Navbar = () => {
  const name = localStorage.getItem("name");
  const navigate = useNavigate(); // For navigation
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  return (
    <Box
      sx={{
        width: "100%",
        height: "80px",
        backgroundColor: "#ffffff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0px 2px 10px rgba(0,0,0,0.1)",
      }}
    >
      <Container
        maxWidth="xl"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: { xs: "16px", sm: "32px", md: "40px" },
        }}
      >
        {/* Logo */}
        <Link
          component={NavLink}
          to="/"
          underline="none"
          sx={{ display: "flex", alignItems: "center" }}
        >
          <Box
            sx={{
              width: "80px",
              height: "80px",
              backgroundImage: `url(${icon})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "contain",
              backgroundPosition: "center",
            }}
          />
          <Box
            sx={{ display: "flex", flexDirection: "row", marginLeft: "-16px" }}
          >
            <Typography sx={logoStyles}>MEDI</Typography>
            <Typography sx={logoStylesDark}>CLOUDE</Typography>
          </Box>
        </Link>

        {/* Desktop Menu */}
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            alignItems: "center",
            gap: 3,
          }}
        >
          <NavLinks />
          <AuthSection name={name} navigate={navigate} />
        </Box>

        {/* Mobile Menu Button */}
        <IconButton
          sx={{ display: { xs: "block", md: "none" } }}
          onClick={handleDrawerToggle}
        >
          <MenuIcon sx={{ fontSize: "32px" }} />
        </IconButton>

        {/* Mobile Drawer */}
        <Drawer anchor="right" open={mobileOpen} onClose={handleDrawerToggle}>
          <Box sx={{ width: 250 }}>
            <IconButton
              onClick={handleDrawerToggle}
              sx={{ display: "flex", justifyContent: "flex-end", p: 1 }}
            >
              <CloseIcon />
            </IconButton>
            <List>
              {menuItems.map(({ title, path }) => (
                <ListItem key={title} disablePadding>
                  <ListItemButton
                    component={NavLink}
                    to={path}
                    onClick={handleDrawerToggle}
                  >
                    <ListItemText
                      primary={title}
                      sx={{ textAlign: "center", fontWeight: "bold" }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
              <ListItem>{AuthSection({ name, navigate })}</ListItem>
            </List>
          </Box>
        </Drawer>
      </Container>
    </Box>
  );
};

/** Desktop Navigation Links */
const NavLinks = () => (
  <>
    {menuItems.map(({ title, path }) => (
      <Tooltip title={title} arrow key={title}>
        <Link component={NavLink} to={path} underline="none" sx={navLinkStyles}>
          <Typography>{title}</Typography>
        </Link>
      </Tooltip>
    ))}
  </>
);

/** Authentication Section (Profile/Sign Up) */
const AuthSection = ({ name, navigate }: any) =>
  name ? (
    <Box display="flex" alignItems="center" gap={2}>
      <Tooltip title="Notifications" arrow>
        <Link
          component={NavLink}
          to="/notification"
          sx={{ textDecoration: "none" }}
        >
          <Badge badgeContent={2} color="error">
            <NotificationsIcon sx={iconStyles} />
          </Badge>
        </Link>
      </Tooltip>

      {/* Profile - Redirects to /profile on click */}
      <Tooltip title="Profile" arrow>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            cursor: "pointer",
          }}
          onClick={() => navigate("/profile")}
        >
          <Avatar src={profile} sx={{ bgcolor: "#ffffff" }} />
          <Typography sx={{ color: "#000", fontWeight: "bold" }}>
            {name}
          </Typography>
        </Box>
      </Tooltip>
    </Box>
  ) : (
    <Tooltip title="Sign Up" arrow>
      <Link
        component={NavLink}
        to="/auth/register"
        underline="none"
        sx={{
          ...navLinkStyles,
          backgroundColor: "black",
          color: "white",
          padding: "8px",
          borderRadius: "10px",
        }}
      >
        <Typography>Sign Up</Typography>
      </Link>
    </Tooltip>
  );

/** Navigation Menu Items */
const menuItems = [
  { title: "Home", path: "/" },
  { title: "Consult", path: "/consult" },
  { title: "Appointments", path: "/appointments" },
  { title: "Help", path: "/help" },
];

/** Styles */
const navLinkStyles = {
  color: "#000",
  fontWeight: "900",
  textTransform: "uppercase",
  fontSize: "14px",
  "&.active": { color: "#3CBDED", fontWeight: "bold" },
  "&:hover": { color: "#3CBDED" },
};

const iconStyles = {
  fontSize: "32px",
  cursor: "pointer",
  color: "#000",
  transition: "color 0.3s ease-in-out",
  "&:hover": { color: "#3CBDED" },
};

const logoStyles = {
  fontFamily: "'Concert One', sans-serif",
  fontWeight: 800,
  color: "#3CBDED",
  fontSize: "20px",
  lineHeight: 1,
};

const logoStylesDark = {
  fontFamily: "'Concert One', sans-serif",
  fontWeight: 800,
  color: "#1E293B",
  fontSize: "20px",
  lineHeight: 1,
};

export default Navbar;
