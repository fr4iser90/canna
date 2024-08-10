import mongoose from "mongoose";

const calendarEventSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: { type: String, required: true },
  start: {
    type: Date,
    required: true,
    set: (val) => {
      const date = new Date(val);
      return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    }, // Ensures only the date part is stored
  },
  end: {
    type: Date,
    set: (val) => {
      const date = new Date(val);
      return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    }, // Ensures only the date part is stored
  },
  plantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "OwnPlant",
    required: false,
  },
});

const createCalendarEventModel = (connection) => {
  if (!connection || typeof connection.model !== "function") {
    throw new Error("Invalid connection object");
  }
  // Check if the model is already registered
  if (connection.models.CalendarEvent) {
    return connection.models.CalendarEvent;
  }
  return connection.model("CalendarEvent", calendarEventSchema);
};

export default createCalendarEventModel;
