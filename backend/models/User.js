import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  email:    { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
  role:     { type: String, enum: ["user", "admin"], default: "user" },
  settings: {
    notifications: {
      emailNotifications: { type: Boolean, default: false },
      weeklyReports: { type: Boolean, default: false },
      storageAlerts: { type: Boolean, default: false }
    },
    theme: {
      colorTheme: { type: String, enum: ['light', 'dark', 'system'], default: 'light' },
      chartPalette: { type: String, enum: ['default', 'vibrant', 'pastel', 'monochrome'], default: 'default' }
    },
    export: {
      defaultFormat: { type: String, enum: ['CSV', 'Excel', 'JSON', 'PDF'], default: 'CSV' },
      autoExport: { type: Boolean, default: false },
      includeMetadata: { type: Boolean, default: false }
    },
    automation: {
      scheduledAnalysis: { type: Boolean, default: false },
      scheduleFrequency: { type: String, enum: ['daily', 'weekly', 'monthly'], default: 'weekly' },
      autoProcess: { type: Boolean, default: false },
      defaultVisualizations: { type: Boolean, default: false }
    },
    charts: {
      defaultType: { type: String, enum: ['2D Column', '3D Column', 'Line Chart', 'Pie Chart', 'Scatter Plot'], default: '2D Column' },
      interactions: {
        zoomAndPan: { type: Boolean, default: false },
        dataLabels: { type: Boolean, default: false },
        animations: { type: Boolean, default: false }
      },
      dataAggregation: { type: String, enum: ['none', 'sum', 'average', 'count', 'custom'], default: 'none' }
    }
  }
}, { timestamps: true });

export default mongoose.model("User", userSchema);
