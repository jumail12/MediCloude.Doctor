import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { businessAxios } from "../../api/axiosInstance";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

// Type Definitions
interface AddSlotFormValues {
  appointmentDate: string; // Change from number to string (YYYY-MM-DD)
  appointmentTime: string;
}

interface AddSlotModalProps {
  slotopen: boolean;
  handleCloseAddSlot: () => void;
}

const AddSlotModal: React.FC<AddSlotModalProps> = ({
  slotopen,
  handleCloseAddSlot,
}) => {
  const queryClient = useQueryClient();

  // Mutation for API Call
  const slotAddMutation = useMutation({
    mutationFn: async (data: AddSlotFormValues) => {
      const res = await businessAxios.post(`/DrAvailability/add-slot`, data);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["slots"] });
      toast.success("Slot added successfully!");
      handleCloseAddSlot();
    },
    onError: (err: any) => {
      toast.error(err || "Failed to add slot.");
    },
  });

  // Formik Setup
  const formik = useFormik<AddSlotFormValues>({
    initialValues: {
      appointmentDate: dayjs().format("YYYY-MM-DD"), // Default to today's date
      appointmentTime: "",
    },
    validationSchema: Yup.object({
      appointmentDate: Yup.string().required("Appointment date is required."), // Ensure date is selected
      appointmentTime: Yup.string()
        .matches(
          /^(0[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/,
          "Invalid time format. Use 'hh:mm AM/PM'"
        )
        .required("Appointment time is required."),
    }),
    onSubmit: async (values) => {
      slotAddMutation.mutate(values);
    },
  });

  return (
    <Dialog
      open={slotopen}
      onClose={handleCloseAddSlot}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>Add a New Slot</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={formik.handleSubmit} sx={{ p: 2 }}>
          {/* Date Picker for Appointment Date */}
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Appointment Date"
              value={dayjs(formik.values.appointmentDate)}
              onChange={(date) => {
                if (date) {
                  formik.setFieldValue(
                    "appointmentDate",
                    date.format("YYYY-MM-DD")
                  );
                }
              }}
              disablePast // Prevent selecting past dates
              slotProps={{
                textField: {
                  fullWidth: true,
                  margin: "normal",
                  error:
                    formik.touched.appointmentDate &&
                    Boolean(formik.errors.appointmentDate),
                  helperText:
                    formik.touched.appointmentDate &&
                    formik.errors.appointmentDate,
                },
              }}
            />
          </LocalizationProvider>

          {/* Appointment Time Input */}
          <TextField
            fullWidth
            label="Appointment Time"
            name="appointmentTime"
            placeholder="hh:mm AM/PM"
            value={formik.values.appointmentTime}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.appointmentTime &&
              Boolean(formik.errors.appointmentTime)
            }
            helperText={
              formik.touched.appointmentTime && formik.errors.appointmentTime
            }
            sx={{ mt: 2 }}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            variant="contained"
            sx={{ backgroundColor: "#000000", mt: 2 }}
            fullWidth
            disabled={slotAddMutation.isPending}
          >
            {slotAddMutation.isPending ? "Loading..." : "Add Slot"}
          </Button>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseAddSlot} color="secondary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddSlotModal;
