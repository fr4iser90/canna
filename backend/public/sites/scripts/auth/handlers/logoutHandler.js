export async function handleLogout() {
    try {
        await fetchWithCookies('/api/auth/logout', { method: 'POST'});
        localStorage.removeItem("user");
        window.location.href = "/login";
    } catch (error) {
        console.error("Error during logout:", error);
        alert("An error occurred while logging out. Please try again.");
    }
}

