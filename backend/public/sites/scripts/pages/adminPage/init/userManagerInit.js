import { checkTokenAndRedirect } from "../../../global.js";
import {
  fetchUsers,
  addUserToTable,
  editUser,
  deleteUser,
} from "../controllers/userManagerController.js";

export async function initializeUserManager() {
  await checkTokenAndRedirect();
  const userForm = document.getElementById("userForm");
  const userTable = document
    .getElementById("userTable")
    .getElementsByTagName("tbody")[0];

  userForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    const userData = {
      username: document.getElementById("username").value,
      password: document.getElementById("password").value,
      role: document.getElementById("role").value,
    };
    try {
      let response = await fetchWithAuth(
        `${configURL.API_BASE_URL}/api/admin/users`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        },
      );
      let data = await response.json();
      if (response.ok) {
        addUserToTable(data, userTable);
        userForm.reset();
      } else {
        alert("Error: " + data.message);
      }
    } catch (error) {
      console.error("Error adding user:", error);
    }
  });

  fetchUsers(userTable);
}
