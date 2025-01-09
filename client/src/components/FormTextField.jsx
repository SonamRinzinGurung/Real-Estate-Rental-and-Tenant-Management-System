import React from "react";
import TextField from "@mui/material/TextField";

const FormTextField = ({
  value,
  name,
  type,
  handleChange,
  label,
  autoFocus,
  required = true,
}) => {
  return (
    <TextField
      required={required}
      name={name}
      type={type}
      value={value}
      color="tertiary"
      label={label ? label : name}
      variant="outlined"
      onChange={handleChange}
      autoFocus={autoFocus}
    />
  );
};

export default FormTextField;
