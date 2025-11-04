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

export const updateProfile = createAsyncThunk(
  "updateProfile",
  async ({ formValues }, thunkAPI) => {
    try {
      const { data } = await axiosFetch.patch("/owner/profile", formValues);
      return await data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.msg);
    }
  }
);

export const getTenantUserDetails = createAsyncThunk(
  "getTenantUserDetails",
  async ({ slug, email }, thunkAPI) => {
    try {
      const { data } = await axiosFetch.get(`/owner/tenant-user?slug=${slug}&email=${email}`);
      return await data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.msg);
    }
  }
);

export const addOrRemoveContact = createAsyncThunk(
  "addOrRemoveContact",
  async ({ id }, thunkAPI) => {
    try {
      const { data } = await axiosFetch.patch(`/owner/addContact/${id}`);
      localStorage.setItem("user", JSON.stringify(data.updatedUser));
      return await data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.msg);
    }
  }
);

export const getAllContacts = createAsyncThunk(
  "getAllContacts",
  async ({ name }, thunkAPI) => {
    try {
      let url = "/owner/contacts/all";
      if (name) {
        url = url + `?name=${name}`;
      }
      const { data } = await axiosFetch.get(url);
      return await data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.msg);
    }
  }
);

export const createLease = createAsyncThunk(
  "createLease",
  async ({ formData }, thunkAPI) => {
    try {
      const { data } = await axiosFetch.post("/lease", formData);
      return await data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.msg);
    }
  }
);

export const getLeaseOwnerView = createAsyncThunk(
  "getLeaseOwnerView",
  async ({ realEstateId }, thunkAPI) => {
    try {
      const { data } = await axiosFetch.get(
        `/lease/ownerView/${realEstateId}`
      );
      return await data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.msg);
    }
  }
);

export const terminatePendingLease = createAsyncThunk("terminatePendingLease", async ({ leaseId }, thunkAPI) => {
  try {
    const { data } = await axiosFetch.patch(`/lease/terminate/${leaseId}`);
    return await data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.msg);
  }
})

export const deleteLease = createAsyncThunk(
  "deleteLease",
  async ({ leaseId }, thunkAPI) => {
    try {
      const { data } = await axiosFetch.delete(
        `/lease/delete/${leaseId}`
      );
      return await data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.msg);
    }
  }
);

export const getOwnerAllLeases = createAsyncThunk(
  "getOwnerAllLeases",
  async (arg, thunkAPI) => {
    try {
      const { data } = await axiosFetch.get("/lease/owner/allLeases");
      return await data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.msg);
    }
  }
);

export const getOwnerChats = createAsyncThunk(
  "getOwnerChats",
  async (arg, thunkAPI) => {
    try {
      const { data } = await axiosFetch.get("/chat/owner/get-chats")
      return await data
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.msg)
    }
  }
)

const ownerUserSlice = createSlice({
  name: "ownerUser",
  initialState: {
    user: null,
    isLoading: false,
    alertFlag: false,
    alertMsg: "",
    alertType: null,
    isProcessing: false,
    isContact: null,
    contacts: null,
    leaseDetail: null,
    success: null,
    allLeases: null,
    chats: null,
  },
  reducers: {
    clearAlert: (state) => {
      state.alertFlag = false;
      state.alertMsg = "";
    },
    addOwnerRecentMessage: (state, action) => {
      const { chatId, message, sender } = action.payload;
      const chatIndex = state.chats.findIndex((chat) => chat._id === chatId);
      if (chatIndex !== -1) {
        state.chats[chatIndex].message = message;
        state.chats[chatIndex].createdAt = new Date().toISOString();
        state.chats[chatIndex].isRead = false;
        state.chats[chatIndex].sender = sender;
        const updatedChat = state.chats.splice(chatIndex, 1)[0];
        state.chats.unshift(updatedChat);
      }
    },
    markChatAsRead: (state, action) => {
      const { chatId } = action.payload;
      const chat = state?.chats?.find((chat) => chat._id === chatId);
      if (chat) {
        chat.isRead = true;
      }
    }
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
      .addCase(updateProfile.pending, (state, action) => {
        state.isProcessing = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isProcessing = false;
        state.user = action.payload.user;
        state.alertFlag = true;
        state.alertMsg = "Profile updated successfully";
        state.alertType = "success";
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isProcessing = false;
        state.alertFlag = true;
        state.alertMsg = action.payload;
        state.alertType = "error";
      })
      .addCase(getTenantUserDetails.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getTenantUserDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isContact = action.payload.isContact;
        state.alertFlag = false;
      })
      .addCase(getTenantUserDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.alertFlag = true;
        state.alertMsg = action.payload;
        state.alertType = "error";
      })
      .addCase(addOrRemoveContact.pending, (state) => {
        state.isProcessing = true;
      })
      .addCase(addOrRemoveContact.fulfilled, (state, action) => {
        state.alertFlag = true;
        state.isContact = action.payload.isContact;
        state.alertMsg = action.payload.message;
        state.alertType = "success";
        state.isProcessing = false;
      })
      .addCase(addOrRemoveContact.rejected, (state, action) => {
        state.isProcessing = false;
        state.alertFlag = true;
        state.alertMsg = action.payload;
        state.alertType = "error";
      })
      .addCase(getAllContacts.pending, (state) => {
        state.isLoading = true;
        state.success = null;
      })
      .addCase(getAllContacts.fulfilled, (state, action) => {
        state.contacts = action.payload.contacts;
        state.isLoading = false;
        state.alertFlag = false;
      })
      .addCase(getAllContacts.rejected, (state, action) => {
        state.isLoading = false;
        state.alertFlag = true;
        state.alertMsg = action.payload;
        state.alertType = "error";
      })
      .addCase(createLease.pending, (state, action) => {
        state.isProcessing = true;
      })
      .addCase(createLease.fulfilled, (state, action) => {
        state.isProcessing = false;
        state.success = true;
        state.alertFlag = true;
        state.alertMsg = "Lease created and sent to tenant";
        state.alertType = "success";
      })
      .addCase(createLease.rejected, (state, action) => {
        state.isProcessing = false;
        state.alertFlag = true;
        state.alertMsg = action.payload;
        state.alertType = "error";
      })
      .addCase(getLeaseOwnerView.pending, (state, action) => {
        state.isLoading = true;
        state.success = null;
      })
      .addCase(getLeaseOwnerView.fulfilled, (state, action) => {
        state.isLoading = false;
        state.leaseDetail = action.payload.leaseDetail;
        state.alertFlag = false;
      })
      .addCase(getLeaseOwnerView.rejected, (state, action) => {
        state.isLoading = false;
        state.alertFlag = true;
        state.alertMsg = action.payload;
        state.alertType = "error";
      })
      .addCase(terminatePendingLease.pending, (state, action) => {
        state.isProcessing = true;
      })
      .addCase(terminatePendingLease.fulfilled, (state, action) => {
        state.isProcessing = false;
        state.leaseDetail.status = "Terminated-pending";
        state.alertFlag = true;
        state.alertMsg = action.payload.message;
        state.alertType = "success";
      })
      .addCase(terminatePendingLease.rejected, (state, action) => {
        state.isProcessing = false;
        state.alertFlag = true;
        state.alertMsg = action.payload;
        state.alertType = "error";
      })
      .addCase(deleteLease.pending, (state, action) => {
        state.isProcessing = true;
      })
      .addCase(deleteLease.fulfilled, (state, action) => {
        state.isProcessing = false;
        state.success = action.payload.success;
        state.alertFlag = true;
        state.alertMsg = action.payload.message;
        state.alertType = "success";
      })
      .addCase(deleteLease.rejected, (state, action) => {
        state.isProcessing = false;
        state.alertFlag = true;
        state.alertMsg = action.payload;
        state.alertType = "error";
      })
      .addCase(getOwnerAllLeases.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOwnerAllLeases.fulfilled, (state, action) => {
        state.allLeases = action.payload.allLeases;
        state.isLoading = false;
        state.alertFlag = false;
      })
      .addCase(getOwnerAllLeases.rejected, (state, action) => {
        state.isLoading = false;
        state.alertFlag = true;
        state.alertMsg = action.payload;
        state.alertType = "error";
      })
      .addCase(getOwnerChats.pending, (state) => {
        state.isLoading = true;
        state.success = null;
      })
      .addCase(getOwnerChats.fulfilled, (state, action) => {
        state.chats = action.payload.chats;
        state.isLoading = false;
        state.alertFlag = false;
      })
      .addCase(getOwnerChats.rejected, (state, action) => {
        state.isLoading = false;
        state.alertFlag = true;
        state.alertMsg = action.payload;
        state.alertType = "error";
      })
  },
});

export const { clearAlert, addOwnerRecentMessage, markChatAsRead } = ownerUserSlice.actions;

export default ownerUserSlice.reducer;
