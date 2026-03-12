import axios from "axios";
import type { User } from "../types";
import { AppError, extractErrorMessage } from "./errorHandling";
import { removeFCMToken } from "./notifications";

// const API_BASE = "http://localhost:5000/api/auth";
const API_BASE = "https://social-media-app-backend-khaki.vercel.app/api/auth";
const TOKEN_KEY = "auth_token";

// Axios instance configuration
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

// Helper: save token
const saveToken = async (token: string) => {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.setItem(TOKEN_KEY, token);
  } catch (err) {
    console.error("Failed to save auth token", err);
    throw new AppError("Failed to save login session", "STORAGE_ERROR");
  }
};

// Helper: remove token
export const removeToken = async () => {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch (err) {
    console.error("Failed to remove token", err);
  }
};


// ============== SIGN UP ==============
export const signUp = async (
  email: string,
  password: string,
  username: string
): Promise<User> => {
  try {

    const res = await api.post<{ user: User; token?: string }>(
      "/signup",
      { username, email, password }
    );
    console.log(res)

    const token = res.data.token;
    if (token) await saveToken(token);

    return res.data.user;
  } catch (error: any) {
    console.log(error)
    const message = extractErrorMessage(error);

    // Handle specific known errors
    if (axios.isAxiosError(error) && error.response) {
      const status = error.response.status;
      if (status === 400) throw new AppError(message || "Invalid signup data", "VALIDATION_ERROR", status);
      if (status === 409) throw new AppError("Email or username already exists", "ALREADY_EXISTS", status);
      throw new AppError(message, "SIGNUP_FAILED");
    }
    throw new AppError(message, "SIGNUP_FAILED");
  }
};


// ============== VERIFY CODE ==============
export const verifyCode = async (code: string): Promise<{ message: string }> => {
  try {
    const res = await api.post<{ message: string }>("/verify-code", { code });
    console.log(res)

    return res.data;
  } catch (error: any) {

    console.log(error)
    const message = extractErrorMessage(error);

    if (axios.isAxiosError(error) && error.response) {
      const status = error.response.status;
      if (status === 400) throw new AppError("Invalid or expired code", "INVALID_CODE", status);
      if (status === 410) throw new AppError("Verification code expired", "CODE_EXPIRED", status);
    }

    throw new AppError(message || "Failed to verify code", "VERIFICATION_FAILED");
  }
};


// ============== RESEND CODE ==============
export const resendCode = async (): Promise<{ message: string }> => {
  try {
    const res = await api.post<{ message: string }>("/resend-code");
    return res.data;
  } catch (error: any) {
    const message = extractErrorMessage(error);
    throw new AppError(message || "Failed to resend code", "RESEND_FAILED");
  }
};


// ============== LOGIN ==============
export const signIn = async (login: string, password: string): Promise<User> => {
  try {
    const res = await api.post<{ user: User; token?: string }>("/login", {
      login,
      password,
    });
    console.log(res)

    const token = res.data.token;
    if (!token) {
      throw new AppError("Login succeeded but no token received", "NO_TOKEN");
    }

    await saveToken(token);

    // Check verification status
    if (!res.data.user.isVerified) {
      throw new AppError("Please verify your email before logging in", "EMAIL_NOT_VERIFIED");
    }

    return res.data.user;
  } catch (error: any) {

    console.log(error)
    if (error instanceof AppError) throw error; // Re-throw known auth errors

    const message = extractErrorMessage(error);

    if (axios.isAxiosError(error) && error.response) {
      const status = error.response.status;
      if (status === 401) {
        throw new AppError("Invalid email/username or password", "INVALID_CREDENTIALS", status);
      }
      if (status === 403) {
        throw new AppError("Please verify your email first", "EMAIL_NOT_VERIFIED", status);
      }
      if (status === 429) {
        throw new AppError("Too many attempts. Try again later.", "RATE_LIMITED", status);
      }
    }

    throw new AppError(message || "Login failed", "LOGIN_FAILED");
  }
};


// ============== GET CURRENT USER ==============
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const res = await api.get<{ user: User; token?: string }>("/me");

    const token = res.data?.token;
    if (token) await saveToken(token);

    return res.data.user;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      const status = error.response.status;
      if (status === 401 || status === 403) {
        await removeToken();
        throw new AppError("Session expired. Please log in again", "UNAUTHORIZED", status);
      }
    }
    // For other errors (network, etc.), don't log out, just return null
    return null;
  }
};

// ============== LOGOUT ==============
export const logOut = async () => {
  try {
    const fcmToken = localStorage.getItem('fcmToken');
    if (fcmToken) {
      await removeFCMToken(fcmToken);
      localStorage.removeItem('fcmToken');
      localStorage.removeItem('notificationsEnabled');
    }
  } catch (err) {
    console.error("Failed to unregister FCM token during logout", err);
  }
  await removeToken();
};

// ============== CHECK IF LOGGED IN (on app start) ==============
export const getStoredToken = async (): Promise<string | null> => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
};

export const initAuth = async (): Promise<User | null> => {
  const token = await getStoredToken();
  if (!token) return null;

  try {
    return await getCurrentUser();
  } catch (error) {
    return null;
  }
};