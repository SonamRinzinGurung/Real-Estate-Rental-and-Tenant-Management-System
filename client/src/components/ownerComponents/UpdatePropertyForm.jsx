import { useState, useCallback } from "react";
import { FormTextField, FormSelectField } from "../../components";
import { Button } from "@mui/material";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import { locationNames } from "../../utils/locationNames";
import InfoIcon from "@mui/icons-material/Info";
import BungalowIcon from "@mui/icons-material/Bungalow";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CircularProgress from "@mui/material/CircularProgress";

const UpdatePropertyForm = ({
  title,
  description,
  price,
  category,
  area,
  floors,
  facing,
  address,
  isProcessing,
}) => {
  const initialFormValues = {
    price,
    description,
    location: address?.location,
    streetName: address?.streetName,
    category,
    area,
    floors,
    facing,
  };
  const [values, setFormValues] = useState(initialFormValues);

  const handleChange = useCallback(
    (e) => {
      setFormValues({ ...values, [e.target.name]: e.target.value });
    },
    [values]
  );
  return (
    <>
      <div className="flex flex-wrap flex-col gap-2 ml-5">
        <div className="flex flex-col gap-4 my-2">
          <h5 className="mb-1">
            <InfoIcon /> Initial Details
          </h5>
          <TextField label="Title" color="tertiary" disabled value={title} />
          <TextField
            label="Description"
            multiline
            rows={4}
            color="tertiary"
            placeholder="Description of your property"
            name="description"
            value={values.description}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col gap-4 my-2">
          <h5 className="mb-1">
            <BungalowIcon /> Property Info
          </h5>
          <TextField
            label="Price"
            name="price"
            type="number"
            placeholder="Price"
            value={values.price}
            color="tertiary"
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">Rs.</InputAdornment>
              ),
            }}
          />
          <FormSelectField
            label="Category"
            name="category"
            options={[
              "House",
              "Apartment",
              "Room",
              "Shop Space",
              "Office Space",
            ]}
            value={values.category}
            handleChange={handleChange}
          />

          <TextField
            label="Area"
            name="area"
            type="number"
            placeholder="Area of the property"
            value={values.area}
            color="tertiary"
            onChange={handleChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">sq. feet</InputAdornment>
              ),
            }}
          />
          <TextField
            label="Floors"
            name="floors"
            type="number"
            placeholder="Number of floors"
            value={values.floors}
            color="tertiary"
            onChange={handleChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">floors</InputAdornment>
              ),
            }}
          />
          <FormSelectField
            label="Property Facing"
            name="facing"
            options={[
              "North",
              "South",
              "East",
              "West",
              "North-East",
              "North-West",
              "South-East",
              "South-West",
            ]}
            value={values.facing}
            handleChange={handleChange}
          />
        </div>
        <div className="flex flex-col gap-4 my-2">
          <h5 className="mb-1">
            <LocationOnIcon /> Address
          </h5>
          <FormSelectField
            label="Location"
            name="location"
            options={locationNames}
            value={values.location}
            handleChange={handleChange}
          />
          <FormTextField
            label="Street Name / Landmark"
            name="streetName"
            type={"text"}
            value={values.streetName}
            handleChange={handleChange}
          />
          <TextField label="City" color="tertiary" disabled value="Kathmandu" />
        </div>
      </div>

      <div className="text-center mt-2">
        <Button
          disabled={isProcessing}
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
            "Update"
          )}
        </Button>
      </div>
    </>
  );
};

export default UpdatePropertyForm;
