function getAuthToken() {
    try {
        return localStorage.getItem("access_token") || null;
    } catch (error) {
        console.error("Error retrieving auth token:", error);
        return null;
    }
}

function setAuthToken(token) {
    try {
        if (!token) {
            localStorage.removeItem("access_token");
        } else {
            localStorage.setItem("access_token", token);
        }
    } catch (error) {
        console.error("Error setting auth token:", error);
    }
}

function removeAuthToken() {
    try {
        localStorage.removeItem("access_token");
    } catch (error) {
        console.error("Error removing auth token:", error);
    }
}

export { setAuthToken, getAuthToken, removeAuthToken };
