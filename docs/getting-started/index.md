# Getting Started

This guide will help you set up the Awaza Web App locally for development.

## Prerequisites

- Node.js (v18 or higher recommended)
- npm (Node Package Manager)

## Installation Steps

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd awaza-web-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Create a `.env` file in the root directory. You will need the Firebase configuration keys specifically for the real-time chat functionality, but the core Node back-end is already hosted and pointed to intrinsically.
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```

4. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   The app will run at `http://localhost:5173` (or the port specified by Vite). It will automatically map `src/utils/` API calls to the pre-deployed Express backend on Vercel.

## Building for Production & PWA Testing

To create a production build with Progressive Web App support:
```bash
npm run build
```

You can preview the production build locally using:
```bash
npm run preview
```
