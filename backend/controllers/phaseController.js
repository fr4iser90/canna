import { getConnection } from "../config/dbConnections.js";
import createOwnPlantModel from "../models/OwnPlant.js";
import createCalendarEventModel from "../models/CalendarEvent.js";
import { calculatePhaseDates } from "../services/calculationsService.js";

export const startPlantPhase = async (req, res = null) => {
  const { plantId, phase, startDate } = req.body || req;
  try {
    const dbConnection = await getConnection("userstrainDb");
    const ownPlant = createOwnPlantModel(dbConnection);

    const plant = await ownPlant.findById(plantId);
    if (!plant) {
      if (res) {
        return res.status(404).send({ message: "Plant not found" });
      }
      throw new Error("Plant not found");
    }

    // Set the phase if it is 'not_set'
    if (plant.plantPhase === 'not_set') {
      plant.plantPhase = phase || (plant.growthMethod === "seed" ? "germination" : "rooting");
    } else {
      plant.plantPhase = phase;
    }

    // Ensure the start date is set
    plant.startDate = startDate || plant.startDate || new Date();
    plant.phaseStartDate = new Date();

    // Calculate phase durations
    const phaseDurations = calculatePhaseDates(plant);
    plant.phaseDurations = phaseDurations;

    await plant.save();

    if (res) {
      return res.status(200).json(plant);
    }
    return plant;
  } catch (err) {
    console.error("Error starting plant phase:", err);
    if (res) {
      return res.status(500).send({ message: "Error starting plant phase", error: err.message });
    }
    throw err;
  }
};

export const transitionPlantPhase = async (req, res) => {
  const { plantId, newPhase } = req.body;

  try {
    const dbConnection = await getConnection("userstrainDb");
    const OwnPlant = createOwnPlantModel(dbConnection);

    const plant = await OwnPlant.findById(plantId);
    if (!plant) {
      console.error(`Plant with ID ${plantId} not found`);
      return res.status(404).json({ message: "Plant not found" });
    }

    console.log(`Transitioning plant ID ${plantId} to phase ${newPhase}`);

    if (newPhase === "vegetation" && plant.isMotherPlant) {
      console.log(`Plant ID ${plantId} is a mother plant, removing bloom and harvested phases`);

      console.log("Current phase events before removal:", plant.phaseEvents);

      plant.phaseEvents = plant.phaseEvents.filter(event => event.phase !== "bloom" && event.phase !== "harvested");

      plant.phaseEvents = plant.phaseEvents.map(event => {
        if (event.phase === "vegetation") {
          event.end = null;
        }
        return event;
      });

      console.log("Phase events after removal:", plant.phaseEvents);

      const calendarDbConnection = await getConnection("calendarDb");
      const CalendarEvent = createCalendarEventModel(calendarDbConnection);

      // Adjusting the delete criteria to match the event titles
      const deleteCriteria = {
        plantId: plant._id,
        title: { $in: [`${plant.name} (bloom)`, `${plant.name} (harvested)`] }
      };
      console.log("Delete criteria for calendar events:", deleteCriteria);

      const calendarEvents = await CalendarEvent.find(deleteCriteria);
      console.log("Calendar events found for deletion:", calendarEvents);

      calendarEvents.forEach(event => {
        console.log(`Event ID: ${event._id}, Title: ${event.title}`);
      });

      const deleteResult = await CalendarEvent.deleteMany(deleteCriteria);
      console.log(`Removed bloom and harvested events for plant ID ${plantId} from calendar, delete result:`, deleteResult);
    }

    plant.plantPhase = newPhase;
    await plant.save();

    console.log(`Plant phase updated successfully for plant ID ${plantId}`);
    res.status(200).json({ message: "Plant phase updated successfully", plant });
  } catch (err) {
    console.error("Error transitioning plant phase:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};