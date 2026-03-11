import axios from "axios";
import type { User } from "../types";
import { AppError, extractErrorMessage } from "./errorHandling";

// const API_BASE = "http://localhost:5000/api/auth";
const API_BASE = "https://social-media-app-backend-khaki.vercel.app/api/account";
const TOKEN_KEY = "auth_token";

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
});

// Auto-attach JWT to every request
api.interceptors.request.use(async (config) => {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.warn("Failed to read token from storage", error);
  }
  return config;
});

// Helper: remove token
export const removeToken = async () => {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch (err) {
    console.error("Failed to remove token", err);
  }
};

// ============== Get Profile Info ==============
export const getProfileInfo = async ({username}: {username: string}): Promise<User | null> => {
  try {
    const res = await api.get<User>(`/get-profile?username=${username}`);
    console.log("Profile info:", res.data);
    return res.data;
  } catch (error: any) {
    const message = extractErrorMessage(error);

    if (axios.isAxiosError(error) && error.response) {
      const status = error.response.status;
      if (status === 401) {
        // Token expired or invalid
        removeToken();
        return null;
      }
    }

    throw new AppError(message, "FETCH_PROFILE_FAILED");
  }
};