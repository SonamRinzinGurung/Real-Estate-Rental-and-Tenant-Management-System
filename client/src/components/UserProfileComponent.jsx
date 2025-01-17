import { useState, useCallback, useEffect } from "react";
import { FormTextField, CountrySelectField } from "../components";
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
  city,
  country,
  phoneNumber,
  dateOfBirth,
  gender,
  isProcessing,
}) => {

  const initialValues = {
    firstName,
    lastName,
    email,
    address,
    city,
    country,
    phoneNumber,
    dateOfBirth,
    gender,
  }

  const [values, setFormValues] = useState(initialValues);
  const [hasChanged, setHasChanged] = useState(false);

  useEffect(() => {
    const hasChanged = Object.keys(initialValues).some(key => initialValues[key] !== values[key]);
    setHasChanged(hasChanged);
  }, [values, initialValues]);

  const handleChange = useCallback(
    (e) => {
      setFormValues({ ...values, [e.target.name]: e.target.value });
    },
    [values]
  );

  const options = ["Male", "Female", "Other"];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 justify-center">
        <div className="flex flex-col gap-6 border p-4">
          <div>
            <p className="font-heading text-xl">Personal Information</p>
          </div>
          <div className="flex flex-wrap gap-6">
            <TextField
              label="Email"
              type={"email"}
              value={email}
              color="tertiary"
              disabled
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
              sx={{
                width: "222px",
              }}
            >
              {options.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </div>
        </div>


        <div className="flex flex-col gap-6 border p-4">
          <div>
            <p className="font-heading text-xl">Address Information</p>
          </div>
          <div className="flex flex-wrap gap-6">

            <FormTextField
              label="Address"
              name="address"
              type={"text"}
              value={values?.address}
              handleChange={handleChange}
            />
            <FormTextField
              label="City"
              name="city"
              type={"text"}
              value={values?.city}
              handleChange={handleChange}
            />
            <div className="w-56">
              <CountrySelectField
                handleChange={handleChange}
                value={values?.country}
                setFormValues={setFormValues}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="mb-10">
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
            // width: "25%",
          }}
          disabled={!hasChanged}
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
    </div>
  );
};

export default UserProfileComponent;
