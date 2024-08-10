import { configURL, deleteAllCookies, fetchWithAuth } from "../global.js";

export async function logout() {
  const token = getToken();
  if (!token) {
    window.location.href = "/login";
    return;
  }

  try {
    const response = await fetchWithAuth(
      `${configURL.API_BASE_URL}/api/auth/logout`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (response.ok) {
      deleteAllCookies();
      localStorage.removeItem("user"); // Make sure to remove user data as well
      window.location.href = "/login";
    } else {
      alert("Failed to log out");
    }
  } catch (error) {
    console.error("Error during logout:", error);
    alert("An error occurred. Please try again later.");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const logoutLink = document.getElementById("logoutLink");
  if (logoutLink) {
    logoutLink.addEventListener("click", logout);
  }
});
