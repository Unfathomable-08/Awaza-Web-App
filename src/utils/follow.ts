import axios from "axios";
import type { User } from "../types";
import { AppError, extractErrorMessage } from "./errorHandling";

const API_BASE = "http://localhost:5000/api/follow";
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

// Follow a user
export const followUser = async ({userId, setIsFollowing}: { userId: string; setIsFollowing: (val: boolean) => void }): Promise<void> => {
    try {
        await api.post(`/${userId}/follow`);
        setIsFollowing(true)
    } catch (error) {
        const message = extractErrorMessage(error);
        throw new AppError(message, "FOLLOW_ERROR");
    }
};

// Unfollow a user
export const unfollowUser = async ({userId, setIsFollowing}: { userId: string; setIsFollowing: (val: boolean) => void }): Promise<void> => {
    try {
        await api.post(`/${userId}/unfollow`);
        setIsFollowing(false)
    } catch (error) {
        const message = extractErrorMessage(error);
        throw new AppError(message, "UNFOLLOW_ERROR");
    }
};

// Get followers of a user
export const getFollowers = async (userId: string): Promise<User[]> => {
    try {
        const response = await api.get(`/${userId}/followers`);
        return response.data;
    } catch (error) {
        const message = extractErrorMessage(error);
        throw new AppError(message, "FETCH_FOLLOWERS_ERROR");
    }
};

// Get following of a user
export const getFollowing = async (userId: string): Promise<User[]> => {
    try {
        const response = await api.get(`/${userId}/following`);
        return response.data;
    } catch (error) {
        const message = extractErrorMessage(error);
        throw new AppError(message, "FETCH_FOLLOWING_ERROR");
    }
};

// Check if current user follows a specific user
export const isFollowing = async (username: string): Promise<boolean> => {
    try {
        const response = await api.get(`/${username}/is-following`);
        return response.data.isFollowing;
    } catch (error) {
        const message = extractErrorMessage(error);
        throw new AppError(message, "CHECK_FOLLOWING_ERROR");
    }
};
