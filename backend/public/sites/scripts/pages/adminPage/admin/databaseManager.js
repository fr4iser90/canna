import { configURL, fetchWithAuth, checkTokenAndRedirect } from "../global.js";

export async function initializeDatabaseManager() {
  await checkTokenAndRedirect();
  const dbDropdown = document.getElementById("dbDropdown");
  const collectionDropdown = document.getElementById("collectionDropdown");
  const dbFeedback = document.getElementById("dbFeedback");

  async function fetchDatabases() {
    try {
      const response = await fetchWithAuth(
        `${configURL.API_BASE_URL}/api/admin/databases`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch databases");
      }

      const databases = await response.json();
  
      dbDropdown.innerHTML = '<option value="">Select a database</option>';
      databases
        .filter((db) => !["admin", "local", "config"].includes(db.name)) // Filter out unwanted databases
        .forEach((db) => {
          const option = document.createElement("option");
          option.value = db.name;
          option.textContent = db.name;
          dbDropdown.appendChild(option);
        });
    } catch (err) {
      console.error("Error fetching databases:", err);
      dbFeedback.innerText = "Error fetching databases";
    }
  }

  async function fetchCollections(dbName) {
    if (["admin", "local", "config"].includes(dbName)) {
      dbFeedback.innerText = "Access to this database is restricted";
      return;
    }
    try {
      const response = await fetchWithAuth(
        `${configURL.API_BASE_URL}/api/admin/databases/${dbName}/collections`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch collections");
      }

      const collections = await response.json();
  
      collectionDropdown.innerHTML =
        '<option value="">Select a collection</option>';
      collections.forEach((collection) => {
        const option = document.createElement("option");
        option.value = collection.name;
        option.textContent = collection.name;
        collectionDropdown.appendChild(option);
      });
    } catch (err) {
      console.error("Error fetching collections:", err);
      dbFeedback.innerText = "Error fetching collections";
    }
  }

  dbDropdown.addEventListener("change", (e) => {
    const dbName = e.target.value;
    if (dbName) {
      fetchCollections(dbName);
    } else {
      collectionDropdown.innerHTML =
        '<option value="">Select a collection</option>';
    }
  });

  document
    .getElementById("dropDatabaseButton")
    .addEventListener("click", async () => {
      const dbName = dbDropdown.value;
      if (dbName && !["adminDb"].includes(dbName)) {
        // Ensure adminDb cannot be dropped
        try {
          const response = await fetchWithAuth(
            `${configURL.API_BASE_URL}/api/admin/databases/${dbName}`,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
              },
            },
          );

          const result = await response.json();
          dbFeedback.innerText = result.message;
          fetchDatabases(); // Refresh the list of databases
        } catch (err) {
          console.error("Error dropping database:", err);
          dbFeedback.innerText = "Error dropping database";
        }
      } else {
        dbFeedback.innerText = "Dropping this database is not allowed";
      }
    });

  document
    .getElementById("dropCollectionButton")
    .addEventListener("click", async () => {
      const dbName = dbDropdown.value;
      const collectionName = collectionDropdown.value;
      if (dbName && collectionName && !["adminDb"].includes(dbName)) {
        // Ensure collections in adminDb cannot be dropped
        try {
          const response = await fetchWithAuth(
            `${configURL.API_BASE_URL}/api/admin/databases/${dbName}/collections/${collectionName}`,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
              },
            },
          );

          const result = await response.json();
          dbFeedback.innerText = result.message;
          fetchCollections(dbName); // Refresh the list of collections
        } catch (err) {
          console.error("Error dropping collection:", err);
          dbFeedback.innerText = "Error dropping collection";
        }
      } else {
        dbFeedback.innerText =
          "Dropping collections in this database is not allowed";
      }
    });

  fetchDatabases();
}
