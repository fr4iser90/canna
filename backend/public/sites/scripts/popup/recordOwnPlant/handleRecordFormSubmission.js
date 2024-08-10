import { addRecord } from "./addRecord.js";

export async function handleRecordFormSubmission(event, plantId, recordDate) {
  event.preventDefault();
  const recordType = document.getElementById("recordType").value;
  const recordData = { date: recordDate, ...getRecordData(recordType) };

  try {
    await addRecord(plantId, recordType, recordData);
    alert("Record added successfully");
    document.body.removeChild(document.getElementById("popupContainer"));
  } catch (error) {
    console.error("Error adding record:", error);
    alert("Error adding record");
  }
}

function getRecordData(recordType) {
  switch (recordType) {
    case "height":
      return { height: document.getElementById("height").value };
    case "width":
      return { width: document.getElementById("width").value };
    case "water":
      return { waterAmount: document.getElementById("waterAmount").value };
    case "nutrient":
      return {
        nutrientType: document.getElementById("nutrientType").value,
        amount: document.getElementById("amount").value,
      };
    case "rootDevelopment":
      return { observation: document.getElementById("observation").value };
    case "image":
      return {
        url: document.getElementById("url").value,
        description: document.getElementById("description").value,
      };
    default:
      return {};
  }
}
