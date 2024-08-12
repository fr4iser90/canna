import { configURL } from "../global.js";

export async function initializeChangePassword() {
  const changePasswordForm = document.getElementById("changePasswordForm");

  if (changePasswordForm) {
    changePasswordForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const formData = new FormData(changePasswordForm);
      const currentPassword = formData.get("currentPassword");
      const newPassword = formData.get("newPassword");

      try {
        const response = await fetch(`${configURL.API_BASE_URL}/api/users/changePassword`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ currentPassword, newPassword }),
        });

        if (response.ok) {
          alert("Password changed successfully");
        } else {
          const data = await response.json();
          alert(`Failed to change password: ${data.message}`);
        }
      } catch (error) {
        console.error("Error changing password:", error);
        alert("An error occurred. Please try again later.");
      }
    });
  }
}
