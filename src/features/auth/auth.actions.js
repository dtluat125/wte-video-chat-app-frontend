import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../plugins/axios";

export const registerUser = createAsyncThunk(
  "auth/register",
  async ({ name, email, password, passwordConfirm }, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await axiosInstance.post(
        "users/signup",
        { name, email, password, passwordConfirm },
        config
      );

      if (!response.success) {
        return rejectWithValue(response.message);
      }
      return response;
    } catch (error) {
      // return custom error message from backend if present
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ name, email, password, passwordConfirm }, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await axiosInstance.post(
        "users/login",
        { name, email, password, passwordConfirm },
        config
      );
      if (response.success) {
        return response;
      }
      return rejectWithValue(response.message);
    } catch (error) {
      // return custom error message from backend if present
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const validateUser = createAsyncThunk(
  "auth/me",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("users/me");
      console.log("response");
      if (response.status !== "success") {
        return rejectWithValue(response.message);
      }
      return response;
    } catch (error) {
      // return custom error message from backend if present
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);
