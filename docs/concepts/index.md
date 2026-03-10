# Core Concepts

This section covers the underlying domain concepts used across the Awaza Web App platform.

## 1. Users

A User object contains standard identification and profile settings:
- **`id`**: Unique identifier.
- **`username`**: User's customizable display handle.
- **`email`**: Identifier for login and communication.
- **`avatar`**: URL pointing to their profile image.
- **`isVerified`**: Boolean tracking if the user completed the `/api/auth/verify-code` step.

## 2. Posts

Posts are the fundamental content units in the app. Each post is structured with:
- **`id`**: Unique post identifier.
- **`authorId`**: Reference back to a User.
- **`content`**: The text/media body of the post.
- **`timestamp`**: Time of creation, used sorting the feed.
- **`reactions`**: Interaction counts for rendering stats like the total number of comments or likes.

## 3. The Feed

The Feed is an aggregated stream of `Posts`. The system uses pagination logic in `feed.ts` and `Feed.tsx`. It relies on a `cursor` property attached to URL searches (e.g., `?limit=5&cursor=nextCursorValue`) sent via `axios` to the Vercel backend to lazily load batches of new posts as the user scrolls down, optimizing front-end memory.

## 4. Comments and Nested Trees

To achieve Reddit-style nested discussions, Comments reference both:
- A `postId` (the parent post).
- A `parentId` (the comment directly above it, or `null` if top-level).

The recursive builder utility `buildCommentTree.ts` creates hierarchial UI nodes from a flat list retrieved from the Express database, which are then rendered by the `NestedComment.tsx` UI component.

## 5. Inbox (Messaging)

Messages (`Inbox.tsx`, `Chat.tsx`) provide real-time user-to-user communication. The chat metadata (who is conversing with whom) is maintained over standard REST HTTP via `inbox.ts`. However, the *actual* message sending and receiving uses the Firebase Realtime Database to achieve sub-second latency websockets exclusively for that component.
