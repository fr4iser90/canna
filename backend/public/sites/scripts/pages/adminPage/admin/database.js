document.addEventListener("DOMContentLoaded", async function () {

  document.getElementById("dropDatabaseButton").addEventListener("click", async () => {
    const dbName = document.getElementById("dbName").value;
    if (dbName) {
      try {
        const response = await fetchWithCookies(`/api/admin/databases/${dbName}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const result = await response.json();
        document.getElementById("dbFeedback").innerText = result.message;
      } catch (err) {
        console.error("Error dropping database:", err);
        document.getElementById("dbFeedback").innerText = "Error dropping database";
      }
    }
  });

  document.getElementById("dropCollectionButton").addEventListener("click", async () => {
    const dbName = document.getElementById("dbName").value;
    const collectionName = document.getElementById("collectionName").value;
    if (dbName && collectionName) {
      try {
        const response = await fetchWithCookies(`/api/admin/databases/${dbName}/collections/${collectionName}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const result = await response.json();
        document.getElementById("dbFeedback").innerText = result.message;
      } catch (err) {
        console.error("Error dropping collection:", err);
        document.getElementById("dbFeedback").innerText = "Error dropping collection";
      }
    }
  });
});
