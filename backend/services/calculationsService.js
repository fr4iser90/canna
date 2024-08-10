import { getDateString } from "../utils/dateFormat.js";

const calculateEndDate = (startDate, days) => {
  const date = new Date(startDate);
  date.setDate(date.getDate() + days);
  return getDateString(date); // Only the date in YYYY-MM-DD format
};

const calculatePhaseDates = (plant) => {
  if (!plant.startDate || plant.plantPhase === "not_set") {
    console.warn(`No start date or phase not set for plant ${plant.name}`);
    return [];
  }

  const startDate = getDateString(plant.startDate);
  const phases = plant.growthMethod === "seed"
    ? ["germination", "seedling", "vegetation", "bloom"]
    : ["rooting", "vegetation", "bloom"];

  const phaseDurations = {
    germination: plant.phaseDurations.germination,
    rooting: plant.phaseDurations.rooting,
    seedling: plant.phaseDurations.seedling,
    vegetation: plant.phaseDurations.vegetation,
    bloom: plant.phaseDurations.bloom,
  };

  let currentDate = new Date(startDate);
  const phaseEvents = [];
  let currentPhase = "not_set";

  for (const phase of phases) {
    const duration = phaseDurations[phase];
    if (duration) {  // Only process phases with a valid duration
      const endDate = calculateEndDate(currentDate, duration);

      phaseEvents.push({
        phase,
        start: getDateString(currentDate),
        end: endDate,
      });

      const currentDateISO = getDateString(new Date());
      if (currentDateISO >= getDateString(currentDate) && currentDateISO <= endDate) {
        currentPhase = phase;
      }

      currentDate = new Date(endDate);
    }
  }

  // Handle the case for mother plants
  if (plant.isMotherPlant) {
    phaseEvents.push({
      phase: "vegetation",
      start: getDateString(currentDate),
      end: null // Open-ended phase for mother plants
    });
    plant.plantPhase = "vegetation"; // Ensure plantPhase is set to vegetation for mother plants
    return phaseEvents;
  }

  // After the bloom phase, the plant is harvested
  if (phaseDurations.bloom) {
    phaseEvents.push({
      phase: "harvest",
      start: getDateString(currentDate),
      end: getDateString(currentDate), // The same day
    });
    if (getDateString(new Date()) >= getDateString(currentDate)) {
      currentPhase = "harvest";
    }
  }

  plant.plantPhase = currentPhase !== "not_set" ? currentPhase : plant.plantPhase; // Ensure plantPhase is set correctly if not "not_set"
  return phaseEvents;
};

const calculatePlantAge = (startDate) => {
  if (!startDate) return 0;

  const currentDate = getDateString(new Date());
  const refDate = getDateString(startDate);
  const ageInMilliseconds = new Date(currentDate) - new Date(refDate);
  const ageInDays = Math.floor(ageInMilliseconds / (1000 * 60 * 60 * 24));

  return ageInDays;
};

const calculatePlantHeight = (heightRecords) => {
  if (!heightRecords || heightRecords.length === 0) return "Unknown";
  const latestRecord = heightRecords[heightRecords.length - 1];
  return `${latestRecord.height} cm`;
};

export { calculateEndDate, calculatePhaseDates, calculatePlantAge, calculatePlantHeight };
