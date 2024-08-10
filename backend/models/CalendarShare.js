import mongoose from "mongoose";

const calendarShareSchema = new mongoose.Schema({
  calendarId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Calendar",
    required: true,
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  permission: { type: String, enum: ["read", "write"], default: "read" },
});

const createCalendarShareModel = (connection) =>
  connection.model("CalendarShare", calendarShareSchema);

export default createCalendarShareModel;
