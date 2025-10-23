import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema({
  hasAccess: { type: Boolean, default: false }, // Global setting for all batches
});

export default mongoose.model("Settings", settingsSchema)
