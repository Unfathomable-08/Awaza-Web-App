import axios from "axios";
import { handleApiError } from "./errorHandling";

const API_URL = "https://social-media-app-backend-khaki.vercel.app/api/inbox";
const TOKEN_KEY = "auth_token"

const api = axios.create({
  baseURL: API_URL,
})

// Add token to every request
api.interceptors.request.use(async (config) => {
  const token = localStorage.getItem(TOKEN_KEY);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const searchUsers = async (username: string) => {
  try {
    const res = await api.get(`/username/${username}`);

    return res.data.users;
  }
  catch (error: any) {
    console.error("Error searching users:", error);
    handleApiError(error, "SEARCH_USERS_FAILED");
  }
}

export const searchUserByID = async (id: string) => {
  try {
    const res = await api.get(`/id/${id}`);

    return res.data.user;
  }
  catch (error: any) {
    console.error("Error searching user:", error);
    handleApiError(error, "SEARCH_USER_FAILED");
  }
}