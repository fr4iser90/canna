import {
  fetchUsers,
  addUserToTable,
  editUser,
  deleteUser,
  createUser,
} from "../controllers/userManagerController.js";

export async function initializeUserManager() {
  const userForm = document.getElementById("userForm");
  const userTable = document.getElementById("userTable").getElementsByTagName("tbody")[0];

  userForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    const userData = {
      username: document.getElementById("username").value,
      password: document.getElementById("password").value,
      role: document.getElementById("role").value,
    };

    try {
      const newUser = await createUser(userData);
      if (newUser) {
        addUserToTable(newUser, userTable);
        userForm.reset();
      } else {
        alert("Error: Failed to add user.");
      }
    } catch (error) {
      console.error("Error adding user:", error);
    }
  });

  fetchUsers(userTable);
}
