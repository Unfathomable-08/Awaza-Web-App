# Rendering Pipeline

This document explains the step-by-step rendering pipeline of the Awaza Web App, covering how the application initializes, how data changes update the view, and how components interact with context and the Express REST APIs.

## Application Initialization

```mermaid
sequenceDiagram
    participant Browser
    participant main.tsx
    participant App.tsx
    participant AuthProvider
    participant ExpressBackend
    participant Router
    participant Pages
    
    Browser->>main.tsx: Load Javascript Bundle
    main.tsx->>App.tsx: Render <App /> (with <InstallApp />)
    App.tsx->>AuthProvider: Initialize Context
    AuthProvider->>AuthProvider: Show Loading Spinner
    AuthProvider->>ExpressBackend: initAuth() Check via /api/auth/me
    ExpressBackend-->>AuthProvider: Return User or 401 Unauthorized
    AuthProvider->>App.tsx: Provide { user, isLoading: false }
    App.tsx->>Router: Render <AppRoutes />
    Router->>Pages: Evaluate Route based on User State
```

## Component Rendering Lifecycle

React 19 function components use hooks (`useState`, `useEffect`, `useCallback`) to manage the component lifecycle.
When a route changes or internal state is modified:

1. **Trigger:** User interaction, network response, or context update.
2. **Render phase:** React calls the function component to figure out what the UI should look like.
3. **Commit phase:** React applies changes to the DOM.
4. **Effect phase:** `useEffect` hooks fire after formatting the UI to handle side effects (like data fetching from Express).

### Data Loading Pattern

The application heavily utilizes an effect-driven data-fetching pattern:

```mermaid
stateDiagram-v2
    [*] --> InitialMount
    InitialMount --> FetchState: useEffect runs
    FetchState --> LoadingUI: Set isLoading = true
    LoadingUI --> RequestData: Axios GET Request to /api/
    RequestData --> Success: Data received
    RequestData --> Error: Fetch failed
    
    Success --> UpdateState: Set data, isLoading = false
    Error --> ShowToast: Show Error UI
    
    UpdateState --> RenderData: Component Re-renders with content
```

### Protected Routes Pipeline

Most routes in the application are strictly protected. The pipeline for checking this is highly deterministic:

1. User attempts to navigate to `/home`.
2. Router interprets `<Route path="/home" element={user ? <Home /> : <Navigate to="/welcome" replace />} />`.
3. If the `AuthContext` provides a valid user object, `<Home/>` mounts.
4. If not, the application synchronously replaces the history state and redirects to `/welcome`, bypassing the render of `<Home />`.
