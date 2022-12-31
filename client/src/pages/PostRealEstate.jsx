import { useState, useCallback } from "react";
import {
  Logo,
  FormTextField,
  FormSelectField,
  AlertToast,
} from "../components";
import { useDispatch, useSelector } from "react-redux";
import {
  postRealEstate,
  clearAlert,
} from "../features/realEstate/realEstateSlice";
import postRealEstateImg from "../assets/images/postRealEstateImg.svg";
import CircularProgress from "@mui/material/CircularProgress";
import { Button } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import { locationNames } from "../utils/locationNames";

const PostRealEstate = () => {
  const { alertFlag, alertMsg, alertType, isLoading } = useSelector(
    (store) => store.realEstate
  );

  const initialFormValues = {
    title: "",
    price: "",
    description: "",
    location: "",
    streetName: "",
    category: "",
    realEstateImages: null,
  };

  const [values, setFormValues] = useState(initialFormValues);

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
    setFormValues(initialFormValues);
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

  return (
    <div>
      <header className="flex m-1 shadow-sm">
        <Logo />
        <div className="flex flex-col justify-center ml-2">
          <h1 className="font-display text-xl md:text-2xl">Rent Manager</h1>
          <p className="text-xs md:text-sm">
            Find and Manage your rentals in one place
          </p>
        </div>
      </header>

      <main className="px-6 h-full mt-7">
        <div className="flex lg:justify-between justify-center items-center flex-wrap h-full g-6">
          <div className="lg:w-5/12 md:w-8/12 mb-12">
            <form onSubmit={handleSubmit} id="form">
              <div className="flex justify-center items-center flex-col mt-3 mb-4">
                <h4 className="">Post your Property </h4>
                <p>Enter the details of your property</p>
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                <FormTextField
                  label="Title"
                  name="title"
                  type={"text"}
                  value={values.title}
                  handleChange={handleChange}
                />
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
                  label="Location"
                  name="location"
                  options={locationNames}
                  value={values.location}
                  handleChange={handleChange}
                />
                <FormTextField
                  label="Street Name"
                  name="streetName"
                  type={"text"}
                  value={values.streetName}
                  handleChange={handleChange}
                />

                <TextField
                  label="Description"
                  multiline
                  rows={3}
                  color="tertiary"
                  placeholder="Description of your property"
                  name="description"
                  value={values.description}
                  onChange={handleChange}
                />

                <FormSelectField
                  label="Category"
                  name="category"
                  options={["House", "Apartment", "Room", "Shop", "Office"]}
                  value={values.category}
                  handleChange={handleChange}
                />

                <IconButton
                  color="primary"
                  aria-label="upload picture"
                  sx={{
                    fontFamily: "Roboto",
                    fontSize: "1rem",
                  }}
                >
                  <label
                    htmlFor="image"
                    className="cursor-pointer text-[#000000dd] mr-1"
                  >
                    Upload Images of the Real Estate
                  </label>
                  <input
                    required
                    hidden
                    id="image"
                    name="realEstateImages"
                    type="file"
                    multiple
                    onChange={(e) =>
                      setFormValues({
                        ...values,
                        realEstateImages: e.target.value,
                      })
                    }
                  />
                  <PhotoCamera color="primary" />
                </IconButton>
              </div>

              <div className="text-center mt-2">
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
                    "Post"
                  )}
                </Button>
              </div>
            </form>
          </div>
          <div className="hidden grow-0 shrink-1 md:shrink-0 basis-auto w-5/12 lg:w-5/12 md:w-5/12 mb-12 sm:block">
            <img
              src={postRealEstateImg}
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
