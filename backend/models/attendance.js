import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
    id: {
        type: String,
        required: [true, 'Please enter class id'],
        maxLength: [10, 'class id cannot exceed 10 characters'],
    },
    attendance: {
        type: Boolean,
    },
    totalattendance: {
        type: Number,
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    classid: {
        type: mongoose.Schema.ObjectId,
        ref: 'Classid',
        required: true
    },
})

export default mongoose.model("Attendance",attendanceSchema);