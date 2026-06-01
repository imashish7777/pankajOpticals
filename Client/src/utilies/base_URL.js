export const API_BASE_URL = (
  process.env.REACT_APP_API_URL || "http://localhost:3001"
).replace(/\/$/, "");

export const base_URL = `${API_BASE_URL}/`;
