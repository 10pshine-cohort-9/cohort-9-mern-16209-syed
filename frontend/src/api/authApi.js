import api from "./api";

// Register a new user
export const registerUser = (userData) => {
  return api.post("/auth/register", userData);
};

// Log in an existing user
export const loginUser = (userData) => {
  return api.post("/auth/login", userData);
};

// Optional helper: Fetch current user profile from server
export const getCurrentUser = () => {
  return api.get("/auth/me");
};

// Optional helper: Perform client-side cleanup on logout
export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};