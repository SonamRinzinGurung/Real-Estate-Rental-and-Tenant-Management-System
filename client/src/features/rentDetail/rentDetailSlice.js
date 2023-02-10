import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosFetch from "../../utils/axiosCreate";

export const createRentDetail = createAsyncThunk(
  "createRentDetail",
  async ({ formData }, thunkAPI) => {
    try {
      const { data } = await axiosFetch.post(
        "/rentDetail/createDetail",
        formData
      );
      return await data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.msg);
    }
  }
);

const rentDetailSlice = createSlice({
  name: "rentDetail",
  initialState: {
    rentDetail: null,
    success: null,
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
      .addCase(createRentDetail.pending, (state, action) => {
        state.isProcessing = true;
      })
      .addCase(createRentDetail.fulfilled, (state, action) => {
        state.isProcessing = false;
        state.success = action.payload.success;
        state.alertFlag = true;
        state.alertMsg = action.payload.msg;
        state.alertType = "success";
      })
      .addCase(createRentDetail.rejected, (state, action) => {
        state.isProcessing = false;
        state.alertFlag = true;
        state.alertMsg = action.payload;
        state.alertType = "error";
      });
  },
});

export const { clearAlert } = rentDetailSlice.actions;
export default rentDetailSlice.reducer;
