export async function handleForgotPassword(event) {
    event.preventDefault();
    const forgotPasswordForm = event.target;
    const formData = new FormData(forgotPasswordForm);
    const email = formData.get("email");

    try {
        const response = await fetch(`/api/users/forgot-password`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        });

        const data = await response.json();

        if (response.ok) {
            alert("Password reset email sent");
            switchToLogin();
        } else {
            console.error("Forgot password failed - Response status:", response.status);
            console.error("Forgot password failed - Response data:", data);
            alert(data.message || "Failed to send password reset email. Please try again.");
        }
    } catch (error) {
        console.error("Error during forgot password:", error);
        alert("An error occurred. Please try again later.");
    }
}
