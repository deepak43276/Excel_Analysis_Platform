import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

export const uploadFile = createAsyncThunk(
  'upload/uploadFile',
  async (formData) => {
    const response = await api.post('/uploads/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
);

export const fetchUploads = createAsyncThunk(
  'upload/fetchUploads',
  async () => {
    const response = await api.get('/uploads');
    return response.data;
  }
);

export const getUploadById = createAsyncThunk(
  'upload/getUploadById',
  async (id, { getState }) => {
    const { user } = getState().auth;
    const isAdmin = user && user.role === 'admin';
    const endpoint = isAdmin ? `/admin/uploads/${id}` : `/uploads/${id}`;
    const response = await api.get(endpoint);
    return response.data;
  }
);

const uploadSlice = createSlice({
  name: 'upload',
  initialState: {
    uploads: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(uploadFile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadFile.fulfilled, (state, action) => {
        state.loading = false;
        state.uploads.unshift(action.payload.upload);
      })
      .addCase(uploadFile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchUploads.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUploads.fulfilled, (state, action) => {
        state.loading = false;
        state.uploads = action.payload.uploads || [];
      })
      .addCase(fetchUploads.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(getUploadById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUploadById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUpload = action.payload;
      })
      .addCase(getUploadById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default uploadSlice.reducer;
