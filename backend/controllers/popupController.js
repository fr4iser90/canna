import { getConnection } from "../config/dbConnections.js";
import createStrainDefinitionModel from "../models/StrainDefinition.js";
import { ObjectId } from "mongodb";
import createOwnPlantModel from "../models/OwnPlant.js";

// Fetch strain data for popup
export const getStrainPopupData = async (req, res) => {
  const strainId = req.query.strainId;

  if (!strainId) {
    return res.status(400).send("Strain ID is required");
  }

  console.log("Received strainId:", strainId);

  try {
    const dbConnection = await getConnection("strainDb");
    const StrainDefinition = createStrainDefinitionModel(dbConnection);
    const strainData = await StrainDefinition.findById(new ObjectId(strainId));

    if (!strainData) {
      console.error("Strain not found for strainId:", strainId);
      return res.status(404).send("Strain not found");
    }

    console.log("Strain data found:", strainData);

    const cleanedName = strainData.name
      .replace(/\s*\([^)]*\)\s*/g, "")
      .replace(/\)$/, "")
      .trim();
    const floweringTime = strainData.flowering_time
      ? strainData.flowering_time.split("-")[0].replace(/\D/g, "")
      : "";

    res.render("layouts/popupLayout", {
      title: "Add plant",
      layout: "layouts/popupLayout",
      body: "strainOwnPlantPopup",
      strainData: strainData,
      cleanedName: cleanedName,
      floweringTime: floweringTime,
    });
  } catch (error) {
    console.error("Error fetching strain data:", error);
    res.status(500).send("Internal server error");
  }
};

export const renderManageOwnPlantPopup = async (req, res) => {
  try {
    const dbConnection = await getConnection("userstrainDb");
    const OwnPlant = createOwnPlantModel(dbConnection);
    const userId = req.user._id;
    const plantId = req.params.id;
    const plant = await OwnPlant.findOne({ _id: plantId, userId });

    if (!plant) {
      return res.status(404).send({ message: "Plant not found" });
    }

    res.render("layouts/popupLayout", {
      title: "Manage Plant",
      layout: "layouts/popupLayout",
      body: "manageOwnPlantPopup",
      plantName: plant.name,
      plantId: plant._id
    });
  } catch (err) {
    console.error("Error rendering plantmanager popup:", err);
    res.status(500).send({ message: "Error rendering plantmanager popup", error: err.message });
  }
};

// Render plant details popup
export const renderPlantDetailsPopup = (req, res) => {
  console.log("Rendering plantPopup");
  res.render("layouts/popupLayout", {
    title: "Plant Details",
    layout: "layouts/popupLayout",
    body: "plantPopup",
  });
};

// Render record details popup
export const renderRecordDetailsPopup = (req, res) => {
  const { plantId, recordDate } = req.query;
  console.log("Rendering recordPopup for plantId:", plantId);
  res.render("layouts/popupLayout", {
    title: "Record Details",
    layout: "layouts/popupLayout",
    body: "recordPopup",
    plantId,
    recordDate,
  });
};

export const renderFriendSearchPopup = (req, res) => {
  res.render("layouts/popupLayout", {
      title: "Friend Search",
      layout: "layouts/popupLayout",
      body: "friendSearchPopup",
  });
};