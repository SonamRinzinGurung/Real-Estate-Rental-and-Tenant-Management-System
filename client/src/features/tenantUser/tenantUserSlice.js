import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosFetch from "../../utils/axiosCreate";

export const getProfileDetails = createAsyncThunk(
  "getTenantProfileDetails",
  async (arg, thunkAPI) => {
    try {
      const { data } = await axiosFetch.get("/tenant/profile");
      return await data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.msg);
    }
  }
);

export const getOwnerUserDetails = createAsyncThunk(
  "getOwnerUserDetails",
  async ({ slug }, thunkAPI) => {
    try {
      const { data } = await axiosFetch.get(`/tenant/owner-user/${slug}`);
      return await data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.msg);
    }
  }
);

export const updateTenantProfile = createAsyncThunk(
  "updateTenantProfile",
  async ({ formValues }, thunkAPI) => {
    try {
      const { data } = await axiosFetch.patch("/tenant/profile", formValues);
      return await data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.msg);
    }
  }
);

export const getContractWithID = createAsyncThunk(
  "getContractWithID",
  async ({ contractId }, thunkAPI) => {
    try {
      const { data } = await axiosFetch.get(
        `/contract/tenantView/${contractId}`
      );
      return await data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.msg);
    }
  }
);

export const approveContract = createAsyncThunk(
  "approveContract",
  async ({ contractId }, thunkAPI) => {
    try {
      const { data } = await axiosFetch.patch(
        `/contract/approve/${contractId}`
      );
      return await data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.msg);
    }
  }
);

export const getContractWithRealEstateID = createAsyncThunk(
  "getContractWithRealEstateID",
  async ({ realEstateId }, thunkAPI) => {
    try {
      const { data } = await axiosFetch.get(`/contract/tenant/${realEstateId}`);
      return await data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.msg);
    }
  }
);

const tenantUserSlice = createSlice({
  name: "tenantUser",
  initialState: {
    user: null,
    realEstates: null,
    contractDetail: null,
    isLoading: false,
    alertFlag: false,
    alertMsg: "",
    alertType: null,
    isProcessing: false,
  },
  reducers: {
    clearAlert: (state) => {
      state.alertFlag = false;
      state.alertMsg = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProfileDetails.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getProfileDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.alertFlag = false;
      })
      .addCase(getProfileDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.alertFlag = true;
        state.alertMsg = action.payload;
        state.alertType = "error";
      })
      .addCase(getOwnerUserDetails.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getOwnerUserDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.realEstates = action.payload.realEstates;
        state.alertFlag = false;
      })
      .addCase(getOwnerUserDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.alertFlag = true;
        state.alertMsg = action.payload;
        state.alertType = "error";
      })
      .addCase(updateTenantProfile.pending, (state, action) => {
        state.isProcessing = true;
      })
      .addCase(updateTenantProfile.fulfilled, (state, action) => {
        state.isProcessing = false;
        state.user = action.payload.user;
        state.alertFlag = true;
        state.alertMsg = "Profile updated successfully";
        state.alertType = "success";
      })
      .addCase(updateTenantProfile.rejected, (state, action) => {
        state.isProcessing = false;
        state.alertFlag = true;
        state.alertMsg = action.payload;
        state.alertType = "error";
      })
      .addCase(getContractWithID.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getContractWithID.fulfilled, (state, action) => {
        state.isLoading = false;
        state.contractDetail = action.payload.contractDetail;
        state.alertFlag = false;
      })
      .addCase(getContractWithID.rejected, (state, action) => {
        state.isLoading = false;
        state.alertFlag = true;
        state.alertMsg = action.payload;
        state.alertType = "error";
      })
      .addCase(approveContract.pending, (state, action) => {
        state.isProcessing = true;
      })
      .addCase(approveContract.fulfilled, (state, action) => {
        state.isProcessing = false;
        state.contractDetail = action.payload.contractDetail;
        state.alertFlag = true;
        state.alertMsg = "Contract approved successfully";
        state.alertType = "success";
      })
      .addCase(approveContract.rejected, (state, action) => {
        state.isProcessing = false;
        state.alertFlag = true;
        state.alertMsg = action.payload;
        state.alertType = "error";
      })
      .addCase(getContractWithRealEstateID.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getContractWithRealEstateID.fulfilled, (state, action) => {
        state.isLoading = false;
        state.contractDetail = action.payload.contractDetail;
        state.alertFlag = false;
      })
      .addCase(getContractWithRealEstateID.rejected, (state, action) => {
        state.isLoading = false;
        state.alertFlag = true;
        state.alertMsg = action.payload;
        state.alertType = "error";
      });
  },
});

export const { clearAlert } = tenantUserSlice.actions;

export default tenantUserSlice.reducer;
