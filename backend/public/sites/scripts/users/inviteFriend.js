import { loadFriendRequests } from "./loadFriendRequests.js";

export async function inviteFriend(friendId) {
  try {
    const response = await fetchWithCookies(
      `/api/friends/invite`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ friendId })
      }
    );

    if (response.ok) {
      alert('Friend invitation sent!');
      loadFriendRequests();
    } else {
      const result = await response.json();
      alert('Error: ' + result.message);
    }
  } catch (error) {
    console.error('Error inviting friend:', error);
  }
}
