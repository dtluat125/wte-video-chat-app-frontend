import { createSlice } from "@reduxjs/toolkit";
import {
  accessChat,
  addMembersToGroup,
  createGroupChat,
  getChat,
  getConversations,
  getUsers,
  renameGroupChat,
  sendMessage,
} from "./chat.actions";
import socketService from "../../plugins/socket";

export const ChatEvent = {
  SETUP: "SET_UP",
  MESSAGE_RECEIVED: "MESSAGE_RECEIVED",
  JOIN_CHAT: "JOIN_CHAT",
  NEW_MESSAGE: "NEW_MESSAGE", //
};

const initialState = {
  loading: false,
  error: null,
  conversations: [],
  searchUsers: [],
  usersLoading: false,
  usersError: null,
  activeConversation: null,
  messagesLoading: false,
  messages: null,
  messagesError: null,
  sendMessageLoading: false,
  sendMessageError: null,
  sentMessage: null,
  accessChatLoading: false,
  accessChatError: null,
  accessChatResponse: null,
  createGroupChatLoading: false,
  createGroupChatError: null,
  createGroupChatResponse: null,
  renameGroupChatLoading: false,
  renameGroupChatError: null,
  renameGroupChatResponse: null,

  addMembersToGroupLoading: false,
  addMembersToGroupError: null,
  addMembersToGroupResponse: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setActiveConversation: (state, action) => {
      state.activeConversation = action.payload;
    },

    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },

    clearSearch: (state) => {
      state.searchUsers = [];
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

    builder.addCase(getChat.pending, (state) => {
      // state.messages = [];
      state.messagesError = null;
      state.messagesLoading = true;
    });
    builder.addCase(getChat.fulfilled, (state, action) => {
      state.messages = action.payload?.data || [];
      state.messagesLoading = false;
      socketService.emit(ChatEvent.JOIN_CHAT, state.activeConversation._id);
    });
    builder.addCase(getChat.rejected, (state, action) => {
      state.messagesError = action.payload || "Something went wrong";
      state.messagesLoading = false;
    });
    builder.addCase(sendMessage.pending, (state) => {
      state.sendMessageLoading = true;
      state.sendMessageError = null;
      state.sentMessage = null;
    });
    builder.addCase(sendMessage.fulfilled, (state, action) => {
      state.sendMessageLoading = false;
      state.sendMessageError = null;
      state.sentMessage = action.payload.data;
      state.messages.push(action.payload.data);
      socketService.emit(ChatEvent.NEW_MESSAGE, action.payload.data);
    });
    builder.addCase(sendMessage.rejected, (state, action) => {
      state.sendMessageLoading = false;
      state.sendMessageError = action.payload || "Something went wrong";
    });
    builder.addCase(accessChat.pending, (state) => {
      state.accessChatError = null;
      state.accessChatLoading = true;
      state.activeConversation = null;
      state.accessChatResponse = null;
    });
    builder.addCase(accessChat.fulfilled, (state, action) => {
      state.activeConversation = action.payload?.data?.data;
      state.accessChatResponse = action.payload?.data?.data;
      if (
        !state.conversations?.find(
          (conversation) => conversation._id === state.activeConversation._id
        )
      )
        state.conversations.unshift(action.payload?.data?.data);
      state.accessChatLoading = false;
    });
    builder.addCase(accessChat.rejected, (state, action) => {
      state.accessChatLoading = false;
      state.accessChatError = action.payload || "Something went wrong";
    });
    builder.addCase(createGroupChat.pending, (state) => {
      state.createGroupChatError = null;
      state.createGroupChatLoading = true;
      state.activeConversation = null;
      state.createGroupChatResponse = null;
    });
    builder.addCase(createGroupChat.fulfilled, (state, action) => {
      state.activeConversation = action.payload?.data;
      state.createGroupChatResponse = action.payload?.data;
      state.conversations.unshift(action.payload?.data);
      state.createGroupChatLoading = false;
    });
    builder.addCase(createGroupChat.rejected, (state, action) => {
      state.createGroupChatLoading = false;
      state.createGroupChatError = action.payload || "Something went wrong";
    });
    // Rename
    builder.addCase(renameGroupChat.pending, (state) => {
      state.renameGroupChatError = null;
      state.renameGroupChatLoading = true;
      state.renameGroupChatResponse = null;
    });
    builder.addCase(renameGroupChat.fulfilled, (state, action) => {
      state.activeConversation = action.payload?.data;
      state.renameGroupChatResponse = action.payload?.data;
      state.renameGroupChatLoading = false;
    });
    builder.addCase(renameGroupChat.rejected, (state, action) => {
      state.renameGroupChatLoading = false;
      state.renameGroupChatError = action.payload || "Something went wrong";
    });
    // Add member
    builder.addCase(addMembersToGroup.pending, (state) => {
      state.addMembersToGroupError = null;
      state.addMembersToGroupLoading = true;
      state.addMembersToGroupResponse = null;
    });
    builder.addCase(addMembersToGroup.fulfilled, (state, action) => {
      state.activeConversation = action.payload?.data;
      state.addMembersToGroupResponse = action.payload?.data;
      state.addMembersToGroupLoading = false;
    });
    builder.addCase(addMembersToGroup.rejected, (state, action) => {
      state.addMembersToGroupLoading = false;
      state.addMembersToGroupError = action.payload || "Something went wrong";
    });
  },
});

export const { setActiveConversation, setMessages, addMessage, clearSearch } =
  chatSlice.actions;

export default chatSlice.reducer;
