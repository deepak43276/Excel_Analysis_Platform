import User from '../models/User.js';

// Get user settings
export const getSettings = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('settings');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user.settings || {});
  } catch (error) {
    console.error('Error in getSettings:', error);
    res.status(500).json({ message: 'Failed to fetch settings' });
  }
};

// Save all settings
export const saveSettings = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Validate settings structure
    const requiredCategories = ['notifications', 'theme', 'export', 'automation', 'charts'];
    const receivedCategories = Object.keys(req.body);

    const missingCategories = requiredCategories.filter(cat => !receivedCategories.includes(cat));
    if (missingCategories.length > 0) {
      return res.status(400).json({
        message: 'Invalid settings structure',
        missingCategories
      });
    }

    // Update settings
    user.settings = req.body;
    await user.save();

    console.log('Settings saved successfully for user:', user._id);
    res.json(user.settings);
  } catch (error) {
    console.error('Error in saveSettings:', error);
    res.status(500).json({ message: 'Failed to save settings' });
  }
};

// Update specific setting
export const updateSetting = async (req, res) => {
  try {
    const { category, setting, value } = req.body;
    
    if (!category || !setting) {
      return res.status(400).json({ message: 'Category and setting are required' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (!user.settings) {
      user.settings = {};
    }
    if (!user.settings[category]) {
      user.settings[category] = {};
    }
    
    // Validate the setting value based on the category and setting
    if (category === 'theme') {
      if (setting === 'colorTheme' && !['light', 'dark', 'system'].includes(value)) {
        return res.status(400).json({ message: 'Invalid color theme value' });
      }
      if (setting === 'chartPalette' && !['default', 'vibrant', 'pastel', 'monochrome'].includes(value)) {
        return res.status(400).json({ message: 'Invalid chart palette value' });
      }
    }
    
    user.settings[category][setting] = value;
    await user.save();
    
    res.json(user.settings);
  } catch (error) {
    console.error('Error in updateSetting:', error);
    res.status(500).json({ message: 'Failed to update setting' });
  }
};

// Reset settings to default
export const resetSettings = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.settings = {
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
    };
    await user.save();
    
    console.log('Settings reset to default for user:', user._id);
    res.json(user.settings);
  } catch (error) {
    console.error('Error in resetSettings:', error);
    res.status(500).json({ message: 'Failed to reset settings' });
  }
}; 