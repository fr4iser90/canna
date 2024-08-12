import { configURL } from "../global.js";
import { loadFriendsList } from "./loadFriendsList.js";
import { loadBlockedUsers } from "./loadBlockedUsers.js";

export async function blockFriend(friendId) {
  try {
    const response = await fetch(
      `${configURL.API_BASE_URL}/api/friends/block`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ friendId }),
      }
    );

    if (response.ok) {
      alert('Friend blocked!');
      loadFriendsList();
      loadBlockedUsers();
    } else {
      const result = await response.json();
      alert('Error: ' + result.message);
    }
  } catch (error) {
    console.error('Error blocking friend:', error);
  }
}
