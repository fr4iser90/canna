import {
  fetchDatabases,
  fetchCollections,
  dropDatabase,
  dropCollection,
} from "../controllers/databaseManagerController.js";

export async function initializeDatabaseManager() {
  const dbDropdown = document.getElementById("dbDropdown");
  const collectionDropdown = document.getElementById("collectionDropdown");
  const dbFeedback = document.getElementById("dbFeedback");

  dbDropdown.addEventListener("change", (e) => {
    const dbName = e.target.value;
    if (dbName) {
      fetchCollections(dbName, collectionDropdown, dbFeedback);
    } else {
      collectionDropdown.innerHTML = '<option value="">Select a collection</option>';
    }
  });

  document.getElementById("dropDatabaseButton").addEventListener("click", async () => {
    const dbName = dbDropdown.value;
    dropDatabase(dbName, dbFeedback, () => fetchDatabases(dbDropdown, dbFeedback));
  });

  document.getElementById("dropCollectionButton").addEventListener("click", async () => {
    const dbName = dbDropdown.value;
    const collectionName = collectionDropdown.value;
    dropCollection(dbName, collectionName, dbFeedback, () => fetchCollections(dbName, collectionDropdown, dbFeedback));
  });

  fetchDatabases(dbDropdown, dbFeedback);
}
