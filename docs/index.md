# Awaza Web App Documentation

Welcome to the official documentation for the Awaza Web App. This application is a React-based Progressive Web App (PWA) built with TypeScript, Vite, and TailwindCSS. It communicates primarily with a custom Node.js + Express backend hosted on Vercel, and optionally utilizes Firebase for isolated real-time chat functionality.

## Table of Contents

- [Getting Started](./getting-started/index.md) - Setup, installation, and running the project locally.
- [Architecture](./architecture/overview.md) - High-level system design and architecture.
  - [Folder Structure](./architecture/folder-structure.md) - Detailed breakdown of the codebase organization.
  - [Rendering Pipeline](./architecture/rendering-pipeline.md) - How components are rendered and data flows.
- [Core Concepts](./concepts/index.md) - Posts, feeds, comments, and authentication.
- [API Reference](./api/index.md) - Client-side utility functions mapped to the Express backend.
- [How-To Guides](./how-to/index.md) - Step-by-step guides for common tasks.
- [Architecture Decisions (ADRs)](./decisions/index.md) - Historical context on technical choices (like Firebase over Supabase for RT Chat).
- [Glossary](./glossary.md) - Terms and definitions used in this project.
