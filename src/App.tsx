import { Box } from "@mui/material";
import { Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import ForgotPw from "./pages/auth/ForgotPw";
import VerifyOtp from "./pages/auth/VerifyOtp";
import ResetPw from "./pages/auth/ResetPw";
import VerifyLicense from "./pages/auth/VerifyLicense";

function App() {
  return (
    <Box>
      <Toaster position="top-right" richColors />
      <Routes>
        <Route path="/auth">
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
          <Route path="forgotpw" element={<ForgotPw/>}/>
          <Route path="verifyotp" element={<VerifyOtp/>} />
          <Route path="resetpw" element={<ResetPw/>}/> 
          <Route path="verifylicense" element={<VerifyLicense/>}/>
        </Route>
      </Routes>
    </Box>
  );
}

export default App;
