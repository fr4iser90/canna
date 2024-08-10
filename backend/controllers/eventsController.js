import { getConnection } from "../config/dbConnections.js";
import createCalendarEventModel from "../models/CalendarEvent.js";
import createUserModel from "../models/User.js";
import createOwnPlantModel from "../models/OwnPlant.js";
import createUserPreferencesModel from "../models/UserPreferences.js";
import { getDateString } from "../utils/dateFormat.js";
import { calculatePhaseDates } from '../services/calculationsService.js';


export const getEvents = async (req, res) => {
  const userId = req.params.userId === "my" ? req.user._id : req.params.userId;
  try {
    const calendarDbConnection = await getConnection("calendarDb");
    const userDbConnection = await getConnection("userDb");

    const CalendarEvent = createCalendarEventModel(calendarDbConnection);
    const User = createUserModel(userDbConnection);

    const user = await User.findById(userId);
    if (!user) {
      console.error("User not found:", userId);
      return res.status(404).send({ message: "User not found" });
    }

    const events = await CalendarEvent.find({ userId }).lean();
    res.json(events);
  } catch (err) {
    console.error("Error fetching events:", err);
    res.status(500).send({ message: "Error fetching events" });
  }
};

export const createEvent = async (req, res) => {
  const userId = req.params.userId;
  const plantId = req.params.plantId || req.body.plantId;
  const { start } = req.body;

  if (!plantId || !start) {
    console.error("Plant ID and start date are required");
    return res.status(400).send({ message: "Plant ID and start date are required" });
  }

  try {
    if (req.user._id.toString() !== userId) {
      console.error("User ID mismatch");
      return res.status(403).send({ message: "You can only create events for yourself" });
    }

    const dbConnection = await getConnection("userstrainDb");
    const ownPlant = createOwnPlantModel(dbConnection);

    const calendarDbConnection = await getConnection("calendarDb");
    const CalendarEvent = createCalendarEventModel(calendarDbConnection);
    const userDbConnection = await getConnection("userDb");
    const User = createUserModel(userDbConnection);
    const user = await User.findById(userId);
    if (!user) {
      console.error("User not found");
      return res.status(404).send({ message: "User not found" });
    }

    const plant = await ownPlant.findOne({ _id: plantId, userId: userId });
    if (!plant) {
      console.error("Plant not found or not authorized");
      return res.status(404).send({ message: "Plant not found or not authorized" });
    }

    const existingEvents = await CalendarEvent.find({ plantId: plantId });
    if (existingEvents.length > 0) {
      console.error("Events for this plant already exist");
      return res.status(400).send({ message: "Events for this plant already exist" });
    }

    // Berechne die Phasenereignisse für die Pflanze
    const phaseEvents = calculatePhaseDates(plant);

    for (const event of phaseEvents) {
      const newEvent = new CalendarEvent({
        userId,
        title: `${plant.name} (${event.phase})`,
        start: event.start,
        end: event.end || event.start, // Falls end nicht gesetzt ist, setze es auf start
        plantId: plantId,
      });
      await newEvent.save();
    }

    res.status(200).json({ message: "Phase events created successfully" });
  } catch (error) {
    console.error("Error creating phase events:", error);
    res.status(500).send({ message: "Error creating phase events", error: error.message });
  }
};


export const updateEvent = async (req, res) => {
  const { id, title, start, end } = req.body;
  if (!id || !title || !start) {
    return res
      .status(400)
      .send({ message: "ID, title, and start date are required" });
  }

  try {
    const userId = req.params.userId;
    if (req.user._id.toString() !== userId) {
      return res
        .status(403)
        .send({ message: "You can only update events for yourself" });
    }

    const dbConnection = await getConnection("calendarDb");
    const CalendarEvent = createCalendarEventModel(dbConnection);
    const event = await CalendarEvent.findById(id);
    if (!event) {
      return res.status(404).send({ message: "Event not found" });
    }

    if (event.userId.toString() !== req.user._id.toString()) {
      return res.status(403).send({ message: "User not authorized" });
    }

    event.title = title;
    event.start = getDateString(start);
    event.end = getDateString(end);
    await event.save();

    res.status(200).json(event);
  } catch (err) {
    console.error("Error updating event:", err);
    res.status(500).send({ message: "Error updating event" });
  }
};

export const deleteEvent = async (req, res) => {
  const userId = req.params.userId;
  const plantId = req.params.plantId;

  console.log("deleteEvent called with:", { userId, plantId });

  try {
    if (req.user._id.toString() !== userId) {
      return res
        .status(403)
        .send({ message: "You can only delete events for yourself" });
    }

    const dbConnection = await getConnection("calendarDb");
    const CalendarEvent = createCalendarEventModel(dbConnection);

    const events = await CalendarEvent.find({ userId, plantId });
    console.log("Events found for deletion:", events);

    if (!events || events.length === 0) {
      return res
        .status(404)
        .send({ message: "No events found for this plant" });
    }

    const deleteResult = await CalendarEvent.deleteMany({ userId, plantId });
    console.log("Delete result:", deleteResult);
    res
      .status(200)
      .send({ message: "Events for the plant deleted successfully" });
  } catch (err) {
    console.error("Error deleting event:", err);
    res.status(500).send({ message: "Error deleting event" });
  }
};

export const checkPlantEvents = async (req, res) => {
  const { userId, plantId } = req.params;

  try {
      const calendarDbConnection = await getConnection("calendarDb");
      const CalendarEvent = createCalendarEventModel(calendarDbConnection);

      const existingEvents = await CalendarEvent.find({ plantId, userId });

      if (existingEvents.length > 0) {
          res.json({ eventExists: true });
      } else {
          res.json({ eventExists: false });
      }
  } catch (error) {
      console.error("Error checking event existence:", error);
      res.status(500).json({ message: "Internal server error" });
  }
};