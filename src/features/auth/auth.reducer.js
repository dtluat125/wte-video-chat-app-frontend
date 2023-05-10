import { createSlice } from "@reduxjs/toolkit";
import { loginUser, registerUser, validateUser } from "./auth.actions";

const initialState = {
  loading: false,
  userInfo: {}, // for user object
  userToken: null, // for storing the JWT
  error: null,
  success: false, // for monitoring the registration process.
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logOut(state) {
      state.userInfo = null;
      state.userToken = null;
    },
  },
  extraReducers: {
    // register user
    [registerUser.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [registerUser.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.success = true; // registration successful
      state.userInfo = payload.data.user;
      state.userToken = payload.data.token;
    },
    [registerUser.rejected]: (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    },

    // Login user
    [loginUser.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [loginUser.fulfilled]: (state, { payload }) => {
      console.log(payload);
      state.loading = false;
      state.success = true; // registration successful
      state.userInfo = payload.data.user;
      state.userToken = payload.token;
    },
    [loginUser.rejected]: (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    },

    // Validate user
    [validateUser.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [validateUser.fulfilled]: (state, { payload }) => {
      console.log(payload);
      state.loading = false;
      state.success = true; // registration successful
      state.userInfo = payload.data.data;
    },
    [validateUser.rejected]: (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    },
  },
});

export const { logOut } = authSlice.actions;

export default authSlice.reducer;
