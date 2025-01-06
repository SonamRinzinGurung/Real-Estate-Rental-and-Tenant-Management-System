import React from "react";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
const FormSelectField = ({ label, value, name, options, handleChange }) => {
  return (
    <TextField
      select
      required
      label={label}
      value={value}
      onChange={handleChange}
      name={name}
      color="tertiary"
    >
      {options.map((option) => (
        <MenuItem key={option} value={option}>
          {option}
        </MenuItem>
      ))}
    </TextField>
  );
};

export default FormSelectField;
