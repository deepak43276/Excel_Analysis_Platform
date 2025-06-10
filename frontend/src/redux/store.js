import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import uploadReducer from "./uploadSlice";
import dashboardReducer from './dashboardSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    upload: uploadReducer,
    dashboard: dashboardReducer
  },
});
