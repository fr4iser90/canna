export function handleLogout() {
    localStorage.removeItem("user");
    document.cookie = "authData=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = "/login.html";
}
