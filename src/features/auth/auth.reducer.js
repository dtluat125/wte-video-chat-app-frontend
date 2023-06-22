import { createSlice } from "@reduxjs/toolkit";
import { loginUser, registerUser, validateUser } from "./auth.actions";

const initialState = {
  loading: false,
  userInfo: {}, // for user object
  userToken: null, // for storing the JWT
  error: null,
  success: false, // for monitoring the registration process.
  validateLoading: false,
  validateSuccess: false,
  validateError: null,
  isSocketConnected: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logOut(state) {
      state.userInfo = null;
      state.userToken = null;
      state.error = null;
      state.success = false;
      state.validateSuccess = false;
      state.validateError = null;
      state.validateLoading = false;
    },
    clearState(state) {
      state.userInfo = null;
      state.userToken = null;
      state.error = null;
      state.success = false;
      state.validateSuccess = false;
      state.validateError = null;
      state.validateLoading = false;
    },

    setIsSocketConnected(state, action) {
      state.isSocketConnected = action.payload;
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
      state.validateSuccess = false;
      state.validateError = null;
      state.validateLoading = false;
      state.loading = true;
      state.error = null;
    },
    [loginUser.fulfilled]: (state, { payload }) => {
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
      state.validateLoading = true;
      state.validateError = null;
    },
    [validateUser.fulfilled]: (state, { payload }) => {
      state.validateLoading = false;
      state.validateSuccess = true; // registration successful
      state.userInfo = payload.data.data;
    },
    [validateUser.rejected]: (state, { payload }) => {
      state.validateLoading = false;
      state.validateError = payload;
    },
  },
});

export const { logOut, clearState, setIsSocketConnected } = authSlice.actions;
export const isSocketConnectedSelector = (state) =>
  state.auth.isSocketConnected;
export default authSlice.reducer;
