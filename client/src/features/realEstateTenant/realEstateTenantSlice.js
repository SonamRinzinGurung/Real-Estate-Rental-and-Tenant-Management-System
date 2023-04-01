import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosFetch from "../../utils/axiosCreate";

export const getAllRealEstate = createAsyncThunk(
  "getAllRealEstate",
  async ({ page, category, search, priceFilter }, thunkAPI) => {
    try {
      let url = `/tenant/real-estate?page=${page}&category=${category}`;
      if (search) {
        url = url + `&search=${search}`;
      }
      if (priceFilter) {
        url = url + `&priceFilter=${priceFilter}`;
      }
      const { data } = await axiosFetch.get(url);
      return await data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.msg);
    }
  }
);

export const getSingleRealEstate = createAsyncThunk(
  "getSingleRealEstate",
  async ({ slug }, thunkAPI) => {
    try {
      const { data } = await axiosFetch.get(`/tenant/real-estate/${slug}`);
      return await data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.msg);
    }
  }
);

export const saveOrUnSaveRealEstate = createAsyncThunk(
  "saveOrUnSaveRealEstate",
  async ({ id }, thunkAPI) => {
    try {
      const { data } = await axiosFetch.patch(`/tenant/real-estate/save/${id}`);
      localStorage.setItem("user", JSON.stringify(data.updatedUser));
      return await data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.msg);
    }
  }
);

export const getAllSavedRealEstate = createAsyncThunk(
  "getAllSavedRealEstate",
  async (arg, thunkAPI) => {
    try {
      const { data } = await axiosFetch.get("/tenant/real-estate/saved/all");
      return await data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.msg);
    }
  }
);

export const sendEmailToOwner = createAsyncThunk(
  "sendEmailToOwner",
  async ({ formValues }, thunkAPI) => {
    try {
      const { data } = await axiosFetch.post("/sendEmail", formValues);
      return await data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.msg);
    }
  }
);

export const getAllTenantRentalProperties = createAsyncThunk(
  "getAllTenantRentalProperties",
  async (arg, thunkAPI) => {
    try {
      const { data } = await axiosFetch.get(
        "/contract/tenantUser/allRentalProperties"
      );
      return await data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.msg);
    }
  }
);

export const sendComplaintToOwner = createAsyncThunk(
  "sendComplaintToOwner",
  async ({ formValues }, thunkAPI) => {
    try {
      const { data } = await axiosFetch.post("/sendEmail", formValues);
      return await data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.msg);
    }
  }
);

const realEstateTenantSlice = createSlice({
  name: "realEstateTenant",
  initialState: {
    allRealEstate: null,
    realEstate: null,
    isLoading: false,
    alertFlag: false,
    alertMsg: "",
    alertType: null,
    isSaved: null,
    numberOfPages: null,
    isProcessing: false,
    allRentalProperties: null,
    success: null,
  },
  reducers: {
    clearAlert: (state) => {
      state.alertFlag = false;
      state.alertMsg = "";
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(getAllRealEstate.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllRealEstate.fulfilled, (state, action) => {
        state.isLoading = false;
        state.allRealEstate = action.payload.allRealEstate;
        state.numberOfPages = action.payload.numberOfPages;
        state.alertFlag = false;
      })
      .addCase(getAllRealEstate.rejected, (state, action) => {
        state.isLoading = false;
        state.alertFlag = true;
        state.alertMsg = action.payload;
        state.alertType = "error";
      })
      .addCase(getSingleRealEstate.pending, (state) => {
        state.isLoading = true;
        state.success = null;
      })
      .addCase(getSingleRealEstate.fulfilled, (state, action) => {
        state.isLoading = false;
        state.realEstate = action.payload.realEstate;
        state.isSaved = action.payload.isSaved;
        state.alertFlag = false;
      })
      .addCase(getSingleRealEstate.rejected, (state, action) => {
        state.isLoading = false;
        state.alertFlag = true;
        state.alertMsg = action.payload;
        state.alertType = "error";
      })
      .addCase(saveOrUnSaveRealEstate.pending, (state) => {
        state.isProcessing = true;
      })
      .addCase(saveOrUnSaveRealEstate.fulfilled, (state, action) => {
        state.isProcessing = false;
        state.alertFlag = true;
        state.isSaved = action.payload.isSaved;
        state.alertMsg = action.payload.message;
        state.alertType = "success";
      })
      .addCase(saveOrUnSaveRealEstate.rejected, (state, action) => {
        state.isProcessing = false;
        state.alertFlag = true;
        state.alertMsg = action.payload;
        state.alertType = "error";
      })
      .addCase(getAllSavedRealEstate.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllSavedRealEstate.fulfilled, (state, action) => {
        state.isLoading = false;
        state.allRealEstate = action.payload.savedProperties;
        state.alertFlag = false;
      })
      .addCase(getAllSavedRealEstate.rejected, (state, action) => {
        state.isLoading = false;
        state.alertFlag = true;
        state.alertMsg = action.payload;
        state.alertType = "error";
      })
      .addCase(sendEmailToOwner.pending, (state, action) => {
        state.isProcessing = true;
      })
      .addCase(sendEmailToOwner.fulfilled, (state, action) => {
        state.isProcessing = false;
        state.alertFlag = true;
        state.alertMsg = "Email sent successfully!";
        state.alertType = "success";
      })
      .addCase(sendEmailToOwner.rejected, (state, action) => {
        state.isProcessing = false;
        state.alertFlag = true;
        state.alertMsg = action.payload;
        state.alertType = "error";
      })
      .addCase(getAllTenantRentalProperties.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getAllTenantRentalProperties.fulfilled, (state, action) => {
        state.isLoading = false;
        state.allRentalProperties = action.payload.allRentalProperties;
        state.alertFlag = false;
      })
      .addCase(getAllTenantRentalProperties.rejected, (state, action) => {
        state.isLoading = false;
        state.alertFlag = true;
        state.alertMsg = action.payload;
        state.alertType = "error";
      })
      .addCase(sendComplaintToOwner.pending, (state, action) => {
        state.isProcessing = true;
      })
      .addCase(sendComplaintToOwner.fulfilled, (state, action) => {
        state.isProcessing = false;
        state.alertFlag = true;
        state.alertMsg = "Complaint sent successfully!";
        state.alertType = "success";
        state.success = true;
      })
      .addCase(sendComplaintToOwner.rejected, (state, action) => {
        state.isProcessing = false;
        state.alertFlag = true;
        state.alertMsg = action.payload;
        state.alertType = "error";
      });
  },
});

export const { clearAlert } = realEstateTenantSlice.actions;

export default realEstateTenantSlice.reducer;
