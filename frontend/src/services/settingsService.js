import api from './api';

export const settingsService = {
  // Fetch user settings
  getSettings: async () => {
    try {
      const response = await api.get('/settings');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch settings');
    }
  },

  // Save user settings
  saveSettings: async (settings) => {
    try {
      const response = await api.post('/settings', settings);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to save settings');
    }
  },

  // Update specific setting
  updateSetting: async (category, setting, value) => {
    try {
      const response = await api.patch('/settings', {
        category,
        setting,
        value
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update setting');
    }
  },

  // Reset settings to default
  resetSettings: async () => {
    try {
      const response = await api.post('/settings/reset');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to reset settings');
    }
  }
};

export default settingsService; 