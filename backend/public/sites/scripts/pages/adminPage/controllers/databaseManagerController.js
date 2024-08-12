import { configURL } from "../global.js";

async function fetchDatabases(dbDropdown, dbFeedback) {
  try {
    const response = await fetch(`${configURL.API_BASE_URL}/api/admin/databases`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch databases");
    }

    const databases = await response.json();

    dbDropdown.innerHTML = '<option value="">Select a database</option>';
    databases
      .filter((db) => !["admin", "local", "config"].includes(db.name))
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

async function fetchCollections(dbName, collectionDropdown, dbFeedback) {
  if (["admin", "local", "config"].includes(dbName)) {
    dbFeedback.innerText = "Access to this database is restricted";
    return;
  }
  try {
    const response = await fetch(`${configURL.API_BASE_URL}/api/admin/databases/${dbName}/collections`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch collections");
    }

    const collections = await response.json();

    collectionDropdown.innerHTML = '<option value="">Select a collection</option>';
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

async function dropDatabase(dbName, dbFeedback, fetchDatabases) {
  if (dbName && !["adminDb"].includes(dbName)) {
    try {
      const response = await fetch(`${configURL.API_BASE_URL}/api/admin/databases/${dbName}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();
      dbFeedback.innerText = result.message;
      fetchDatabases();
    } catch (err) {
      console.error("Error dropping database:", err);
      dbFeedback.innerText = "Error dropping database";
    }
  } else {
    dbFeedback.innerText = "Dropping this database is not allowed";
  }
}

async function dropCollection(dbName, collectionName, dbFeedback, fetchCollections) {
  if (dbName && collectionName && !["adminDb"].includes(dbName)) {
    try {
      const response = await fetch(`${configURL.API_BASE_URL}/api/admin/databases/${dbName}/collections/${collectionName}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();
      dbFeedback.innerText = result.message;
      fetchCollections(dbName);
    } catch (err) {
      console.error("Error dropping collection:", err);
      dbFeedback.innerText = "Error dropping collection";
    }
  } else {
    dbFeedback.innerText = "Dropping collections in this database is not allowed";
  }
}

export { fetchDatabases, fetchCollections, dropDatabase, dropCollection };
