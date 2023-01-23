import { useState, useCallback } from "react";
import { FormTextField } from "../components";
import { Button } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { dateFormatter, ageCalculator } from "../utils/valueFormatter";

const UserProfileComponent = ({
  firstName,
  lastName,
  email,
  address,
  phoneNumber,
  dateOfBirth,
  gender,
  isProcessing,
}) => {
  const [values, setFormValues] = useState({
    firstName: firstName,
    lastName: lastName,
    email: email,
    address: address,
    phoneNumber: phoneNumber,
    dateOfBirth: dateOfBirth,
    gender: gender,
  });
  const handleChange = useCallback(
    (e) => {
      setFormValues({ ...values, [e.target.name]: e.target.value });
    },
    [values]
  );

  const options = ["Male", "Female", "Other"];

  return (
    <>
      <div className="flex flex-wrap gap-4 justify-center">
        <TextField
          label="First Name"
          type={"text"}
          value={firstName}
          color="tertiary"
          disabled
        />
        <TextField
          label="Last Name"
          type={"text"}
          value={lastName}
          color="tertiary"
          disabled
        />
        <TextField
          label="Email"
          type={"email"}
          value={email}
          color="tertiary"
          disabled
        />

        <FormTextField
          label="Address"
          name="address"
          type={"text"}
          value={values?.address}
          handleChange={handleChange}
        />
        <FormTextField
          label="Phone Number"
          name="phoneNumber"
          type={"number"}
          value={values?.phoneNumber}
          handleChange={handleChange}
        />

        <TextField
          label="Date Of Birth"
          type="text"
          value={dateFormatter(dateOfBirth)}
          color="tertiary"
          disabled
        />
        <TextField
          label="Age"
          type="text"
          value={ageCalculator(dateOfBirth)}
          color="tertiary"
          disabled
        />
        <TextField
          select
          label="Gender"
          value={values?.gender}
          onChange={handleChange}
          name="gender"
          color="tertiary"
        >
          {options.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
      </div>
      <div className="text-center mt-2 mb-6">
        <Button
          type="submit"
          variant="contained"
          size="large"
          color="primary"
          sx={{
            color: "white",
            "&:hover": {
              backgroundColor: "primary.dark",
              opacity: [0.9, 0.8, 0.7],
            },
            width: "25%",
          }}
        >
          {isProcessing ? (
            <CircularProgress
              size={26}
              sx={{
                color: "#fff",
              }}
            />
          ) : (
            "Save"
          )}
        </Button>
      </div>
    </>
  );
};

export default UserProfileComponent;
