import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosFetch from "../../utils/axiosCreate";

export const getAllRealEstate = createAsyncThunk(
  "getAllRealEstate",
  async (arg, thunkAPI) => {
    try {
      const { data } = await axiosFetch.get("/tenant/real-estate");
      return await data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.msg);
    }
  }
);

export const getSingleRealEstate = createAsyncThunk(
  "getSingleRealEstate",
  async ({ id }, thunkAPI) => {
    try {
      const { data } = await axiosFetch.get(`/tenant/real-estate/${id}`);
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
      .addCase(saveOrUnSaveRealEstate.pending, (state) => {})
      .addCase(saveOrUnSaveRealEstate.fulfilled, (state, action) => {
        state.alertFlag = false;
        state.alertFlag = true;
        state.isSaved = action.payload.isSaved;
        state.alertMsg = action.payload.message;
        state.alertType = "success";
      })
      .addCase(saveOrUnSaveRealEstate.rejected, (state, action) => {
        state.isLoading = false;
        state.alertFlag = true;
        state.alertMsg = action.payload;
        state.alertType = "error";
      });
  },
});

export const { clearAlert } = realEstateTenantSlice.actions;

export default realEstateTenantSlice.reducer;
