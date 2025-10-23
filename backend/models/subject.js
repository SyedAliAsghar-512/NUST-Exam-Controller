import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  courseName: { type: String, required: true },
});

const subjectSchema = new mongoose.Schema({
  batch: { type: String, required: true, unique: true },
  subjects: [courseSchema],
});

export default mongoose.model('Subject', subjectSchema);
