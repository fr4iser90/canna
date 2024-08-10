import { formatDate } from "../utils/dateFormat.js";

// Function to recursively format date fields in an object
const formatDatesRecursively = (obj, dateFields = [], seen = new Set()) => {
  if (seen.has(obj)) return; // Avoid circular references
  if (Array.isArray(obj)) {
    obj.forEach((item) => formatDatesRecursively(item, dateFields, seen));
  } else if (obj && typeof obj === "object" && !(obj instanceof Date)) {
    seen.add(obj);
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        if (dateFields.includes(key) && (obj[key] instanceof Date || typeof obj[key] === "string")) {
          const formattedDate = formatDate(obj[key]);
          if (formattedDate !== obj[key]) {
            console.log(`Formatting date field ${key}: ${obj[key]} -> ${formattedDate}`);
            obj[key] = formattedDate;
          }
        } else if (obj[key] && typeof obj[key] === "object") {
          formatDatesRecursively(obj[key], dateFields, seen);
        }
      }
    }
  }
};

// Middleware for formatting date fields before saving
const formatPlantDatesBeforeSave = function (next) {
  const dateFields = ["startDate", "phaseStartDate", "start", "end"]; // Add any other date fields that need formatting
  console.log("Before Save Middleware: ", this);
  formatDatesRecursively(this, dateFields);
  next();
};

// Middleware for formatting date fields before updating
const formatPlantDatesBeforeUpdate = function (next) {
  const dateFields = ["startDate", "phaseStartDate", "start", "end"]; // Add any other date fields that need formatting
  const update = this.getUpdate();
  console.log("Before Update Middleware: ", update);
  if (update.$set) {
    formatDatesRecursively(update.$set, dateFields);
  } else {
    formatDatesRecursively(update, dateFields);
  }
  next();
};

// Middleware for formatting date fields after finding documents
const formatPlantDatesAfterFind = function (docs, next) {
  const dateFields = ["startDate", "phaseStartDate", "start", "end"]; // Add any other date fields that need formatting
  console.log("After Find Middleware: ", docs);
  if (Array.isArray(docs)) {
    docs.forEach((doc) => formatDatesRecursively(doc, dateFields));
  } else {
    formatDatesRecursively(docs, dateFields);
  }
  next();
};

// Middleware for formatting date fields after updating documents
const formatPlantDatesAfterUpdate = function (result, next) {
  const dateFields = ["startDate", "phaseStartDate", "start", "end"]; // Add any other date fields that need formatting
  console.log("After Update Middleware: ", result);
  if (result) {
    formatDatesRecursively(result, dateFields);
  }
  next();
};

export {
  formatPlantDatesBeforeSave,
  formatPlantDatesBeforeUpdate,
  formatPlantDatesAfterFind,
  formatPlantDatesAfterUpdate,
};
