import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosFetch from "../../utils/axiosCreate";

export const getSingleRentDetailTenantView = createAsyncThunk(
  "getSingleRentDetailTenantView",
  async ({ realEstateId }, thunkAPI) => {
    try {
      const { data } = await axiosFetch.get(
        `/rentDetailTenant/${realEstateId}`
      );
      return await data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.msg);
    }
  }
);

const rentDetailTenantSlice = createSlice({
  name: "rentDetailTenant",
  initialState: {
    rentDetail: null,
    allPaymentHistory: null,
    numberOfPages: null,
    isLoading: false,
    alertFlag: false,
    alertMsg: "",
    alertType: null,
    isRentPaid: null,
  },
  reducers: {
    clearAlert: (state) => {
      state.alertFlag = false;
      state.alertMsg = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSingleRentDetailTenantView.pending, (state, action) => {
        state.isLoading = true;
        state.success = null;
      })
      .addCase(getSingleRentDetailTenantView.fulfilled, (state, action) => {
        state.rentDetail = action.payload.rentDetail;
        state.isRentPaid = action.payload.rentStatus;
        state.isLoading = false;
        state.alertFlag = false;
      })
      .addCase(getSingleRentDetailTenantView.rejected, (state, action) => {
        state.isLoading = false;
        state.alertFlag = true;
        state.alertMsg = action.payload;
        state.alertType = "error";
      });
  },
});

export const { clearAlert } = rentDetailTenantSlice.actions;
export default rentDetailTenantSlice.reducer;
