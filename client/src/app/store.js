import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import realEstateOwnerReducer from "../features/realEstateOwner/realEstateOwnerSlice";
import realEstateTenantReducer from "../features/realEstateTenant/realEstateTenantSlice";
import tenantUserReducer from "../features/tenantUser/tenantUserSlice";
import ownerUserReducer from "../features/ownerUser/ownerUserSlice";
import rentDetailOwnerReducer from "../features/rentDetailOwner/rentDetailOwnerSlice";
import rentDetailTenantReducer from "../features/rentDetailTenant/rentDetailTenantSlice";

export default configureStore({
  reducer: {
    auth: authReducer,
    tenantUser: tenantUserReducer,
    ownerUser: ownerUserReducer,
    realEstateOwner: realEstateOwnerReducer,
    realEstateTenant: realEstateTenantReducer,
    rentDetailOwner: rentDetailOwnerReducer,
    rentDetailTenant: rentDetailTenantReducer,
  },
});
