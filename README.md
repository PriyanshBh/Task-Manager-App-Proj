# Task Manager App

A fully featured task management platform built with Next.js 14, TypeScript, tRPC, Prisma, and Better Auth. The application lets every authenticated user create, update, delete, and filter personal tasks while enjoying light and dark theme options.

## Features

- 🔐 **Authentication with Better Auth** – Email/password sign-up, sign-in, and secure session handling.
- 🗂️ **Personal task boards** – Tasks are scoped to the currently authenticated user.
- ✏️ **CRUD workflows** – Create, edit, update status, and delete tasks.
- 🔍 **Filtering and search** – Quickly narrow results by title keywords and status.
- 🌓 **Dark mode** – Automatic system detection with manual toggle.
- ⚙️ **API powered by tRPC** – Type-safe client/server communication.
- 🗃️ **Prisma ORM with MongoDB** – Strongly typed database access backed by a document database.
- 🚀 **Production ready** – Includes environment configuration, schema sync scripts, linting, and deployment notes.
## Tech Stack

| Layer | Technology |
| ----- | ---------- |
| Framework | [Next.js 14 (App Router, TypeScript)](https://nextjs.org/) |
| API | [tRPC 11 (beta)](https://trpc.io/) |
| Auth | [Better Auth](https://better-auth.com/) |
| Database | MongoDB (via Prisma ORM) |
| ORM | [Prisma](https://www.prisma.io/) |
| Styling | [Tailwind CSS](https://tailwindcss.com/) + utility components |
| State/Data fetching | [@tanstack/react-query](https://tanstack.com/query/latest) |
| Theming | [next-themes](https://github.com/pacocoursey/next-themes) |

## Getting Started

### 1. Install dependencies

```bash
pnpm install
# or
yarn install
# or
npm install
```

### 2. Environment variables

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Set the following values:

- `DATABASE_URL` – MongoDB connection string. Example for Atlas: `mongodb+srv://user:password@cluster.mongodb.net/database?retryWrites=true&w=majority`
- `BETTER_AUTH_SECRET` – Random string for cookie/session signing. You can generate one with `openssl rand -hex 32`.
- `BETTER_AUTH_URL` – Public URL of the app (e.g., `http://localhost:3000` for local development).

### 3. Database setup

Initialize Prisma and sync the schema with your MongoDB database:

```bash
npx prisma generate
npx prisma db push
```

You can open Prisma Studio for debugging data:

```bash
npx prisma studio
```

### 4. Development server

Run the Next.js dev server:

```bash
npm run dev
# or pnpm dev / yarn dev
```

Visit `http://localhost:3000` to see the app. Any changes are automatically reloaded.

### 5. Production build

To build and preview a production version:

```bash
npm run build
npm run start
```

### 6. Linting

```bash
npm run lint
```

## Project Structure

```
.
├── prisma/
│   └── schema.prisma          # Database models and enums
├── src/
│   ├── app/
│   │   ├── api/               # tRPC + Better Auth route handlers
│   │   ├── layout.tsx         # Root layout and Providers wrapper
│   │   └── page.tsx           # Main dashboard page (server component)
│   ├── components/            # UI primitives (buttons, inputs, theme toggle)
│   ├── features/
│   │   ├── auth/              # Auth server actions and client screens
│   │   └── tasks/             # Task dashboard UI and logic
│   ├── lib/
│   │   ├── trpc/              # tRPC client utilities
│   │   └── utils.ts           # Tailwind helper
│   ├── server/
│   │   ├── api/               # tRPC routers and context
│   │   ├── auth/              # Better Auth configuration
│   │   └── db.ts              # Prisma client singleton
│   └── styles/                # Tailwind global styles
├── next.config.mjs
├── package.json
└── tailwind.config.ts
```

## Authentication Flow

1. Users register with email + password using Better Auth's email/password provider.
2. Sessions are persisted via secure cookies configured in `src/server/auth/index.ts`.
3. Server components access the session through `getServerSession`, while the tRPC context reads sessions directly from incoming requests.
4. Client components trigger auth mutations through server actions (`signInAction`, `signUpAction`, `signOutAction`).

## Task Management API

The `taskRouter` encapsulates all task-related operations:

- `task.list` – Returns the current user's tasks filtered by optional search text and status.
- `task.create` – Validates and persists new tasks.
- `task.update` – Ensures task ownership before updating.
- `task.delete` – Removes a task owned by the authenticated user.

All procedures are protected with tRPC middleware that checks for an authenticated session before accessing the Prisma client.

## Styling & Dark Mode

- Tailwind CSS powers the design system with a small set of reusable UI primitives (`Button`, `Input`, `Textarea`, `Badge`).
- `next-themes` automatically switches themes based on system preference and exposes a manual toggle via the `ThemeToggle` component.

## Deployment

The stack is optimized for deployment on Vercel, but any platform that supports Next.js is viable (Netlify, Railway, Render, etc.).

1. Provision a managed MongoDB database (MongoDB Atlas, Railway, Render, etc.).
2. Set the environment variables (`DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`) in the hosting provider.
3. Run `npx prisma db push` as part of your build step to sync the schema.
4. Build command: `npm run build`
5. Start command: `npm run start`

## Testing the Experience

1. Register a new account.
2. Create multiple tasks with different statuses.
3. Use the search box and status dropdown to filter tasks.
4. Edit an existing task to update its status/description.
5. Delete a task to confirm data isolation.
6. Toggle the theme between light and dark.

## Future Enhancements

- Add support for Google OAuth via Better Auth's provider system.
- Implement optimistic updates for an even snappier UI.
- Introduce task labels and due dates for advanced filtering.
- Build automated testing (unit + integration) using Vitest and Playwright.

## License

This project is provided as-is for demonstration purposes.
