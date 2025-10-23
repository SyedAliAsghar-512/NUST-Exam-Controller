import mongoose from "mongoose";

const RoomSchema = new mongoose.Schema({
  roomNo: Number,
  desks: Number,
  columns: Number,
});

const RoomConfigSchema = new mongoose.Schema({
  rooms: [RoomSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('RoomConfig', RoomConfigSchema);
