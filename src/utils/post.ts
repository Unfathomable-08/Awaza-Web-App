import axios from 'axios';
import { handleApiError } from './errorHandling';

// const API_URL = 'http://localhost:5000/api/posts';
const API_URL = 'https://social-media-app-backend-khaki.vercel.app/api/posts';
const TOKEN_KEY = "auth_token";

const api = axios.create({
  baseURL: API_URL,
});

// Add token to every request
api.interceptors.request.use(async (config) => {
  const token = localStorage.getItem(TOKEN_KEY);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


// ========== Create Post ==========
export const createPost = async (data: {
  content: string;
  image: string;
  isPublic?: boolean;
}) => {
  try {
    const res = await api.post('/', data);
    console.log('Post response:', res);
    return res.data;
  } catch (error: any) {
    console.error('Error creating post:', error);
    handleApiError(error, 'CREATE_POST_FAILED');
  }
};


// ========== Get All Posts (pagination) ==========
export const getFeed = async (cursor?: string, limit: number = 10) => {
  try {
    const params = new URLSearchParams();
    params.append("limit", limit.toString());

    if (cursor) {
      params.append("cursor", cursor);
    }

    const res = await api.get(`/feed?${params.toString()}`);
    console.log('Feed response:', res.data);

    let posts = [];
    let nextCursor = null;
    let hasMore = false;
    let success = true;
    let totalPosts = 0;

    if (Array.isArray(res.data)) {
      posts = res.data;
      hasMore = posts.length === limit;
    } else {
      posts = res.data.posts || [];
      nextCursor = res.data.nextCursor || null;
      hasMore = res.data.hasMore ?? (posts.length === limit);
      success = res.data.success;
      totalPosts = res.data.totalPosts;
    }

    return {
      posts,
      nextCursor,
      hasMore,
      success,
      totalPosts
    };
  } catch (error: any) {
    console.error('Error fetching feed:', error);
    handleApiError(error, 'FETCH_FEED_FAILED');
  }
};

// ========== Get All Posts (pagination) ==========
export const getPostsByUser = async (username: string, cursor?: string, limit: number = 10) => {
  try {
    const params = new URLSearchParams();
    params.append("limit", limit.toString());
    params.append("username", username);

    if (cursor) {
      params.append("cursor", cursor);
    }

    const res = await api.get(`/?${params.toString()}`);
    console.log('User posts response:', res.data);

    let posts = [];
    let nextCursor = null;
    let hasMore = false;
    let success = true;
    let totalPosts = 0;

    if (Array.isArray(res.data)) {
      posts = res.data;
      hasMore = posts.length === limit;
    } else {
      posts = res.data.posts || [];
      nextCursor = res.data.nextCursor || null;
      hasMore = res.data.hasMore ?? (posts.length === limit);
      success = res.data.success;
      totalPosts = res.data.totalPosts;
    }

    return {
      posts,
      nextCursor,
      hasMore,
      success,
      totalPosts
    };
  } catch (error: any) {
    console.error('Error fetching feed:', error);
    handleApiError(error, 'FETCH_FEED_FAILED');
  }
};


// ========== Get Single Post ==========
export const getPost = async (postId: string) => {
  try {
    const res = await api.get(`/${postId}`);
    console.log(res.data)

    return res.data;
  } catch (error: any) {
    console.error('Error fetching post:', error);
    handleApiError(error, 'FETCH_POST_FAILED');
  }
}
