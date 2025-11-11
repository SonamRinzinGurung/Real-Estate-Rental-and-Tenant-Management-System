import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosFetch from "../../utils/axiosCreate";

export const getProfileDetails = createAsyncThunk(
  "getTenantProfileDetails",
  async (arg, thunkAPI) => {
    try {
      const { data } = await axiosFetch.get("/tenant/profile");
      return await data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.msg);
    }
  }
);

export const getOwnerUserDetails = createAsyncThunk(
  "getOwnerUserDetails",
  async ({ slug }, thunkAPI) => {
    try {
      const { data } = await axiosFetch.get(`/tenant/owner-user/${slug}`);
      return await data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.msg);
    }
  }
);

export const updateTenantProfile = createAsyncThunk(
  "updateTenantProfile",
  async ({ formValues }, thunkAPI) => {
    try {
      const { data } = await axiosFetch.patch("/tenant/profile", formValues);
      return await data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.msg);
    }
  }
);

export const addOrRemoveContact = createAsyncThunk(
  "addRemoveContact",
  async ({ id }, thunkAPI) => {
    try {
      const { data } = await axiosFetch.patch(`/tenant/addContact/${id}`);
      localStorage.setItem("user", JSON.stringify(data.updatedUser));
      return await data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.msg);
    }
  }
);

export const getAllContacts = createAsyncThunk(
  "allContacts",
  async ({ name }, thunkAPI) => {
    try {
      let url = "/tenant/contacts/all";
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

export const updateLeaseTenantInfo = createAsyncThunk(
  "updateLeaseTenantInfo",
  async ({ leaseId, updateData }, thunkAPI) => {
    try {
      const { data } = await axiosFetch.patch(
        `/lease/tenant/updateLeaseForm/${leaseId}`,
        updateData
      );
      return await data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.msg);
    }
  }
);

export const approveLease = createAsyncThunk(
  "approveLease",
  async ({ leaseId, digitalSignature, leaseSignTime }, thunkAPI) => {
    try {
      const { data } = await axiosFetch.patch(
        `/lease/approve/${leaseId}`,
        { digitalSignature, leaseSignTime }
      );
      return await data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.msg);
    }
  }
);

export const getLeaseWithRealEstateID = createAsyncThunk(
  "getLeaseWithRealEstateID",
  async ({ realEstateId }, thunkAPI) => {
    try {
      const { data } = await axiosFetch.get(`/lease/tenant/${realEstateId}`);
      return await data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.msg);
    }
  }
);

export const approveLeaseTermination = createAsyncThunk("approveLeaseTermination", async ({ leaseId }, thunkAPI) => {
  try {
    const { data } = await axiosFetch.patch(`/lease/terminate-approve/${leaseId}`);
    return await data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.msg);
  }
})

export const getTenantChats = createAsyncThunk(
  "getTenantChats",
  async (arg, thunkAPI) => {
    try {
      const { data } = await axiosFetch.get("/chat/tenant/get-chats")
      return await data
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.msg)
    }
  }
)

const tenantUserSlice = createSlice({
  name: "tenantUser",
  initialState: {
    user: null,
    realEstates: null,
    leaseDetail: null,
    isLoading: false,
    alertFlag: false,
    alertMsg: "",
    alertType: null,
    isProcessing: false,
    contacts: null,
    isContact: null,
    success: null,
    chats: null,
  },
  reducers: {
    clearAlert: (state) => {
      state.alertFlag = false;
      state.alertMsg = "";
    },
    createAlert: (state, action) => {
      state.alertFlag = true;
      state.alertMsg = action.payload;
      state.alertType = "error";
    },
    addTenantRecentMessage: (state, action) => {
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
      .addCase(getOwnerUserDetails.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getOwnerUserDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.realEstates = action.payload.realEstates;
        state.isContact = action.payload.isContact;
        state.alertFlag = false;
      })
      .addCase(getOwnerUserDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.alertFlag = true;
        state.alertMsg = action.payload;
        state.alertType = "error";
      })
      .addCase(updateTenantProfile.pending, (state, action) => {
        state.isProcessing = true;
      })
      .addCase(updateTenantProfile.fulfilled, (state, action) => {
        state.isProcessing = false;
        state.user = action.payload.user;
        state.alertFlag = true;
        state.alertMsg = "Profile updated successfully";
        state.alertType = "success";
      })
      .addCase(updateTenantProfile.rejected, (state, action) => {
        state.isProcessing = false;
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
      .addCase(updateLeaseTenantInfo.pending, (state, action) => {
        state.isProcessing = true;
      })
      .addCase(updateLeaseTenantInfo.fulfilled, (state, action) => {
        state.isProcessing = false;
        state.leaseDetail = action.payload.updatedLease;
        state.alertFlag = true;
        state.alertMsg = "Lease updated successfully";
        state.alertType = "success";
        state.success = true;
      })
      .addCase(updateLeaseTenantInfo.rejected, (state, action) => {
        state.isProcessing = false;
        state.alertFlag = true;
        state.alertMsg = action.payload;
        state.alertType = "error";
      })
      .addCase(approveLease.pending, (state, action) => {
        state.isProcessing = true;
      })
      .addCase(approveLease.fulfilled, (state, action) => {
        state.isProcessing = false;
        state.leaseDetail = action.payload.leaseDetail;
        state.alertFlag = true;
        state.alertMsg = "Lease approved successfully";
        state.alertType = "success";
      })
      .addCase(approveLease.rejected, (state, action) => {
        state.isProcessing = false;
        state.alertFlag = true;
        state.alertMsg = action.payload;
        state.alertType = "error";
      })
      .addCase(getLeaseWithRealEstateID.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getLeaseWithRealEstateID.fulfilled, (state, action) => {
        state.isLoading = false;
        state.leaseDetail = action.payload.leaseDetail;
        state.alertFlag = false;
      })
      .addCase(getLeaseWithRealEstateID.rejected, (state, action) => {
        state.isLoading = false;
        state.alertFlag = true;
        state.alertMsg = action.payload;
        state.alertType = "error";
      })
      .addCase(approveLeaseTermination.pending, (state, action) => {
        state.isProcessing = true;
      })
      .addCase(approveLeaseTermination.fulfilled, (state, action) => {
        state.isProcessing = false;
        state.leaseDetail.status = "Terminated-approved";
        state.alertFlag = true;
        state.alertMsg = "Lease termination approved successfully";
        state.alertType = "success";
      })
      .addCase(approveLeaseTermination.rejected, (state, action) => {
        state.isProcessing = false;
        state.alertFlag = true;
        state.alertMsg = action.payload;
        state.alertType = "error";
      })
      .addCase(getTenantChats.pending, (state) => {
        state.isLoading = true;
        state.success = null;
      })
      .addCase(getTenantChats.fulfilled, (state, action) => {
        state.chats = action.payload.chats;
        state.isLoading = false;
        state.alertFlag = false;
      })
      .addCase(getTenantChats.rejected, (state, action) => {
        state.isLoading = false;
        state.alertFlag = true;
        state.alertMsg = action.payload;
        state.alertType = "error";
      })
  },
});

export const { clearAlert, createAlert, addTenantRecentMessage, markChatAsRead } = tenantUserSlice.actions;

export default tenantUserSlice.reducer;
