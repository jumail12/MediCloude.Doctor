import {
    Box,
    Button,
    TextField,
    Typography,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
  } from "@mui/material";
  import { useMutation, useQuery } from "@tanstack/react-query";
  import { authAxios, businessAxios } from "../../api/axiosInstance";
  import { useFormik } from "formik";
  import * as Yup from "yup";
  import { toast } from "sonner";
  import { useNavigate } from "react-router-dom";
  
  // Custom Styles for TextFields & Select
  const textFieldStyles = {
    color: "#000000",
    backgroundColor: "#F4F9FC",
    fontFamily: "Convergence",
    fontSize: "14px",
    width: "100%",
    "& .MuiInputBase-root": {
      height: "45px",
    },
    "& .MuiOutlinedInput-input": {
      padding: "12px",
    },
    "& .MuiInputLabel-root": {
      color: "#B3B4B5",
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "#000000",
    },
  };
  
  const VerifyLicenseContainer = () => {
    const navigate = useNavigate(); // ✅ Moved inside component
  
    const email = localStorage.getItem("email");
  
    // Fetching Specializations
    const { data: specializations = [], isPending: loading } = useQuery({
      queryKey: ["specializations"],
      queryFn: async () => {
        const res = await businessAxios.get("/Specialization/all");
        return res.data.data;
      },
    });
  
    // Mutation for Verifying License
    const verifyLicenseMutation = useMutation({
      mutationFn: async ({
        medical_license_number,
        specialization_id,
      }: {
        medical_license_number: string;
        specialization_id: string;
      }) => {
        const res = await authAxios.patch("/DoctorAuth/verify-license", {
          email,
          specialization_id,
          medical_license_number,
        });
        return res.data.data;
      },
      onSuccess: (data: any) => {
        toast.success(data, {
            duration: 3000, 
            onAutoClose: () => navigate("/auth/login"),
          });
      },
      onError: (error: any) => {
        toast.error(error || "Verification failed!");
      },
    });
  
    // Validation Schema
    const validationSchema = Yup.object().shape({
      medical_license_number: Yup.string()
        .matches(
          /^[A-Z]{2,3}\/?\d{5,7}\/?\d{4}$/,
          "Invalid format. Example: MH/12345/2020 or TN67890/2015"
        )
        .required("License number is required"),
      specialization_id: Yup.string().required("Please select a specialization"),
    });
  
    // Formik for Handling Form Submission
    const formik = useFormik({
      initialValues: {
        medical_license_number: "",
        specialization_id: "",
      },
      validationSchema: validationSchema,
      onSubmit: async (values) => {
        verifyLicenseMutation.mutate(values);
      },
    });
  
    return (
      <Box
        sx={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "20px",
          backgroundColor: "#F8F9FA",
        }}
      >
        {/* Parent Box for Main Layout */}
        <Box
          sx={{
            width: { xs: "90%", md: "1130px" },
            height: "600px",
            backgroundColor: "#ffffff",
            borderRadius: "12px",
            boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.1)",
            display: "flex",
            overflow: "hidden",
            flexDirection: { xs: "column", md: "row" },
          }}
        >
          {/* Left Section (Header & Description) */}
          <Box
            sx={{
              width: { xs: "100%", md: "40%" },
              backgroundColor: "#F4F4F4",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: "40px",
              textAlign: "center",
            }}
          >
            {/* Header Title */}
            <Typography variant="h4" fontWeight="bold" color="#000">
              License Verification
            </Typography>
  
            {/* Description */}
            <Typography variant="body1" color="#555" mt={2} fontSize="16px">
              Your data will be validated by our team to ensure accuracy and
              authenticity. Once verified, you will receive a confirmation email
              with further details. After successful verification, you will be
              eligible to provide medical services as a registered doctor on our
              platform.
            </Typography>
          </Box>
  
          {/* Right Section (Form) */}
          <Box
            sx={{
              width: { xs: "100%", md: "60%" },
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: "40px",
            }}
          >
            {/* Title */}
            <Typography variant="h5" fontWeight="bold" color="#000000" mb={2}>
              Enter Your Details
            </Typography>
  
            {/* Specialization Dropdown */}
            <FormControl
              fullWidth
              error={
                formik.touched.specialization_id &&
                Boolean(formik.errors.specialization_id)
              }
              sx={{ ...textFieldStyles, mb: 2 }}
            >
              <InputLabel>Select Specialization</InputLabel>
              <Select
                name="specialization_id"
                value={formik.values.specialization_id}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                {loading ? (
                  <MenuItem disabled>Loading...</MenuItem>
                ) : (
                  specializations.map(
                    (specialization: { id: string; category: string }) => (
                      <MenuItem key={specialization.id} value={specialization.id}>
                        {specialization.category}
                      </MenuItem>
                    )
                  )
                )}
              </Select>
              <Typography variant="body2" color="error">
                {formik.touched.specialization_id &&
                  formik.errors.specialization_id}
              </Typography>
            </FormControl>
  
            {/* License Number Input */}
            <TextField
              label="Medical License Number"
              variant="outlined"
              fullWidth
              name="medical_license_number"
              value={formik.values.medical_license_number}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.medical_license_number &&
                Boolean(formik.errors.medical_license_number)
              }
              helperText={
                formik.touched.medical_license_number &&
                formik.errors.medical_license_number
              }
              sx={{ ...textFieldStyles, mb: 3 }}
            />
  
            {/* Submit Button */}
            <Button
              variant="contained"
              onClick={() => formik.handleSubmit()}
              disabled={verifyLicenseMutation.isPending}
              fullWidth
              sx={{
                backgroundColor: "#000000",
                color: "#ffffff",
                "&:hover": { backgroundColor: "#333333" },
                padding: "12px",
                fontSize: "16px",
                fontWeight: "bold",
                borderRadius: "5px",
                transition: "all 0.3s ease",
              }}
            >
              {verifyLicenseMutation.isPending
                ? "Verifying..."
                : "Verify License"}
            </Button>
          </Box>
        </Box>
      </Box>
    );
  };
  
  export default VerifyLicenseContainer;
  