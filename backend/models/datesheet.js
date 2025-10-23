import mongoose from "mongoose";

const DateSheetSchema = new mongoose.Schema({
    batch: { type: String, required: true, unique: true},
    batchId: { type: String, required: true, unique: true},
    schedule: { type: Array, required: true },
});
  
export default mongoose.model("datesheet", DateSheetSchema);