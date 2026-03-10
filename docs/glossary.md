# Glossary

Reference definitions specific to the Awaza Web App terminology and underlying architecture choices.

## Terminology

| Term | Definition |
| :--- | :--- |
| **PWA (Progressive Web Application)** | A web application that acts like a native app, with service workers that can provide offline features, push notifications, and home screen installation capabilities. |
| **Vite** | The blazing-fast build tool and local development server used in this project. Distinct from Webpack or Create-React-App. |
| **TailwindCSS** | A utility-first CSS framework that compiles away unused code for maximum payload performance. Instead of predefined class components, styles are attached via helper names like `flex` and `p-4`. |
| **Vercel** | The serverless cloud hosting provider where the Node.js + Express backend infrastructure lives. |
| **Serverless API** | Functions that run on cloud infrastructure without the developer needing to maintain continuous server computing. When a user hits `/api/auth`, a Vercel container briefly boots to execute the Node code and then shuts down. |
| **Axios** | A Promise-based HTTP client for the browser. It abstracts vanilla `fetch()` and is used across all `src/utils` files. |
| **JWT (JSON Web Token)** | The authorization mechanism representing the user session, sent in the Header of API requests to the Node backend. |
| **AuthContext** | A React Provider responsible for checking the JWT using `/api/auth/me` on load and efficiently trickling it down across the React component tree avoiding props-drilling. |
