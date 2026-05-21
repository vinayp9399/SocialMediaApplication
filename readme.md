# Nexus — Community Discussion Platform

> A modern, full-stack community platform where people gather to share ideas, discuss topics, and build communities around shared interests.

---

Live project Link- https://social-media-application-wi9u.vercel.app/

## Introduction

Nexus is a full-stack web application that replicates and improves upon the core experience of community-driven platforms like Reddit. It allows users to create accounts, build and join communities, publish posts, vote on content, and engage in threaded discussions — all wrapped in a clean, professional dark-themed interface.

The platform was built as a production-ready MVP with a clear separation between the frontend and backend, a relational database with a well-defined schema, cookie-based authentication, and protected routes — making it a solid foundation for a real-world social product.

**What makes Nexus different from a typical Reddit clone:**
- Editorial dark design system with its own visual identity (not a copy of Reddit's UI)
- `httpOnly` cookie-based auth instead of localStorage tokens — more secure by default
- Proper folder structure on both frontend and backend following industry conventions
- Optimistic UI updates for votes so the interface feels instant
- Context API with `useReducer` for predictable, scalable state management
- Profile pages showing a user's post and comment history

---

## Use Cases

### For End Users
- **Sign up and log in** securely to access the platform
- **Browse communities** and discover discussions across topics
- **Create communities** around any subject and become its founding member
- **Write posts** in text, image, or link format within any community
- **Vote on posts** (upvote or downvote) to surface the best content
- **Comment on posts** to engage in discussion
- **Sort content** by Hot (popularity) or New (recency)
- **View user profiles** to see someone's posts and comments
- **Protected access** — creating posts or communities requires being logged in

### For Developers / Teams
- Use as a **boilerplate** for any community or forum-style product
- Extend the schema to add features like nested comments, post flairs, or moderation
- Swap the frontend for a mobile app (React Native) while keeping the same backend API
- Add real-time features (WebSockets) on top of the existing REST API

---

## Industry Value

Community platforms are one of the most enduring categories on the internet. Reddit alone has over 1.5 billion monthly visits. The underlying pattern — communities, posts, votes, comments — powers forums, Q&A platforms (Stack Overflow), product communities (GitHub Discussions), internal company tools (Workplace by Meta), and creator communities (Patreon).

Nexus demonstrates:

**1. Social Engagement Infrastructure**
The voting system, comment threads, and community pages are the core engagement loops that keep users coming back. These same patterns are used in products worth billions of dollars.

**2. Scalable Content Architecture**
The database schema is designed so that posts belong to communities, votes are unique per user per post, and comments are linked to both posts and authors — making it straightforward to add pagination, search, and recommendation algorithms on top.

**3. Secure Authentication Flow**
Using `httpOnly` cookies means the token is never accessible to JavaScript — protecting against XSS attacks. This is the pattern used by production applications, not the `localStorage` approach used in most tutorials.

**4. Modular Codebase**
The clean separation between controllers, routes, middleware, and contexts means features can be added, modified, or removed without touching unrelated code — critical for team-based development.

**5. Real-World Deployment Ready**
The frontend deploys to Vercel out of the box. The backend deploys to Render or Railway. The database runs on Supabase or Neon. No custom infrastructure required.

---

## Roles

### Frontend Developer
Responsible for all UI/UX — building pages, components, and managing client-side state. Works with Next.js, Tailwind CSS, and the Context API. Consumes the REST API built by the backend developer.

### Backend Developer
Responsible for the API, business logic, authentication, and database operations. Works with Express, Prisma, and PostgreSQL. Exposes clean REST endpoints for the frontend to consume.

### Database Administrator / Architect
Responsible for the Prisma schema design, migrations, and query optimization. Ensures relations are correct, indexes are in place, and data integrity is maintained.

### Full-Stack Developer
Handles both frontend and backend — understands the full data flow from database to UI. Can debug issues that span both sides (e.g. a cookie not being sent, a Prisma query returning unexpected shape).

### DevOps / Deployment
Handles deployment pipelines, environment variables, and hosting configuration. Sets up Vercel for the frontend, Render/Railway for the backend, and a managed PostgreSQL instance.

---

## Tech Stack & Rationale

### Frontend

#### Next.js 14 (React Framework)
**What it is:** Next.js is a React framework that adds server-side rendering, file-based routing, middleware, and build optimizations on top of React.

**Why we used it:** Next.js 14's App Router gives us file-based routing out of the box — creating a new page is as simple as adding a file. Middleware support allowed us to implement protected routes at the edge without writing custom guards in every component. It also deploys to Vercel in one click.

**Key features used:**
- App Router with dynamic routes (`[slug]`, `[id]`, `[username]`)
- `middleware.js` for cookie-based route protection
- `Suspense` boundaries for handling async hooks at build time
- `"use client"` directive to opt into client-side rendering where needed

---

#### Tailwind CSS
**What it is:** A utility-first CSS framework where you style elements by composing small, single-purpose class names directly in your markup.

**Why we used it:** Tailwind eliminates the need to write and maintain separate CSS files. Every style decision is visible directly in the component, making it easier to build and iterate on UI. It also enforces a consistent design system through its configuration file — our custom color palette (`ink`, `gold`, `jade`, `rose`), font families, border radii, and shadows are all defined once in `tailwind.config.js` and reused everywhere.

**Key features used:**
- Custom theme extension (colors, fonts, border radii, shadows, keyframe animations)
- Responsive grid layouts (`grid-cols-1 lg:grid-cols-[1fr_300px]`)
- Dark-mode-first design with custom CSS utilities (`.card`, `.skeleton`, `.text-gold-gradient`)

---

#### Context API with useReducer
**What it is:** React's built-in state management solution. `createContext` creates a global store, `useReducer` manages complex state transitions with a pure function (like Redux but without the library).

**Why we used it over Redux:** For an MVP of this scale, Redux adds unnecessary boilerplate. Context API with `useReducer` gives us the same predictable state update pattern without installing additional packages or writing action creators, selectors, and reducers in separate files. Each domain (Auth, Posts, Communities, Comments) has its own context, keeping concerns separated.

**Key features used:**
- `AuthContext` — stores the logged-in user, handles login/signup/logout
- `PostsContext` — stores all posts, handles optimistic vote updates
- `CommunitiesContext` — stores communities, handles join toggle and creation
- `CommentsContext` — stores comments per post with deduplication via `SET` action

---

#### Axios
**What it is:** A promise-based HTTP client for making API requests from the browser.

**Why we used it over fetch:** Axios automatically serializes request bodies to JSON, parses response bodies, and handles errors through a consistent `err.response` object. Most importantly, the `withCredentials: true` option on our shared `api` instance ensures cookies are sent with every request automatically — something that requires manual configuration with `fetch`.

**Key feature used:**
- Shared `axios` instance in `lib/api.js` with `baseURL` and `withCredentials: true` set once, used everywhere

---

### Backend

#### Node.js + Express
**What it is:** Node.js is a JavaScript runtime for the server. Express is a minimal web framework for Node.js that handles routing, middleware, and HTTP request/response management.

**Why we used it:** Express is the most widely adopted Node.js framework, with a massive ecosystem and straightforward mental model. Its middleware pattern maps cleanly to our needs — `cookie-parser` for reading cookies, `cors` for cross-origin requests, and our own `verifyToken` middleware for protecting routes. The lightweight nature of Express means the server starts fast and adds no unnecessary overhead.

**Folder structure:**
```
backend/
├── controllers/   ← business logic (what happens for each request)
├── routes/        ← URL definitions (which controller handles which URL)
├── middleware/    ← reusable request processing (auth guard)
├── config/        ← shared setup (Prisma client)
└── server.js      ← entry point
```

---

#### PostgreSQL
**What it is:** A powerful, open-source relational database that stores data in structured tables with enforced relationships between them.

**Why we used it:** Nexus has clear relational data — users have posts, posts belong to communities, votes belong to users and posts, comments belong to posts and users. A relational database with foreign keys and constraints is the right tool for this. PostgreSQL is also the most feature-rich open-source SQL database, with excellent support for JSON, full-text search, and complex queries.

**Why not MongoDB:** A document database would force us to either embed votes inside posts (making vote queries slow at scale) or manage references manually without the safety of foreign key constraints. SQL's `JOIN` operations and unique constraints (like `@@unique([userId, postId])` on votes) handle these relationships correctly and efficiently.

---

#### Prisma ORM
**What it is:** A next-generation ORM (Object Relational Mapper) for Node.js that lets you define your database schema in a type-safe `schema.prisma` file and interact with the database using a clean JavaScript API.

**Why we used it over raw SQL:** Prisma generates a fully type-aware client from the schema, so queries like `prisma.post.findMany({ include: { author: true } })` are readable, auto-completed, and protected from typos. Migrations are handled via `npx prisma db push`. The `include` and `select` APIs prevent over-fetching — we never accidentally send a user's hashed password to the frontend.

**Key features used:**
- `@relation` fields to define foreign keys
- `@@unique([userId, postId])` on `Vote` to enforce one vote per user per post
- `include` with nested `_count` for getting comment and vote counts in a single query
- `select` to explicitly whitelist safe fields (never returning `password`)

---

#### JSON Web Tokens (JWT) + bcryptjs
**What it is:** JWT is a standard for encoding user identity as a signed, tamper-proof token. bcryptjs is a library for hashing passwords before storing them.

**Why we used it:**
- **bcryptjs** ensures passwords are never stored as plain text. Even if the database is compromised, the hashed passwords are computationally infeasible to reverse.
- **JWT** lets the server encode the user's `id`, `email`, and `username` into a token, sign it with a secret key, and verify it on every protected request — without hitting the database each time.
- **httpOnly cookies** are used to store the JWT instead of localStorage. This means JavaScript on the page can never read the token, protecting against XSS (Cross-Site Scripting) attacks. This is the production-grade approach.

---

#### cookie-parser
**What it is:** Express middleware that parses the `Cookie` header from incoming requests and makes cookies available as `req.cookies`.

**Why we used it:** Our `verifyToken` middleware reads `req.cookies.token` to authenticate requests. Without `cookie-parser`, Express would not parse the cookie header automatically.

---

### Database Schema Design

```
User ──< Post ──< Comment
 │                  │
 └──< Vote ──> Post │
                    │
Community ──< Post  │
                    │
User ──────────< Comment
```

The schema enforces:
- A user can only cast one vote per post (`@@unique([userId, postId])`)
- Deleting a post cascades to remove its votes and comments
- Passwords are never exposed — `select` always excludes the `password` field

---

## Running the Project

### Backend
```bash
cd backend
npm install
# configure .env with your DATABASE_URL and JWT_SECRET
npx prisma db push
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

**Requirements:** Node.js 18.17+ · PostgreSQL 14+

---

*Built with Next.js 14, Express, PostgreSQL, and Prisma.*
