/**
 * @file types/index.ts
 * @description Centralized TypeScript interfaces and types for the application.
 */

export interface User {
  id: string;
  username: string;
  email: string;
  isVerified: boolean;
  avatar?: string;
  name?: string;
  token?: string;
  bio?: string;
  followersCount?: number;
  followingCount?: number;
  postsCount?: number;
}

export interface Post {
  id: string;
  _id?: string;
  content: string;
  image?: string;
  user: User;
  likes: string[];
  likesCount: number;
  commentsCount: number;
  createdAt: string;
  isPublic?: boolean;
}

export interface Comment {
  id: string;
  _id: string;
  content: string;
  user: User;
  likes: string[];
  likesCount: number;
  replies?: Comment[];
  createdAt: string;
  postId: string;
  parentId?: string;
}

export type LoadFeedParams = {
  isLoadMore?: boolean;
  loading: boolean;
  setLoading: (val: boolean) => void;
  refreshing: boolean;
  setRefreshing: (val: boolean) => void;
  hasMore: boolean;
  setHasMore: (val: boolean) => void;
  cursor?: string | null;
  setCursor?: (val: string | null) => void;
  setPosts: (updater: any) => void;
  isProfile?: boolean;
  username?: string;
  setTotalPosts?: (val: number) => void;
};
