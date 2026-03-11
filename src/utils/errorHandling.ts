/**
 * @file utils/errorHandling.ts
 * @description Centralized error handling logic and custom error classes.
 */

import axios, { AxiosError } from "axios";

/**
 * Custom error class for application-specific errors.
 */
export class AppError extends Error {
  code: string;
  status?: number;

  constructor(message: string, code: string = "UNKNOWN_ERROR", status?: number) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.status = status;
  }
}

/**
 * Extracts a human-readable error message from an API error.
 * 
 * @param error The original error (AxiosError or any other Error)
 * @returns A string message suitable for UI display
 */
export const extractErrorMessage = (error: AxiosError<any> | any): string => {
  if (error instanceof AppError) return error.message;

  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message?: string; error?: string }>;

    // Server responded with error status (4xx, 5xx)
    if (axiosError.response?.data) {
      return (
        axiosError.response.data.message ||
        axiosError.response.data.error ||
        `Server error: ${axiosError.response.status}`
      );
    }

    // Network error or no response
    if (axiosError.message === "Network Error") {
      return "No internet connection. Please check your network.";
    }

    return axiosError.message || "Request failed";
  }

  return error?.message || "An unexpected error occurred";
};

/**
 * Common handler for catching and transforming Axios errors into AppErrors.
 */
export const handleApiError = (error: any, defaultCode: string = "API_ERROR"): never => {
  const message = extractErrorMessage(error);
  const status = axios.isAxiosError(error) ? error.response?.status : undefined;
  
  throw new AppError(message, defaultCode, status);
};
