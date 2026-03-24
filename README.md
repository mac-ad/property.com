# Property.com

A full-stack property listing platform with a Next.js frontend and Express API backend.

## Architecture

```
techkraft/
├── frontend/   # Next.js 16 — React UI (dev default: port 3002)
├── backend/    # Express 5 — REST API (default: port 4001, overridable via PORT)
```

| Layer    | Stack                                         |
| -------- | --------------------------------------------- |
| Frontend | Next.js 16, React 19, Tailwind CSS 4, shadcn  |
| Backend  | Express 5, TypeScript, PostgreSQL, Zod         |
| Database | PostgreSQL                                     |
| Testing  | Jest, Supertest                                |

## Prerequisites

Make sure you have the following installed:

- **Node.js** v18 or higher
- **pnpm** (`npm install -g pnpm`)
- **PostgreSQL** running locally (or a remote instance)

---

## Development environment

Use this when you are developing locally: hot reload on the backend (nodemon) and Next.js dev server on the frontend.

### 1. Clone the repository

```bash
git clone https://github.com/mac-ad/property.com.git
cd property.com
```

### 2. Set up PostgreSQL

Connect to your PostgreSQL instance and create two databases:

```sql
CREATE DATABASE main_db;
CREATE DATABASE test_db;
```

### 3. Backend — install, env, migrate, run

```bash
cd backend
pnpm install
```

Create a `.env` file in the `backend/` directory:

```env
# Assuming PostgreSQL listens on port 5432
DATABASE_URL=postgresql://<user>:<password>@localhost:5432/main_db
TEST_DATABASE_URL=postgresql://<user>:<password>@localhost:5432/test_db
NODE_ENV=development
# Optional: defaults to 4000 if unset
# PORT=4001
```

Run database migrations and seed data:

```bash
pnpm migrate
pnpm seed
```

Start the backend dev server:

```bash
pnpm dev
```

The API will be available at **http://localhost:4000** (or `http://localhost:$PORT` if you set `PORT`).

Verify it is running:

```bash
curl http://localhost:4000/test
# → "Hello World"
```

### 4. Frontend — install, env, run

Open a new terminal:

```bash
cd frontend
pnpm install
```

Create `frontend/.env` (or `.env.local`) so the frontend calls the same origin as your API:

```env
# Must match where the backend is reachable (scheme, host, port)
NEXT_PUBLIC_API_URL=http://localhost:4000
```

Start the Next.js dev server (configured for port **3002** in `package.json`):

```bash
pnpm dev
```

The app will be available at **http://localhost:3002**.

---

## Production environment

Use this when you deploy: compiled Node processes, no dev file watchers, and a production PostgreSQL (or managed database) URL.

### Backend

1. Set environment variables on the host or in your process manager (systemd, Docker, PM2, platform dashboard, etc.):

   - `DATABASE_URL` — production database connection string  
   - `NODE_ENV=production`  
   - `PORT` — port the API should listen on (often set by the host; default in code is 4000 if unset)

2. Install dependencies and build TypeScript to `dist/`:

   ```bash
   cd backend
   pnpm install
   pnpm build
   ```

3. Run migrations against the production database (same `DATABASE_URL` as runtime):

   ```bash
   pnpm migrate
   ```

   Seed only if your deployment process requires initial demo data (often skipped in production).

4. Start the API:

   ```bash
   pnpm start
   ```

   This runs `node dist/server.js`. Put a reverse proxy (nginx, Caddy, cloud load balancer) in front for HTTPS and routing if needed.

### Frontend

The browser bundle is built with `NEXT_PUBLIC_*` values **at build time**. Set `NEXT_PUBLIC_API_URL` to your public API base URL (including `https://` and no trailing slash issues your app expects) before building.

```bash
cd frontend
pnpm install
NEXT_PUBLIC_API_URL=https://api.yourdomain.com pnpm build
pnpm start
```

`pnpm start` runs the Next.js production server (default port **3000** unless you pass `-p` / set `PORT` per Next.js docs). In production, the frontend is often served behind the same domain as the app or a CDN; ensure CORS on the backend allows your deployed frontend origin if they differ.

---

## Running Tests

### Unit Tests (no database required)

```bash
cd backend
pnpm test:unit
```

### Integration Tests (requires PostgreSQL + test database)

Make sure your `TEST_DATABASE_URL` is configured in `.env`, then:

```bash
cd backend
pnpm test:integration
```

This will automatically run migrations on the test database, seed test data, execute the tests, and clean up.

### All Tests

```bash
cd backend
pnpm test
```

## Useful Commands

### Backend (`cd backend`)

| Command                | Description                           |
| ---------------------- | ------------------------------------- |
| `pnpm dev`             | Start dev server with hot reload      |
| `pnpm build`           | Compile TypeScript to `dist/`         |
| `pnpm start`           | Run compiled server (production)      |
| `pnpm test`            | Run all tests                         |
| `pnpm test:unit`       | Run unit tests only                   |
| `pnpm test:integration`| Run integration tests only            |
| `pnpm test:coverage`   | Run tests with coverage report        |
| `pnpm migrate`         | Run pending database migrations       |
| `pnpm migrate:down`    | Rollback last migration               |
| `pnpm seed`            | Seed the database with sample data    |

### Frontend (`cd frontend`)

| Command          | Description                 |
| ---------------- | --------------------------- |
| `pnpm dev`       | Start Next.js dev server    |
| `pnpm build`     | Create production build     |
| `pnpm start`     | Start production server     |
| `pnpm lint`      | Run ESLint                  |

## Quick reference

### Development (local)

```bash
# Terminal 1 — Backend
cd backend
pnpm install
# create .env with DATABASE_URL, TEST_DATABASE_URL, NODE_ENV=development
pnpm migrate
pnpm seed
pnpm dev

# Terminal 2 — Frontend
cd frontend
pnpm install
# create .env with NEXT_PUBLIC_API_URL=http://localhost:4000 (or your backend URL)
pnpm dev
```

Open **http://localhost:3002** in your browser (dev server port).

### Production (build + run)

```bash
# Backend
cd backend && pnpm install && pnpm build && pnpm migrate && NODE_ENV=production pnpm start

# Frontend (set API URL for your deployment)
cd frontend && pnpm install && NEXT_PUBLIC_API_URL=https://your-api.example.com pnpm build && pnpm start
```

Adjust hostnames, ports, process manager, and HTTPS/reverse proxy to match your infrastructure.
