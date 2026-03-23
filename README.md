# TechKraft

A full-stack property listing platform with a Next.js frontend and Express API backend.

## Architecture

```
techkraft/
├── frontend/   # Next.js 16 — React UI (port 3000)
├── backend/    # Express 5 — REST API (port 4000)
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

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/mac-ad/property.com.git
cd techkraft
```

### 2. Set up PostgreSQL

Connect to your PostgreSQL instance and create two databases:

```sql
CREATE DATABASE techkraft;
CREATE DATABASE techkraft_test;
```

### 3. Set up the Backend

```bash
cd backend
pnpm install
```

Create a `.env` file in the `backend/` directory:

```env
DATABASE_URL=postgresql://<user>:<password>@localhost:5432/techkraft
TEST_DATABASE_URL=postgresql://<user>:<password>@localhost:5432/techkraft_test
NODE_ENV=development
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

The API will be available at **http://localhost:4000**.

Verify it's running:

```bash
curl http://localhost:4000/test
# → "Hello World"
```

### 4. Set up the Frontend

Open a new terminal:

```bash
cd frontend
pnpm install
pnpm dev
```

The app will be available at **http://localhost:3000**.

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

## Quick Start (TL;DR)

```bash
# Terminal 1 — Backend
cd backend
pnpm install
cp .env.example .env        # then edit with your DB credentials
pnpm migrate
pnpm seed
pnpm dev

# Terminal 2 — Frontend
cd frontend
pnpm install
pnpm dev
```

Open **http://localhost:3000** in your browser.