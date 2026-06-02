export const getAuthHeaders = () => ({
  "x-auth-token": window.localStorage.getItem("token") || "",
});
