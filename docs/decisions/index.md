# Architecture Decisions (ADRs)

We document our major technical choices here so developers can quickly understand the rationale behind the stack.

## ADR-001: Node.js + Express Backend

**Status:** Accepted

### Decision
The core web application interfaces exclusively with a custom Node.js + Express backend (hosted on Vercel) for standard operations like Post management, Authentication tracking, and User Profiles. 

### Consequence
This isolates our core business logic and database management into our own codebase, allowing for strict typings and decoupled scaling separate from the frontend client. 

---

## ADR-002: Firebase for Real-Time Chat Only

**Status:** Accepted

### Context
We needed a way to implement real-time one-on-one Chat features in the `Inbox.tsx` and `Chat.tsx` views. 

### Decision
We use Firebase explicitly and **only** for the real-time chat architecture, rather than implementing custom WebSockets (like Socket.io) in our Node/Express backend. 

### Rationale
- **Serverless Hosting Constraint:** Because our Node.js + Express backend is hosted on Vercel (a serverless environment), maintaining persistent, long-lived WebSocket connections is architecturally difficult and expensive. Serverless functions spin up and down dynamically, making stateful WebSocket connections unfeasible without complex third-party infrastructure.
- **Firebase vs Supabase:** While Supabase also provides excellent real-time capabilities and PostgreSQL structuring, we chose Firebase entirely as a matter of personal preference and team familiarity. 

### Consequences
- **Positive:** We achieve instant chat message syncing without maintaining complex server-state manually.
- **Negative:** Our client must bundle the Firebase JS SDK solely for this one feature, slightly increasing bundle size.
