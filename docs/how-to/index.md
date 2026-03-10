# How-To Guides

This generic reference provides actionable how-tos for common developer tasks in the Awaza project.

## How to add a new Page route

1. Create a new component inside `src/pages/`, for example: `MyNewPage.tsx`.
   ```tsx
   export default function MyNewPage() {
       return <div>New Page</div>;
   }
   ```
2. Open `src/App.tsx`.
3. Import your page at the top.
4. Add a `<Route>` inside the `<Routes>` block. If the page should be restricted to authenticated users, use the standard pattern:
   ```tsx
   <Route path="/new-page" element={user ? <MyNewPage /> : <Navigate to="/login" replace />} />
   ```

## How to create a reusable logic hook

1. Define your hook in the `src/utils/` folder (or create a `src/hooks/` folder if it becomes heavily reliant on React primitives).
2. Follow standard function composition to separate React's `useState/useEffect` from the actual Firebase side effect.

## How to add a new Tailwind stylistic theme color

1. Open `tailwind.config.js`.
2. Under `theme.extend.colors`, modify or add entirely new token strings (e.g. `primary-light`, `secondary-brand`).
3. Reload your Vite process to ensure PostCSS accurately picks up the new utility classes.

## How to test PWA deployment features

1. Execute `npm run build` to compile the optimized source and inject the service worker map.
2. Run `npm run preview` to start the local distribution server exactly replicating a live production environment.
3. Open the Preview port on Chrome and use the "Application" tab in DevTools to inspect Service Workers, Manifest variables, and Installation prompts.
