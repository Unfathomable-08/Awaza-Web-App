# API Reference

This directory catalogs the utility wrappers (`src/utils/`) the frontend uses to interface with the Node.js + Express backend. All these utilities use `axios` to make REST HTTP calls to `https://social-media-app-backend-khaki.vercel.app/api`.

## Authentication (`auth.ts`)
Manages all user authentication processes against the Node backend's `/api/auth/` routes.
- **`initAuth()`**: Called when the app loads. Validates the JWT stored in `localStorage` by hitting `/api/auth/me`.
- **`signIn(login, password)`**: Posts credentials to `/api/auth/login`. On success, stores the JWT to `localStorage`.
- **`signUp(email, password, username)`**: Posts new user data to `/api/auth/signup`.
- **`verifyCode(code)`**: Submits the email verification code string to `/api/auth/verify-code`.

## User Profiles (`accountSetting.ts`)
Endpoints designated for profile mutations.
- **`updateUsername(username)`**: Issues a `PUT` request to `/api/account/update` to change the user's handle.
- **`updateProfile(name, avatar)`**: Issues a `PUT` request to the same endpoint to update visual profile fields.

## Post Management (`post.ts`)
Contains operations for handling core content.
- **`createPost(data)`**: Hits `POST /api/posts/` with the post content and an optional image.
- **`getFeed(cursor, limit)`**: Hits `GET /api/posts/feed`. Incorporates cursor-based pagination parameters to support infinite scrolling.
- **`getPost(postId)`**: Fetches a single specific post via `GET /api/posts/:postId`.

## Inbox Metadata (`inbox.ts`)
Handles the REST calls to organize chats before Firebase takes over real-time duties.
- **`getChatsMetadata()`**: Hits `/api/inbox/chats` to fetch a list of all active conversational threads the user is a part of.
- **`createChatsMetadata(users)`**: Hits `POST /api/inbox/chats` to initialize a new conversation with a specific array of User IDs.
