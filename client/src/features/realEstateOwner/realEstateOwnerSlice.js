import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosFetch from "../../utils/axiosCreate";

export const postRealEstate = createAsyncThunk(
  "postRealEstate",
  async ({ formData }, thunkAPI) => {
    try {
      const { data } = await axiosFetch.post("/owner/real-estate", formData);
      return await data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.msg);
    }
  }
);

export const getPersonalRealEstate = createAsyncThunk(
  "getPersonalRealEstate",
  async (arg, thunkAPI) => {
    try {
      const { data } = await axiosFetch.get("/owner/real-estate");
      return await data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.msg);
    }
  }
);

export const getRealEstateDetail = createAsyncThunk(
  "getRealEstateDetail",
  async ({ slug }, thunkAPI) => {
    try {
      const { data } = await axiosFetch.get(`/owner/real-estate/${slug}`);
      return await data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.msg);
    }
  }
);

export const updateRealEstateDetail = createAsyncThunk(
  "updateRealEstateDetail",
  async ({ slug, formValues }, thunkAPI) => {
    try {
      const { data } = await axiosFetch.patch(
        `/owner/real-estate/update/${slug}`,
        formValues
      );
      return await data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.msg);
    }
  }
);

const realEstateOwnerSlice = createSlice({
  name: "property",
  initialState: {
    allRealEstate: null,
    realEstate: null,
    isLoading: false,
    alertFlag: false,
    alertMsg: "",
    alertType: null,
    postSuccess: false,
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
        state.postSuccess = true;
        state.alertFlag = true;
        state.alertMsg = "Property added successfully";
        state.alertType = "success";
      })
      .addCase(postRealEstate.rejected, (state, action) => {
        state.isLoading = false;
        state.alertFlag = true;
        state.alertMsg = action.payload;
        state.alertType = "error";
        state.postSuccess = false;
      })
      .addCase(getPersonalRealEstate.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPersonalRealEstate.fulfilled, (state, action) => {
        state.isLoading = false;
        state.allRealEstate = action.payload.realEstates;
        state.alertFlag = false;
      })
      .addCase(getPersonalRealEstate.rejected, (state, action) => {
        state.isLoading = false;
        state.alertFlag = true;
        state.alertMsg = action.payload;
        state.alertType = "error";
      })
      .addCase(getRealEstateDetail.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getRealEstateDetail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.realEstate = action.payload.realEstate;
        state.alertFlag = false;
      })
      .addCase(getRealEstateDetail.rejected, (state, action) => {
        state.isLoading = false;
        state.alertFlag = true;
        state.alertMsg = action.payload;
        state.alertType = "error";
      })
      .addCase(updateRealEstateDetail.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateRealEstateDetail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.realEstate = action.payload.updatedRealEstate;
        state.alertFlag = true;
        state.alertMsg = "Property details updated successfully";
        state.alertType = "success";
      })
      .addCase(updateRealEstateDetail.rejected, (state, action) => {
        state.isLoading = false;
        state.alertFlag = true;
        state.alertMsg = action.payload;
        state.alertType = "error";
      });
  },
});

export const { clearAlert } = realEstateOwnerSlice.actions;

export default realEstateOwnerSlice.reducer;
