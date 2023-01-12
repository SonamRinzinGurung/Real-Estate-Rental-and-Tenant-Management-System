import { useState, useCallback } from "react";
import { FormTextField } from "../components";
import { Button } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import { dateFormatter, ageCalculator } from "../utils/valueFormatter";
const UserProfileComponent = ({
  firstName,
  lastName,
  email,
  address,
  phoneNumber,
  dateOfBirth,
  gender,
  isLoading,
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
  return (
    <>
      <div className="flex flex-wrap gap-4 justify-center">
        <TextField
          label="First Name"
          name="firstName"
          type={"text"}
          value={firstName}
          color="tertiary"
          disabled
        />
        <TextField
          label="Last Name"
          name="lastName"
          type={"text"}
          value={lastName}
          color="tertiary"
          disabled
        />
        <TextField
          label="Email"
          name="email"
          type={"email"}
          value={email}
          color="tertiary"
          disabled
        />
        <FormTextField
          label="Address"
          name="address"
          type={"text"}
          value={values.address}
          handleChange={handleChange}
        />
        <FormTextField
          label="Phone Number"
          name="phoneNumber"
          type={"number"}
          value={values.phoneNumber}
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
        <FormTextField
          label="Gender"
          name="gender"
          type={"text"}
          value={gender}
        />
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
          {isLoading ? (
            <CircularProgress
              size={22}
              sx={{
                color: "tertiary.dark",
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
