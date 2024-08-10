document.addEventListener("DOMContentLoaded", function () {
  const searchButton = document.getElementById("search-friends-button");
  const popup = document.getElementById("friend-search-popup");
  const closeButton = document.querySelector(".popup .close");
  const inviteButton = document.getElementById("invite-friend-button");
  const searchInput = document.getElementById("friend-search-input");
  const searchResults = document.getElementById("search-results");

  searchButton.addEventListener("click", () => {
    popup.style.display = "block";
  });

  closeButton.addEventListener("click", () => {
    popup.style.display = "none";
  });

  window.addEventListener("click", (event) => {
    if (event.target == popup) {
      popup.style.display = "none";
    }
  });

  inviteButton.addEventListener("click", async () => {
    const query = searchInput.value.trim();
    if (query) {
      try {
        const response = await fetch(
          `${configURL.API_BASE_URL}/api/friends/search`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({ query }),
          },
        );

        const results = await response.json();
        if (response.ok) {
          searchResults.innerHTML = "";
          results.forEach((result) => {
            const div = document.createElement("div");
            div.classList.add("search-result");
            div.textContent = `${result.name} (${result.email})`;
            div.addEventListener("click", () => inviteFriend(result.id));
            searchResults.appendChild(div);
          });
        } else {
          throw new Error(`Error: ${results.message}`);
        }
      } catch (error) {
        console.error("Error searching for friends:", error);
        alert("Error searching for friends. Please try again.");
      }
    }
  });

  async function inviteFriend(friendId) {
    try {
      const response = await fetch(
        `${configURL.API_BASE_URL}/api/friends/invite`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ friendId }),
        },
      );

      if (response.ok) {
        alert("Friend invitation sent!");
        popup.style.display = "none";
      } else {
        const result = await response.json();
        throw new Error(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error("Error inviting friend:", error);
      alert("Error inviting friend. Please try again.");
    }
  }
});
