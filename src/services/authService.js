const AUTH_KEY = "userToken"; // Key used to store the token or login state

// Check if the user is logged in
export const isUserLoggedIn = () => {
    return !!localStorage.getItem(AUTH_KEY); // Returns true if token exists, otherwise false
};

// Save user authentication token
export const loginUser = (token) => {
    localStorage.setItem(AUTH_KEY, token);
};

// Logout user (remove token from localStorage)
export const logoutUser = () => {
    localStorage.removeItem(AUTH_KEY);
};