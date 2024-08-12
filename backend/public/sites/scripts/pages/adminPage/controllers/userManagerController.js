async function fetchUsers(userTable, dbFeedback) {
  try {
    let response = await fetch(`/api/admin/users`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: 'include',
    });
    let data = await response.json();
    if (response.ok) {
      data.forEach((user) => addUserToTable(user, userTable));
    } else {
      alert("Error: " + data.message);
    }
  } catch (error) {
    console.error("Error fetching users:", error);
  }
}

function addUserToTable(user, userTable) {
  let row = userTable.insertRow();
  row.setAttribute("data-id", user._id);
  row.insertCell(0).textContent = user.username;
  row.insertCell(1).textContent = user.role;
  let actionsCell = row.insertCell(2);
  let editButton = document.createElement("button");
  editButton.textContent = "Edit";
  editButton.onclick = () => editUser(user, userTable);
  actionsCell.appendChild(editButton);
  let deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.onclick = () => deleteUser(user._id, row);
  actionsCell.appendChild(deleteButton);
}

async function editUser(user, userTable) {
  const newUsername = prompt("Enter new username:", user.username);
  if (newUsername) {
    user.username = newUsername;
    try {
      let response = await fetch(`/api/admin/users/${user._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
        credentials: 'include',
      });
      if (response.ok) {
        let row = userTable.querySelector(`[data-id="${user._id}"]`);
        row.cells[0].textContent = user.username;
      } else {
        let data = await response.json();
        alert("Error: " + data.message);
      }
    } catch (error) {
      console.error("Error editing user:", error);
    }
  }
}

async function deleteUser(id, row) {
  if (confirm("Are you sure you want to delete this user?")) {
    try {
      let response = await fetchWithCookies(`/api/admin/users/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        row.remove();
      } else {
        let data = await response.json();
        alert("Error: " + data.message);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  }
}

export { fetchUsers, addUserToTable, editUser, deleteUser };
