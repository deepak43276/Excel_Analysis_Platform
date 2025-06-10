import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  uploadedFile: null,
  loading: false,
  error: null
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    uploadFile: (state, action) => {
      state.uploadedFile = action.payload;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    }
  }
});

export const { uploadFile, setLoading, setError } = dashboardSlice.actions;
export default dashboardSlice.reducer; 