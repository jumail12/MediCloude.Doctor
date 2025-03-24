import { Box } from '@mui/material'
import ResetPwForm from '../../components/auth/ResetPwForm'
import * as yup from "yup";
import { useMutation } from "@tanstack/react-query";

import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { authAxios } from '../../api/axiosInstance';

const ResetPwContainer = () => {
    const validationSchema = yup.object({
        password: yup
          .string()
          .min(6, "Password should be of minimum 6 characters length")
          .matches(
            /^(?=.*[A-Za-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            "Password must contain at least one letter, one capital letter, one number, and one special character."
          )
          .required("Password is required"),
        confirmPassword: yup
          .string()
          .oneOf([yup.ref("password"), undefined], "Passwords must match")
          .required("Confirm password is required"),
      });
    
      const navigator = useNavigate();
    
      const { mutate, isPending } = useMutation({
        mutationFn: async (password: string) => {
          const email = localStorage.getItem("email");
          const res = await authAxios.patch(
            `/DoctorAuth/reset-password`,{
                email,
                new_password:password
            }
          );
          return res.data.data;
        },
        onSuccess: (data:any) => {
          toast.success(data, {
            duration: 3000, 
            onAutoClose: () => navigator("/auth/login"),
          });
        },
        onError: (err: any) => {
          toast.error(err);
        },
      });
    
      const formik = useFormik({
        initialValues: {
          password: "",
          confirmPassword: "",
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
          mutate(values.password);
        },
      });
    
  return (
    <Box>
        <ResetPwForm formik={formik} isLoading={isPending}/>
    </Box>
  )
}

export default ResetPwContainer