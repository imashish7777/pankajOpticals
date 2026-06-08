export const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "https://pankajopticals.onrender.com"
).replace(/\/$/, "");

export const base_URL = `${API_BASE_URL}/`;
