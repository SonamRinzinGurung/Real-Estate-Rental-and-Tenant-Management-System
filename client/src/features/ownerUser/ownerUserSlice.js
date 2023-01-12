import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosFetch from "../../utils/axiosCreate";

export const getProfileDetails = createAsyncThunk(
  "getOwnerProfileDetails",
  async (arg, thunkAPI) => {
    try {
      const { data } = await axiosFetch.get("/owner/profile");
      return await data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.msg);
    }
  }
);

const ownerUserSlice = createSlice({
  name: "ownerUser",
  initialState: {
    user: null,
    isLoading: false,
    alertFlag: false,
    alertMsg: "",
    alertType: null,
  },
  reducers: {
    clearAlert: (state) => {
      state.alertFlag = false;
      state.alertMsg = "";
      state.alertType = null;
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
      })
      .addCase(getProfileDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.alertFlag = true;
        state.alertMsg = action.payload;
        state.alertType = "error";
      });
  },
});

export const { clearAlert } = ownerUserSlice.actions;

export default ownerUserSlice.reducer;
