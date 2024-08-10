import { configURL, setCookie } from "../../global.js";

export async function handleLogin(event) {
    event.preventDefault(); // Verhindert das Standardverhalten des Formulars
    const loginForm = event.target;
    const formData = new FormData(loginForm);
    const username = formData.get("username");
    const password = formData.get("password");
  
    try {
      const response = await fetch(`${configURL.API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });
  
      const data = await response.json();
  
      
      if (response.ok && data.token && data.userId) {
        alert("Successfully logged in!");
        setCookie(
          "authData",
          JSON.stringify({
            token: data.token,
            userId: data.userId,
            role: data.role,
          }),
          1,
        ); // Setzen des Auth-Daten-Cookies für 1 Tag
        localStorage.setItem(
          "user",
          JSON.stringify({ username: username, role: data.role }),
        );
          window.location.href = "/calendar";
      } else {
        console.error("Login failed - Response status:", response.status);
        console.error("Login failed - Response data:", data);
        alert(data.message || "Invalid login credentials. Please try again.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("An error occurred. Please try again later.");
    }
  }
