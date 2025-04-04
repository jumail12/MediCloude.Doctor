import { Box } from "@mui/material";
import NotificationContainer from "../containers/NotificationContainer";

const Notification = () => {
  return (
    <Box
    maxWidth={"1300px"}
    margin="auto"
    minHeight={500}
    padding={2}
    sx={{
      borderRadius: "8px",
      padding: "16px",
      mt: 5,
    }}>
      <NotificationContainer />
    </Box>
  );
};

export default Notification;
