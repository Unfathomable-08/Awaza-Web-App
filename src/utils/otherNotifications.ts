import axios from "axios";

const API_URL = "https://social-media-app-backend-khaki.vercel.app/api/other-notifications";
const TOKEN_KEY = "auth_token";

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(async (config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getNotifications = async () => {
  try {
    const res = await api.get("/");
    console.log(res.data);
    return res.data;
  } catch (error: any) {
    console.error("Error fetching notifications:", error);
    throw error;
  }
};

export const markNotificationsAsRead = async (startId: string, endId: string) => {
  try {
    const res = await api.post("/mark-read", { startId, endId });
    return res.data;
  } catch (error: any) {
    console.error("Error marking notifications as read:", error);
    throw error;
  }
};
