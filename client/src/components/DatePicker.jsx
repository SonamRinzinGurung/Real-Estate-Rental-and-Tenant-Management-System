import TextField from "@mui/material/TextField";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useCallback } from "react";

const DatePickerMUI = ({ value, handleChange, label, views }) => {
  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <DatePicker
        label={label}
        value={value}
        views={views}
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
