import mongoose from "mongoose";

const classesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter class name'],
        trim: true,
        maxLength: [100, 'class name cannot exceed 100 characters']
    },
    id: {
        type: String,
        required: [true, 'Please enter class id'],
        maxLength: [10, 'class id cannot exceed 10 characters'],
    },
    totalattendance: {
        type: Number,
    },
    credithour: {
        type: Number,
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
})

export default mongoose.model("Classes",classesSchema);