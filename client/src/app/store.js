import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import realEstateReducer from "../features/realEstate/realEstateSlice";

export default configureStore({
  reducer: {
    auth: authReducer,
    realEstate: realEstateReducer,
  },
});
