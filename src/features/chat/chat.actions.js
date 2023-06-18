import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../plugins/axios";

export const getConversations = createAsyncThunk(
  "chat/getConversations",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("chat");
      if (!response.success) {
        return rejectWithValue(response.message);
      }
      return response;
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const getUsers = createAsyncThunk(
  "chat/getUsers",
  async ({ search }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `users?name=${search}&email=${search}`
      );
      if (!response.success) {
        return rejectWithValue(response.message);
      }
      return response;
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const getChat = createAsyncThunk(
  "chat/getChat",
  async ({ chatId }, { rejectWithValue }) => {
    const response = await axiosInstance.get(`message/${chatId}`);
    if (!response.success) {
      return rejectWithValue(response.message);
    }
    return response;
  }
);

export const sendMessage = createAsyncThunk(
  "chat/sendMessage",
  async ({ chatId, content }, { rejectWithValue }) => {
    const response = await axiosInstance.post(`message/`, { chatId, content });
    if (!response.success) {
      return rejectWithValue(response.message);
    }
    return response;
  }
);

export const accessChat = createAsyncThunk(
  "chat/accessChat",
  async ({ userId }, { rejectWithValue }) => {
    const response = await axiosInstance.post(`chat/`, { userId });
    if (!response.success) {
      return rejectWithValue(response.message);
    }
    return response;
  }
);

export const createGroupChat = createAsyncThunk(
  "chat/createGroupChat",
  async ({ name, users }, { rejectWithValue }) => {
    const response = await axiosInstance.post(`chat/group`, { name, users });
    if (!response.success) {
      return rejectWithValue(response.message);
    }
    return response;
  }
);

export const renameGroupChat = createAsyncThunk(
  "chat/renameGroupChat",
  async ({ chatId, chatName }, { rejectWithValue }) => {
    const response = await axiosInstance.put(`chat/rename`, {
      chatId,
      chatName,
    });
    if (!response.success) {
      return rejectWithValue(response.message);
    }
    return response;
  }
);

export const addMembersToGroup = createAsyncThunk(
  "chat/addToGroup",
  async ({ chatId, userIds }, { rejectWithValue }) => {
    const response = await axiosInstance.put(`chat/groupadd`, { chatId, userIds });
    if (!response.success) {
      return rejectWithValue(response.message);
    }
    return response;
  }
);
