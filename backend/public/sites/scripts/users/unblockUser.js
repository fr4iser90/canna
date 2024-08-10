import { fetchWithAuth } from "../global.js";
import { loadBlockedUsers } from "./loadBlockedUsers.js";

export async function unblockUser(userId) {
  try {
    const response = await fetchWithAuth('/api/friends/unblock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });
    if (response.ok) {
      alert('User unblocked!');
      loadBlockedUsers();
    } else {
      const result = await response.json();
      alert('Error: ' + result.message);
    }
  } catch (error) {
    console.error('Error unblocking user:', error);
  }
}

