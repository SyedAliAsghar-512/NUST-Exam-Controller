import mongoose from "mongoose";

const BatchSchema = new mongoose.Schema({
  batchId: { type: String, required: true, unique: true },
  subjects: { type: [String], default: [] },
});

export default mongoose.model("Batch", BatchSchema);
