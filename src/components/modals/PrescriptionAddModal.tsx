import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { businessAxios } from "../../api/axiosInstance";
import { toast } from "sonner";
import { Formik, Form, Field, FormikHelpers } from "formik";
import * as Yup from "yup";

interface PrescriptionProps {
  AppId: string;
  handleClose: () => void;
  open: boolean;
}

interface PrescriptionFormValues {
  prescriptionText: string;
}

const validationSchema = Yup.object().shape({
  prescriptionText: Yup.string()
    .required("Prescription text is required")
    .max(1000, "Prescription cannot exceed 1000 characters"),
});



const PrescriptionAddModal: React.FC<PrescriptionProps> = ({
  AppId,
  handleClose,
  open,
}) => {

    const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async (values: PrescriptionFormValues) => {
      const res = await businessAxios.post(`/Prescription/add-prescription`, {
        appId: AppId,
        prescriptionText: values.prescriptionText,
      });
      return res.data.data;
    },
    onSuccess: (data: any) => {
        queryClient.invalidateQueries({ queryKey: ["app-details"] });
      toast.success(data);
      handleClose();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to add prescription");
    },
  });



  const initialValues: PrescriptionFormValues = {
    prescriptionText: "",
  };

  const handleSubmit = (
    values: PrescriptionFormValues,
    { setSubmitting }: FormikHelpers<PrescriptionFormValues>
  ) => {
    mutate(values);
    setSubmitting(false);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add Prescription</DialogTitle>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form>
            <DialogContent>
              <Box sx={{ mt: 2 }}>
                <Field
                  as={TextField}
                  name="prescriptionText"
                  label="Prescription"
                  multiline
                  rows={6}
                  fullWidth
                  variant="outlined"
                  error={
                    touched.prescriptionText && Boolean(errors.prescriptionText)
                  }
                  helperText={
                    touched.prescriptionText && errors.prescriptionText
                  }
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "primary.main",
                      },
                      "&:hover fieldset": {
                        borderColor: "primary.dark",
                      },
                    },
                  }}
                />
              </Box>
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
              <Button
                onClick={handleClose}
                color="secondary"
                variant="outlined"
                sx={{ mr: 2 }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                color="primary"
                variant="contained"
                disabled={isSubmitting || isPending}
                sx={{
                  bgcolor: "primary.main",
                  "&:hover": {
                    bgcolor: "primary.dark",
                  },
                }}
              >
                {isSubmitting || isPending ? "Saving..." : "Save Prescription"}
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default PrescriptionAddModal;
