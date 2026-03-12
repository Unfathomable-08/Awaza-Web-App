import axios from "axios";

const API_URL = "https://social-media-app-backend-khaki.vercel.app/api/notifications";
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

export const saveFCMToken = async (token: string) => {
  try {
    const res = await api.post(`/token`, { token });
    return res.data;
  } catch (error: any) {
    console.error("Error saving FCM token:", error);
    throw error;
  }
};

export const removeFCMToken = async (token: string) => {
  try {
    const res = await api.delete(`/token`, { data: { token } });
    return res.data;
  } catch (error: any) {
    console.error("Error removing FCM token:", error);
    throw error;
  }
};

export const sendPushNotification = async (recipientId: string, title: string, body?: string, data?: any) => {
  try {
    const res = await api.post(`/send`, { recipientId, title, body, data });
    return res.data;
  } catch (error: any) {
    console.error("Error sending push notification:", error);
    throw error;
  }
};
