import { checkTokenAndRedirect, configURL } from "../global.js";

document.addEventListener("DOMContentLoaded", async function () {
  await checkTokenAndRedirect();
  
  document
    .getElementById("dropDatabaseButton")
    .addEventListener("click", async () => {
      const dbName = document.getElementById("dbName").value;
      if (dbName) {
        try {
          const token = localStorage.getItem("token");
          const response = await fetch(
            `${configURL.API_BASE_URL}/api/admin/databases/${dbName}`,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            },
          );

          const result = await response.json();
          document.getElementById("dbFeedback").innerText = result.message;
        } catch (err) {
          console.error("Error dropping database:", err);
          document.getElementById("dbFeedback").innerText =
            "Error dropping database";
        }
      }
    });

  document
    .getElementById("dropCollectionButton")
    .addEventListener("click", async () => {
      const dbName = document.getElementById("dbName").value;
      const collectionName = document.getElementById("collectionName").value;
      if (dbName && collectionName) {
        try {
          const token = localStorage.getItem("token");
          const response = await fetch(
            `${configURL.API_BASE_URL}/api/admin/databases/${dbName}/collections/${collectionName}`,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            },
          );

          const result = await response.json();
          document.getElementById("dbFeedback").innerText = result.message;
        } catch (err) {
          console.error("Error dropping collection:", err);
          document.getElementById("dbFeedback").innerText =
            "Error dropping collection";
        }
      }
    });
});
