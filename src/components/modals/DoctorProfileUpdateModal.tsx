import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { businessAxios } from "../../api/axiosInstance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// Interface for Doctor Data
interface Doctor {
  id: string;
  phone?: string;
  about?: string;
  field_experience?: number;
  qualification?: string;
  gender?: string;
  profile?: string | File | null; // Profile can be a URL or a File object
}

// Props Interface for Modal Component
interface DoctorProfileUpdateProps {
  open: boolean;
  handleClose: () => void;
  doctor: Doctor;
}

// Validation Schema using Yup
const validationSchema = Yup.object({
  phone: Yup.string()
    .matches(/^\d{10,15}$/, "Phone must contain only 10-15 digits")
    .nullable(),
  about: Yup.string()
    .max(500, "About section cannot exceed 500 characters")
    .nullable(),
  field_experience: Yup.number()
    .min(0, "Experience must be a positive number")
    .nullable(),
  qualification: Yup.string()
    .max(100, "Qualification cannot exceed 100 characters")
    .nullable(),
  gender: Yup.string()
    .oneOf(["Male", "Female", "Other"], "Invalid gender selection")
    .nullable(),
});

const DoctorProfileUpdateModal: React.FC<DoctorProfileUpdateProps> = ({
  doctor,
  open,
  handleClose,
}) => {
  const [preview, setPreview] = useState<string | null>(null);

  // Set initial preview (use doctor.profile if it's a string URL)
  useEffect(() => {
    if (typeof doctor.profile === "string") {
      setPreview(doctor.profile);
    }
  }, [doctor.profile]);

  const handleSubmit = async (values: Doctor) => {
    const formData = new FormData();
    if (values.phone) formData.append("phone", values.phone);
    if (values.about) formData.append("about", values.about);
    if (values.field_experience)
      formData.append("field_experience", values.field_experience.toString());
    if (values.qualification)
      formData.append("qualification", values.qualification);
    if (values.gender) formData.append("gender", values.gender);
    if (values.profile && values.profile instanceof File) {
      formData.append("profile", values.profile);
    }

    try {
      const res = await businessAxios.patch("/DoctorView/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data.data;
    } catch (error) {
      console.error("Profile update failed", error);
      throw new Error("Profile update failed. Try again.");
    }
  };

  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: handleSubmit,
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["dr"] });
      toast.success(data, {
        duration: 2000,
        onAutoClose: () => handleClose(),
      });
    },
    onError: (err: any) => {
      toast.error(err.message || "Something went wrong.");
    },
  });

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Update Doctor Profile</DialogTitle>
      <DialogContent>
        <Formik
          initialValues={{
            id: doctor.id,
            phone: doctor.phone || "",
            about: doctor.about || "",
            field_experience: doctor.field_experience || 0,
            qualification: doctor.qualification || "",
            gender: doctor.gender || "",
            profile: null, // Always null initially to allow file uploads
          }}
          validationSchema={validationSchema}
          onSubmit={updateMutation.mutate}
        >
          {({ values, errors, touched, handleChange, setFieldValue }) => (
            <Form>
              {/* Phone */}
              <TextField
                fullWidth
                label="Phone Number"
                name="phone"
                value={values.phone}
                onChange={handleChange}
                error={touched.phone && Boolean(errors.phone)}
                helperText={touched.phone && errors.phone}
                margin="normal"
              />

              {/* About */}
              <TextField
                fullWidth
                label="About"
                name="about"
                multiline
                rows={3}
                value={values.about}
                onChange={handleChange}
                error={touched.about && Boolean(errors.about)}
                helperText={touched.about && errors.about}
                margin="normal"
              />

              {/* Qualification */}
              <TextField
                fullWidth
                label="Qualification"
                name="qualification"
                value={values.qualification}
                onChange={handleChange}
                error={touched.qualification && Boolean(errors.qualification)}
                helperText={touched.qualification && errors.qualification}
                margin="normal"
              />

              {/* Experience */}
              <TextField
                fullWidth
                type="number"
                label="Years of Experience"
                name="field_experience"
                value={values.field_experience}
                onChange={handleChange}
                error={
                  touched.field_experience && Boolean(errors.field_experience)
                }
                helperText={touched.field_experience && errors.field_experience}
                margin="normal"
              />

              {/* Gender */}
              <FormControl fullWidth margin="normal">
                <InputLabel>Gender</InputLabel>
                <Select
                  name="gender"
                  value={values.gender}
                  onChange={handleChange}
                  error={touched.gender && Boolean(errors.gender)}
                >
                  <MenuItem value="">Select Gender</MenuItem>
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>

              {/* Profile Picture */}
              <input
                type="file"
                name="profile"
                accept="image/*"
                onChange={(event) => {
                  const file = event.currentTarget.files?.[0];
                  setFieldValue("profile", file);

                  if (file) {
                    const objectUrl = URL.createObjectURL(file);
                    setPreview(objectUrl);
                  }
                }}
                style={{ display: "block", margin: "15px 0" }}
              />

              {/* Show preview */}
              {preview && (
                <Avatar
                  src={preview}
                  sx={{ width: 100, height: 100, marginBottom: 2 }}
                />
              )}

              <DialogActions>
                <Button onClick={handleClose} color="secondary">
                  Cancel
                </Button>

                {/* Updated Submit Button */}
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    backgroundColor: "#000",
                    color: "#fff",
                    ":hover": { backgroundColor: "#333" },
                    minWidth: 120,
                  }}
                  disabled={updateMutation.isPending} // Disable while loading
                >
                  {updateMutation.isPending ? (
                    <CircularProgress size={24} sx={{ color: "white" }} />
                  ) : (
                    "Update Profile"
                  )}
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default DoctorProfileUpdateModal;
