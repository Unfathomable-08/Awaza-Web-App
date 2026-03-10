# Folder Structure

This document provides an exhaustive, file-by-file breakdown of the Awaza Web App architecture. Understanding this structure is crucial, as you can understand everything about the project just by reading this document.

## `src/` Folder

The root directory for all application source code.

### `assets/`
Contains static resources such as images, icons, and fonts that are bundled by Vite.

### `components/`
Contains reusable, semi-dumb UI components that are shared across various pages in the application.

- **`Avatar.tsx`**: A component specifically designed to display a user's profile picture. It handles fallback logic if the user has no avatar set.
- **`Button.tsx`**: A customizable, reusable button component that ensures consistent styling, loading states, and disabled states across the app.
- **`CommentItem.tsx`**: Renders an individual comment on a post, including the author's information, content, and interaction buttons (like/reply).
- **`Feed.tsx`**: The core scrolling mechanism for viewing posts. It integrates with `feed.ts` to implement infinite scrolling or pagination.
- **`Header.tsx`**: The top navigation bar present on authenticated views, typically containing the app logo, page title, and user profile summary.
- **`Input.tsx`**: A standardized form input field used across login, signup, and settings pages to ensure consistent focus states and error styling.
- **`InstallApp.tsx`**: A specialized PWA component that prompts users on compatible devices to "Install" the web application directly to their home screen.
- **`NestedComment.tsx`**: A recursive component designed to display a tree of comments (Reddit-style threads), handling indentations for child replies.
- **`PostItem.tsx`**: Renders a single post in the Feed, bringing together user data, content, timestamps, and action buttons like "Like" or "Comment."
- **`ScreenWrapper.tsx`**: A layout component that acts as the standard bounding box for all pages, applying safe area padding and constraining maximum widths for responsive design.

### `contexts/`
Contains React Context Providers used to manage and share global client state without prop-drilling.

- **`authContext.tsx`**: The single source of truth for the active user's session. It provides `user`, `isLoading`, `login`, and `logout` properties to any component in the app.

### `lib/`
Contains third-party library initializations.

- **`firebase.ts`**: Initializes the Firebase SDK specifically and *only* for real-time chat data synchronization. All other backend needs are handled by Node.js/Express.

### `pages/`
Contains the top-level route components. Each file directly corresponds to a URL accessible by the user.

- **`AccountSetting.tsx`**: The user-facing dashboard for configuring app preferences and navigating to profile-editing subpages.
- **`Chat.tsx`**: A real-time messaging interface where users converse securely one-on-one (powered by Firebase RTDB/Firestore for instant latency).
- **`CheckEmail.tsx`**: The verification screen users see after signing up, prompting them to enter a code sent to their inbox.
- **`CommentDetails.tsx`**: A focused view parsing the context of a single comment and all its subsequent replies.
- **`ComposePost.tsx`**: The forms and upload logic allowing users to create new textual and image-based posts.
- **`Home.tsx`**: The primary dashboard for authenticated users, housing the main `Feed` of all recent posts.
- **`Inbox.tsx`**: The directory list that displays all active recent chats/conversations a user is part of.
- **`Login.tsx`**: Form handler for authenticating returning users using credentials.
- **`PostDetails.tsx`**: Detailed view of a single post, fetching its specific data, likers, and mapping out the `NestedComment` structure below it.
- **`Profile.tsx`**: Another user's public-facing view showing their avatar, bio, and historical posts.
- **`Signup.tsx`**: Registration page initializing a new user account with the Node+Express backend.
- **`UpdateProfile.tsx`**: Form where authenticated users modify their display name and profile image hookups.
- **`UpdateUsername.tsx`**: Dedicated form for checking constraints and mutating the user's `@username` identifier.
- **`Welcome.tsx`**: The unauthenticated landing page explaining the Awaza Web App's value proposition before login/signup.

### `utils/`
This folder is crucial. It contains all the non-view business logic, primarily consisting of Axios API wrappers communicating directly with the Node+Express backend hosted on Vercel.

- **`accountSetting.ts`**: API calls for mutating user profile metadata (`updateUsername`, `updateProfile`).
- **`actions.ts`**: Contains generic user-interaction API functions (like toggling follows/blocks).
- **`auth.ts`**: Master authentication API wrapper. Contains `signUp`, `signIn`, `verifyCode`, and session validators hitting the `/api/auth` endpoint. Handles JWT storage.
- **`buildCommentTree.ts`**: A pure utility function that transforms a flat array of comments returned by the backend into a nested hierarchical tree structure based on `parentId`.
- **`common.ts`**: Global helper functions (like date formatting or string truncation) used across multiple components.
- **`feed.ts`**: Handles the complex cursor logic and state management for paginated fetching of the main home feed.
- **`inbox.ts`**: API calls responsible for fetching metadata about recent chats and initiating new message instances.
- **`post.ts`**: API wrapper designated to fetching (`getPost`, `getFeed`) and creating (`createPost`) posts.
- **`postActions.ts`**: API wrappers for modifying existing posts (e.g., executing "Like", "Unlike", "Bookmark" endpoint commands).
- **`search.ts`**: Handles querying the backend database to return formatted results when users look up other accounts or specific post keywords.

## Root Configuration Files

- **`App.tsx`**: Manages the `<Routes>` map, applying guarded navigation so unauthenticated users are kicked back to Login.
- **`main.tsx`**: The absolute entry point mounting React 19 to the DOM, invoking `StrictMode`, Context Providers, and the Service Worker installer (`<InstallApp />`).
- **`package.json`**: Standard Node manifest handling Vite, Tailwind, React, and Firebase dependencies.
- **`vite.config.ts`**: Bundler rules, specifying plugins like `@vitejs/plugin-react` and `vite-plugin-pwa` for optimal production builds.
- **`tailwind.config.js`**: Houses the project's bespoke design tokens (colors, variants).
