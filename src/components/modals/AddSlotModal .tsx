import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  MenuItem,
  Select,
  TextField,
  FormHelperText,
  FormControl,
  InputLabel,
  Box,
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { businessAxios } from "../../api/axiosInstance";

// Type Definitions
interface AddSlotFormValues {
  appointmentDay: number; // ✅ Fix: Use `number` instead of `int`
  appointmentTime: string;
}

interface AddSlotModalProps {
  slotopen: boolean;
  handleCloseAddSlot: () => void;
}

const AddSlotModal: React.FC<AddSlotModalProps> = ({ slotopen, handleCloseAddSlot }) => {
  // Days Enum (Matching Backend)
  const days: string[] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

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
      handleCloseAddSlot()
    },
    onError: (err: any) => {
      toast.error(err || "Failed to add slot.");
    },
  });

  // Formik Setup
  const formik = useFormik<AddSlotFormValues>({
    initialValues: {
      appointmentDay: 0, // ✅ Default to index 0 (Monday)
      appointmentTime: "",
    },
    validationSchema: Yup.object({
      appointmentDay: Yup.number().required("Appointment day is required."), // ✅ Fix: Use number
      appointmentTime: Yup.string()
        .matches(/^(0[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/, "Invalid time format. Use 'hh:mm AM/PM'")
        .required("Appointment time is required."),
    }),
    onSubmit: async (values) => {
      slotAddMutation.mutate(values);
    },
  });

  return (
    <Dialog open={slotopen} onClose={handleCloseAddSlot} fullWidth maxWidth="sm">
      <DialogTitle>Add a New Slot</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={formik.handleSubmit} sx={{ p: 2 }}>
          {/* Select Appointment Day */}
          <FormControl fullWidth sx={{ mb: 2 }} error={formik.touched.appointmentDay && Boolean(formik.errors.appointmentDay)}>
            <InputLabel>Appointment Day</InputLabel>
            <Select
              name="appointmentDay"
              value={formik.values.appointmentDay}
              onChange={(event) => {
                const selectedIndex = Number(event.target.value); // ✅ Ensure we pass the index
                formik.setFieldValue("appointmentDay", selectedIndex);
              }}
              onBlur={formik.handleBlur}
            >
              {days.map((day, index) => (
                <MenuItem key={day} value={index}>
                  {day} {/* Display day name, but store index */}
                </MenuItem>
              ))}
            </Select>
            {formik.touched.appointmentDay && <FormHelperText>{formik.errors.appointmentDay}</FormHelperText>}
          </FormControl>

          {/* Appointment Time Input */}
          <TextField
            fullWidth
            label="Appointment Time"
            name="appointmentTime"
            placeholder="hh:mm AM/PM"
            value={formik.values.appointmentTime}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.appointmentTime && Boolean(formik.errors.appointmentTime)}
            helperText={formik.touched.appointmentTime && formik.errors.appointmentTime}
            sx={{ mb: 2 }}
          />

          {/* Submit Button */}
          <Button type="submit" variant="contained" sx={{ backgroundColor: "#000000" }} fullWidth disabled={slotAddMutation.isPending }>
            {slotAddMutation.isPending  ? "Loading..." : "Add Slot"}
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
