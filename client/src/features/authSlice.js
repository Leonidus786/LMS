import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  token: localStorage.getItem("token") || null, // Initialize token from localStorage
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true; // Set isAuthenticated to true
      state.isLoading = false;
      state.error = null;
    },
    setToken: (state, action) => {
      state.token = action.payload;
      state.isAuthenticated = !!action.payload; // Set isAuthenticated based on token
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
      state.token = null;
      localStorage.removeItem("token"); // Clear token from localStorage
    },
  },
});

export const { setUser, setToken, setLoading, setError, logout } =
  authSlice.actions;
export default authSlice.reducer;
