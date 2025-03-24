import { Box } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import RegisterForm from "../../components/auth/RegisterForm";
import { authAxios } from "../../api/axiosInstance";

const RegisterContainer = () => {
  const validationSchema = yup.object({
    name: yup
      .string()
      .min(5, "Name should be at least 5 characters long")
      .required("Name is required"),
    email: yup
      .string()
      .email("Enter a valid email")
      .required("Email is required"),
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

  const nav = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: async ({
      name,
      email,
      password,
    }: {
      name: string;
      email: string;
      password: string;
    }) => {
      const res = await authAxios.post("/DoctorAuth/register", {
        doctor_name: name,
        email,
        password,
      });
      localStorage.setItem("email", email);
      return res.data.data;
    },
    onSuccess: (data) => {
      toast.success(data);
      nav("/auth/verifyotp?type=register");
    },
    onError: (err: any) => {
      toast.error(err);
    },
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values: any) => {
      mutate(values);
    },
  });

  return (
    <Box>
      <RegisterForm formik={formik} isLoading={isPending}/>
    </Box>
  );
};

export default RegisterContainer;
