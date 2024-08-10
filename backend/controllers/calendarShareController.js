import { getConnection } from "../config/dbConnections.js";
import createCalendarShareModel from "../models/CalendarShare.js";
import createCalendarEventModel from "../models/CalendarEvent.js";

// Share a calendar
export const shareCalendar = async (req, res) => {
  try {
    const { calendarId, userId, permission } = req.body;
    const dbConnection = await getConnection("calendarDb");
    const CalendarShare = createCalendarShareModel(dbConnection);
    const newShare = new CalendarShare({ calendarId, userId, permission });
    await newShare.save();
    res.status(201).send(newShare);
  } catch (error) {
    console.error("Error sharing calendar:", error);
    res.status(500).send({ message: "Error sharing calendar" });
  }
};

// Get shares for a calendar
export const getShares = async (req, res) => {
  try {
    console.log(`Fetching shares for userId: ${req.params.userId}`);
    const dbConnection = await getConnection("calendarDb");
    const CalendarShare = createCalendarShareModel(dbConnection);
    const shares = await CalendarShare.find({
      userId: req.params.userId,
    });

    if (!shares.length) {
      console.log(`No shares found for userId: ${req.params.userId}`);
      return res.status(404).send({ message: "User not found" });
    }

    console.log(`Shares found: ${JSON.stringify(shares)}`);
    res.send(shares);
  } catch (error) {
    console.error("Error fetching shares:", error);
    res.status(500).send({ message: "Error fetching shares" });
  }
};
