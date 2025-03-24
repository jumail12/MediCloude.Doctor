import { Box } from '@mui/material'
import ForgotPwForm from '../../components/auth/ForgotPwForm'
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { useMutation } from "@tanstack/react-query";

import { toast } from "sonner";
import { useFormik } from "formik";
import { authAxios } from '../../api/axiosInstance';

const ForgotPwContainer = () => {
    const navigate = useNavigate();

  const validationSchema = yup.object({
    email: yup
      .string()
      .email("Enter a valid email")
      .required("Email is required"),
  });

  const {mutate,isPending} = useMutation({
    mutationFn: async ({ email }: { email: string }) => {
      localStorage.setItem("email",email);
     const res= await authAxios.post("/PatientAuth/forgot-password", { email });
     return res.data;
    },
    onSuccess: (data: any) => {
        console.log(data);
        
      toast.success(data.data, {
        duration: 3000, 
        onAutoClose: () => navigate("/auth/verifyotp?type=reset"),
      });
    },
    onError: (error: any) => {
      toast.error(error);
    },
  });

  
  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      mutate(values);
    },
  });


  return (
    <Box>
        <ForgotPwForm formik={formik} isLoading={isPending}/>
    </Box>
  )
}

export default ForgotPwContainer