import { useState, useCallback, useEffect } from "react";
import { FormTextField, FormSelectField, AlertToast } from "../../components";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  postRealEstate,
  clearAlert,
} from "../../features/realEstateOwner/realEstateOwnerSlice";

import postRealEstateImg from "../../assets/images/postRealEstateImg.svg";
import postRealEstateImg2 from "../../assets/images/postRealEstateImg2.svg";
import postRealEstateImg3 from "../../assets/images/postRealEstateImg3.svg";

import {
  Button,
  CircularProgress,
  TextField,
  InputAdornment,
} from "@mui/material";
import { locationNames } from "../../utils/locationNames";
import InfoIcon from "@mui/icons-material/Info";
import BungalowIcon from "@mui/icons-material/Bungalow";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PermMediaIcon from "@mui/icons-material/PermMedia";

const PostRealEstate = () => {
  const { alertFlag, alertMsg, alertType, isLoading, postSuccess, realEstate } =
    useSelector((store) => store.realEstateOwner);

  const initialFormValues = {
    title: "",
    price: "",
    description: "",
    location: "",
    streetName: "",
    category: "",
    area: "",
    floors: "",
    facing: "",
  };

  const [values, setFormValues] = useState(initialFormValues);

  const [images, setImages] = useState(null);

  const handleImagesChange = (e) => {
    const arr = Array.from(e.target.files);
    setImages(arr.map((file) => URL.createObjectURL(file)));
  };

  const previewImage = () => {
    if (images) {
      return images.map((image, index) => {
        return (
          <div className="p-2" key={index}>
            <img src={image} alt="profilePreview" className="h-24 md:h-28" />
          </div>
        );
      });
    }
  };

  const handleChange = useCallback(
    (e) => {
      setFormValues({ ...values, [e.target.name]: e.target.value });
    },
    [values]
  );

  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();

    const form = document.getElementById("form");
    const formData = new FormData(form);
    dispatch(postRealEstate({ formData }));
  };

  const handleClose = useCallback(
    (event, reason) => {
      if (reason === "clickaway") {
        return;
      }
      dispatch(clearAlert());
    },
    [dispatch]
  );

  const navigate = useNavigate();

  // Redirect to detail page of the property after successful posting
  useEffect(() => {
    if (postSuccess) {
      const timer = setTimeout(() => {
        navigate(`/owner/real-estate/${realEstate?.slug}`);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [postSuccess, navigate, realEstate]);

  return (
    <div>
      <main className="px-6 h-full mt-7">
        <div className="flex lg:justify-between justify-center flex-wrap h-full g-6">
          <div className="lg:w-5/12 md:w-8/12 mb-12">
            <form onSubmit={handleSubmit} id="form">
              <div className="flex flex-col justify-center items-center mt-3 mb-4">
                <h3 className="font-heading font-bold">Post your Property </h3>
                <p className="text-gray-400 text-sm">
                  Enter the details of your property
                </p>
              </div>
              <div className="flex flex-wrap flex-col gap-2 ml-5">
                <div className="flex flex-col gap-4 my-2">
                  <h5 className="mb-1">
                    <InfoIcon /> Initial Details
                  </h5>
                  <FormTextField
                    label="Title"
                    name="title"
                    type={"text"}
                    value={values.title}
                    handleChange={handleChange}
                    autoFocus={true}
                  />
                  <TextField
                    label="Description"
                    required
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
                    placeholder="Rent per month"
                    required
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
                    required
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
                    required
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
                  <TextField
                    label="City"
                    color="tertiary"
                    disabled
                    value="Kathmandu"
                  />
                </div>
                <div className="flex flex-col my-2">
                  <h5>
                    <PermMediaIcon /> Media
                  </h5>
                  <div className="flex flex-col justify-center pb-2">
                    <label
                      htmlFor="formFileMultiple"
                      className="form-label inline-block mb-2 text-gray-500 cursor-pointer font-robotoNormal"
                    >
                      Upload Images of the Real Estate
                    </label>

                    <input
                      required
                      name="realEstateImages"
                      className="form-control block font-robotoNormal w-full px-3 py-1.5 text-base font-normal border border-solid border-gray-300 rounded cursor-pointer focus:border-tertiary focus:outline-none"
                      type="file"
                      id="formFileMultiple"
                      multiple
                      onChange={handleImagesChange}
                    />
                    <p className="mt-1 text-xs text-gray-400">
                      JPG, JPEG, PNG or GIF (MAX 3.5mb per)
                    </p>
                  </div>
                  <div className="flex flex-wrap self-center border mt-2">
                    {previewImage()}
                  </div>
                </div>
              </div>

              <div className="text-center mt-2">
                <Button
                  disabled={isLoading || (alertFlag && alertType === "success")}
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
                      size={26}
                      sx={{
                        color: "#fff",
                      }}
                    />
                  ) : (
                    "Post"
                  )}
                </Button>
              </div>
            </form>
          </div>
          <div className="hidden grow-0 shrink-1 md:shrink-0 basis-auto w-5/12 mb-12 lg:block">
            <img
              src={postRealEstateImg}
              className="w-full"
              alt="Cartoon of a person holding a card"
            />
            <img
              src={postRealEstateImg2}
              className="w-full"
              alt="Cartoon of a person holding a card"
            />
            <img
              src={postRealEstateImg3}
              className="w-full"
              alt="Cartoon of a person holding a card"
            />
          </div>
        </div>
      </main>

      <AlertToast
        alertFlag={alertFlag}
        alertMsg={alertMsg}
        alertType={alertType}
        handleClose={handleClose}
      />
    </div>
  );
};

export default PostRealEstate;
