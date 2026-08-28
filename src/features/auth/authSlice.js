import { createSlice } from '@reduxjs/toolkit';
import { authApi } from './authApi';

const tokenFromStorage = localStorage.getItem('accessToken');

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    accessToken: tokenFromStorage || null,
    isAuthenticated: Boolean(tokenFromStorage),
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      localStorage.removeItem('accessToken');
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(authApi.endpoints.login.matchFulfilled, (state, action) => {
        state.user = action.payload;
        state.accessToken = action.payload.accessToken;
        state.isAuthenticated = true;
        localStorage.setItem('accessToken', action.payload.accessToken);
      })
      .addMatcher(authApi.endpoints.getMe.matchFulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addMatcher(authApi.endpoints.getMe.matchRejected, (state) => {
        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;
        localStorage.removeItem('accessToken');
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
