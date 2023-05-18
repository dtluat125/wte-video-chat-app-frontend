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

// export const accessConversation = createAsyncThunk(
//   "chat/accessConversation",
//   async (_, { rejectWithValue }) => {}
// );
