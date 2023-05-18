import { createSlice } from "@reduxjs/toolkit";
import { getConversations, getUsers } from "./chat.actions";

const initialState = {
  loading: false,
  error: null,
  conversations: [],
  searchUsers: [],
  usersLoading: false,
  usersError: null,
  activeConversation: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setActiveConversation: (state, action) => {
      state.activeConversation = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getConversations.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.conversations = [];
    });
    builder.addCase(getConversations.fulfilled, (state, action) => {
      state.loading = false;
      state.error = null;
      state.conversations = action.payload?.data?.data || [];
    });
    builder.addCase(getConversations.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Something went wrong";
    });

    builder.addCase(getUsers.pending, (state) => {
      state.usersLoading = true;
      state.usersError = null;
      state.searchUsers = [];
    });
    builder.addCase(getUsers.fulfilled, (state, action) => {
      state.usersLoading = false;
      state.usersError = null;
      state.searchUsers = action.payload?.data?.data || [];
    });
    builder.addCase(getUsers.rejected, (state, action) => {
      state.usersLoading = false;
      state.usersError = action.payload || "Something went wrong";
    });
  },
});

export const { setActiveConversation } = chatSlice.actions;

export default chatSlice.reducer;
