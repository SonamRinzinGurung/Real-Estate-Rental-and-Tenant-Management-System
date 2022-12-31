import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const postRealEstate = createAsyncThunk(
  "postRealEstate",
  async ({ formData }, thunkAPI) => {
    try {
      const { data } = await axios.post("/owner/real-estate", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return await data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.msg);
    }
  }
);
const realEstateSlice = createSlice({
  name: "property",
  initialState: {
    realEstate: null,
    isLoading: false,
    alertFlag: false,
    alertMsg: "",
    alertType: null,
  },
  reducers: {
    clearAlert: (state) => {
      state.alertFlag = false;
      state.alertMsg = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(postRealEstate.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(postRealEstate.fulfilled, (state, action) => {
        state.isLoading = false;
        state.realEstate = action.payload.realEstate;
        state.alertFlag = true;
        state.alertMsg = "Property added successfully";
        state.alertType = "success";
      })
      .addCase(postRealEstate.rejected, (state, action) => {
        state.isLoading = false;
        state.alertFlag = true;
        state.alertMsg = action.payload;
        state.alertType = "error";
      });
  },
});

export const { clearAlert } = realEstateSlice.actions;

export default realEstateSlice.reducer;
