import axios from "axios";
import { handleApiError } from "./errorHandling";

// const API_URL = "http://localhost:5000/api/actions/posts";
const API_URL = "https://social-media-app-backend-khaki.vercel.app/api/actions/posts";
const TOKEN_KEY = "auth_token";

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


// ========== Like Post ==========
export const likePost = async (postId: string) => {
  try {
    const res = await api.post(`/${postId}/like`);
    console.log(res.data)

    return res.data;
  } catch (error: any) {
    console.error("Error liking post:", error);
    handleApiError(error, "LIKE_POST_FAILED");
  }
}

// ========== Load Comment ==========
export const loadComments = async (postId: string) => {
  try {
    const res = await api.get(`/${postId}/comments`);
    console.log(res.data)

    return res.data;
  } catch (error: any) {
    console.error("Error loading comments:", error);
    handleApiError(error, "LOAD_COMMENTS_FAILED");
  }
}

// ========== Add Comment ==========
export const addComment = async (postId: string, content: string, commentId?: string) => {
  try {
    const apiUrl = commentId ? `/${postId}/comments/${commentId}/reply` : `/${postId}/comment`

    const res = await api.post(apiUrl, { content });
    console.log(res.data)

    return res.data;
  } catch (error: any) {
    console.error("Error adding comment:", error);
    handleApiError(error, "ADD_COMMENT_FAILED");
  }
}

// ========== Delete Comment ==========
export const deleteComment = async (postId: string, commentId: string) => {
  try {
    const res = await api.delete(`/${postId}/comments/${commentId}`);
    console.log(res.data)

    return res.data;
  } catch (error: any) {
    console.error("Error deleting comment:", error);
    handleApiError(error, "DELETE_COMMENT_FAILED");
  }
}
