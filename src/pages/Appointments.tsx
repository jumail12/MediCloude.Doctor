import { Box } from '@mui/material'
import AppointmentsContainer from '../containers/AppointmentsContainer'


const Appointments = () => {
  return (
    <Box
    maxWidth={"1500px"}
    margin="auto"
    minHeight={500}
    padding={2}
    sx={{
      borderRadius: "8px",
      padding: "16px",
      mt: 5,
    }}>
    
        <AppointmentsContainer/>
    </Box>
  )
}

export default Appointments