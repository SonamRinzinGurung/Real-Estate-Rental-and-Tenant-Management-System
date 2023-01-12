import TextField from "@mui/material/TextField";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useCallback } from "react";

const DatePickerMUI = ({ value, handleChange }) => {
  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <DatePicker
        label="Date of Birth"
        value={value}
        onChange={handleChange}
        renderInput={useCallback(
          (params) => (
            <TextField {...params} />
          ),
          []
        )}
      />
    </LocalizationProvider>
  );
};

export default DatePickerMUI;
