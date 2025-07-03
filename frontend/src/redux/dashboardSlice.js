import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  uploadedFile: null,
  loading: false,
  error: null,
  settings: {
    notifications: {
      emailNotifications: false,
      weeklyReports: false,
      storageAlerts: false
    },
    theme: {
      colorTheme: 'light',
      chartPalette: 'default'
    },
    export: {
      defaultFormat: 'CSV',
      autoExport: false,
      includeMetadata: false
    },
    automation: {
      scheduledAnalysis: false,
      scheduleFrequency: 'weekly',
      autoProcess: false,
      defaultVisualizations: false
    },
    charts: {
      defaultType: '2D Column',
      interactions: {
        zoomAndPan: false,
        dataLabels: false,
        animations: false
      },
      dataAggregation: 'none'
    }
  }
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
    },
    updateSettings: (state, action) => {
      const { category, setting, value } = action.payload;
      if (category && setting) {
        if (typeof setting === 'object') {
          state.settings[category] = {
            ...state.settings[category],
            ...setting
          };
        } else {
          state.settings[category][setting] = value;
        }
      }
    },
    resetSettings: (state) => {
      state.settings = initialState.settings;
    }
  }
});

export const { 
  uploadFile, 
  setLoading, 
  setError, 
  updateSettings, 
  resetSettings 
} = dashboardSlice.actions;

export default dashboardSlice.reducer; 