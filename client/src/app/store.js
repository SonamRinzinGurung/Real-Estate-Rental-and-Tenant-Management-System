import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import realEstateOwnerReducer from "../features/realEstateOwner/realEstateOwnerSlice";
import realEstateTenantReducer from "../features/realEstateTenant/realEstateTenantSlice";

export default configureStore({
  reducer: {
    auth: authReducer,
    realEstateOwner: realEstateOwnerReducer,
    realEstateTenant: realEstateTenantReducer,
  },
});
