import { Box } from "@mui/material";
import { Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import ForgotPw from "./pages/auth/ForgotPw";
import VerifyOtp from "./pages/auth/VerifyOtp";
import ResetPw from "./pages/auth/ResetPw";
import VerifyLicense from "./pages/auth/VerifyLicense";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import DrProfile from "./pages/DrProfile";
import NotFoundPage from "./components/NotFoundPage";
import NotificationReceiver from "./components/NotificationReceiver";
import Notification from "./pages/Notification";
import Appointments from "./pages/Appointments";
import AppoinmentById from "./pages/AppoinmentById";
import VideoCall from "./pages/VideoCall";
import Help from "./pages/Help";
import DrDashBoard from "./pages/DrDashBoard";


function App() {
  const location = useLocation();
  const hideNavFot = location.pathname.startsWith("/auth");
  return (
    <Box>
      <Toaster position="top-right" richColors />
      {!hideNavFot && <Navbar />}
      <NotificationReceiver />

      <Routes>
        <Route path="/profile" element={<DrProfile />} />
        <Route path="/" element={<Home />} />
        <Route path="/notification" element={<Notification />} />
        <Route path="/appointments" element={<Appointments />}/>
        <Route path="/appointments/:apid" element={<AppoinmentById/>}/>
        <Route path="/video-call/:vId" element={<VideoCall/>} /> 
        <Route path="*" element={<NotFoundPage />} />
        <Route path="/help" element={<Help/>}/>
        <Route path="/dashboard" element={<DrDashBoard/>}/>

        <Route path="/auth">
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
          <Route path="forgotpw" element={<ForgotPw />} />
          <Route path="verifyotp" element={<VerifyOtp />} />
          <Route path="resetpw" element={<ResetPw />} />
          <Route path="verifylicense" element={<VerifyLicense />} />
        </Route>
      </Routes>
      {!hideNavFot && <Footer />}
    </Box>
  );
}

export default App;
