import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const user = localStorage.getItem("user");

export const loginOwner = createAsyncThunk(
  "loginOwner",
  async ({ userInfo }, thunkAPI) => {
    try {
      const { data } = await axios.post("/auth/login", userInfo);
      localStorage.setItem("user", JSON.stringify(data.owner));
      localStorage.setItem("token", data.token);
      return await data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.msg);
    }
  }
);

export const registerOwner = createAsyncThunk(
  "registerOwner",
  async ({ formData }, thunkAPI) => {
    try {
      const { data } = await axios.post("/auth/register", formData);
      localStorage.setItem("user", JSON.stringify(data.owner));
      localStorage.setItem("token", data.token);
      return await data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.msg);
    }
  }
);

export const loginTenant = createAsyncThunk(
  "loginTenant",
  async ({ userInfo }, thunkAPI) => {
    try {
      const { data } = await axios.post("/auth/login", userInfo);
      localStorage.setItem("user", JSON.stringify(data.tenant));
      localStorage.setItem("token", data.token);
      return await data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.msg);
    }
  }
);

export const registerTenant = createAsyncThunk(
  "registerTenant",
  async ({ formData }, thunkAPI) => {
    try {
      const { data } = await axios.post("/auth/register", formData);
      localStorage.setItem("user", JSON.stringify(data.tenant));
      localStorage.setItem("token", data.token);
      return await data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.msg);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: user ? JSON.parse(user) : null,
    token: localStorage.getItem("token") || "",
    isLoading: false,
    errorFlag: false,
    errorMsg: "",
  },
  reducers: {
    logOut: (state) => {
      state.user = null;
      state.token = "";
    },
    clearAlert: (state) => {
      state.errorFlag = false;
      state.errorMsg = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginOwner.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginOwner.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.owner;
        state.token = action.payload.token;
      })
      .addCase(loginOwner.rejected, (state, action) => {
        state.isLoading = false;
        state.errorFlag = true;
        state.errorMsg = action.payload;
      })
      .addCase(registerOwner.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerOwner.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.owner;
        state.token = action.payload.token;
      })
      .addCase(registerOwner.rejected, (state, action) => {
        state.isLoading = false;
        state.errorFlag = true;
        state.errorMsg = action.payload;
      })
      .addCase(loginTenant.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginTenant.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.tenant;
        state.token = action.payload.token;
      })
      .addCase(loginTenant.rejected, (state, action) => {
        state.isLoading = false;
        state.errorFlag = true;
        state.errorMsg = action.payload;
      })
      .addCase(registerTenant.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerTenant.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.tenant;
        state.token = action.payload.token;
      })
      .addCase(registerTenant.rejected, (state, action) => {
        state.isLoading = false;
        state.errorFlag = true;
        state.errorMsg = action.payload;
      });
  },
});

export const { logOut, clearAlert } = authSlice.actions;

export default authSlice.reducer;
