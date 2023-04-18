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
  async ({ page }, thunkAPI) => {
    try {
      const { data } = await axiosFetch.get(`/owner/real-estate?page=${page}`);
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

export const deleteProperty = createAsyncThunk(
  "deleteProperty",
  async ({ slug }, thunkAPI) => {
    try {
      const { data } = await axiosFetch.delete(
        `/owner/real-estate/delete/${slug}`
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
    isProcessing: false,
    numberOfPages: null,
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
        state.numberOfPages = action.payload.numberOfPages;
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
        state.postSuccess = false;
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
        state.isProcessing = true;
      })
      .addCase(updateRealEstateDetail.fulfilled, (state, action) => {
        state.isProcessing = false;
        state.realEstate = action.payload.updatedRealEstate;
        state.postSuccess = true;
        state.alertFlag = true;
        state.alertMsg = "Property details updated successfully";
        state.alertType = "success";
      })
      .addCase(updateRealEstateDetail.rejected, (state, action) => {
        state.isProcessing = false;
        state.alertFlag = true;
        state.alertMsg = action.payload;
        state.alertType = "error";
      })
      .addCase(deleteProperty.pending, (state) => {
        state.isProcessing = true;
      })
      .addCase(deleteProperty.fulfilled, (state, action) => {
        state.isProcessing = false;
        state.postSuccess = true;
        state.alertFlag = true;
        state.alertMsg = "Property deleted successfully. Redirecting...";
        state.alertType = "success";
      })
      .addCase(deleteProperty.rejected, (state, action) => {
        state.isProcessing = false;
        state.alertFlag = true;
        state.alertMsg = action.payload;
        state.alertType = "error";
      });
  },
});

export const { clearAlert } = realEstateOwnerSlice.actions;

export default realEstateOwnerSlice.reducer;
