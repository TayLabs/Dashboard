# TayLabs Dashboard

An open-source, self-hosted admin dashboard for managing a TayLabs Auth environment. Built with Next.js and shadcn/ui, it provides a web interface for administering users, roles, permissions, services, and API keys across the TayLabs platform.

## Table of Contents

- [Features](#features)
- [Architecture Overview](#architecture-overview)
- [Prerequisites](#prerequisites)
- [Quick Start with Docker](#quick-start-with-docker)
- [Configuration](#configuration)
- [Development Setup](#development-setup)

---

## Features

- **User management** — view all users, edit role assignments, and force password resets
- **Role-based access control** — create, edit, and delete roles with fine-grained permission assignments
- **Service management** — register external services and define their permissions for use in roles and API keys
- **API key management** — create and manage API keys scoped to specific service permissions
- **Two-factor authentication** — enable TOTP authenticator apps and manage linked devices from the account security page
- **Profile management** — update display name, username, bio, and other profile fields
- **Password management** — change account password or trigger a reset from the security page
- **Email verification flow** — guided prompts for verifying a new account's email address
- **Session-aware routing** — middleware automatically redirects unauthenticated or pending-action users to the appropriate page
- **Docker-first deployment** — ships as a standalone Next.js image ready for use with the existing TayLabs compose stack

---

## Architecture Overview

The Dashboard is a Next.js application that acts as a frontend client for the TayLabs Auth and Keys APIs. It does not have its own database.

| Service | Purpose |
|---|---|
| **TayLabs Auth** | Primary API for authentication, users, roles, services, and TOTP |
| **TayLabs Keys** | API key management — queried alongside Auth to merge service and permission data |

All data fetching happens server-side via Next.js Server Actions, keeping API credentials and access tokens out of the browser. The session is managed with an `HttpOnly` access token cookie (`_access_t`) set by the Auth service and refreshed transparently by the dashboard middleware.

The middleware runs on every request (excluding static files and the auth pages) and silently refreshes the access token if it is about to expire, ensuring users are never unexpectedly logged out mid-session.

---

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/)
- The following companion images must be built and available locally:
  - `taylabs-auth` — clone [TayLabs/Auth](https://github.com/TayLabs/Auth) and run `pnpm docker:build`
  - `taylabs-keys` — clone [TayLabs/Keys](https://github.com/TayLabs/Keys) and run `pnpm docker:build`
  - `taylabs-mail` — clone [TayLabs/Mail](https://github.com/TayLabs/Mail) and run `pnpm docker:build`

---

## Quick Start with Docker

### Development (run the dashboard locally)

Spin up the Auth, Keys, Mail, and database infrastructure containers, then run the dashboard locally with the dev server.

> [!Note]
> Be sure to build the Auth, Keys, and Mail images first using `pnpm docker:build` in each respective repository.

```bash
# Clone the repository
git clone https://github.com/TayLabs/Dashboard.git
cd Dashboard

# Start infrastructure containers (Auth, Keys, Mail, Postgres, Redis)
docker compose --profile development up -d

# Install dependencies and start the dev server
pnpm install
pnpm dev
```

The dashboard will be available at `http://localhost:7919`.

### Production (fully containerised)

Build the dashboard image and bring up the full stack.

```bash
# Build the dashboard image
pnpm docker:build
# or: docker build -t taylabs-dashboard .

# Set required environment variables
export MAILTRAP_API_KEY=your_mailtrap_api_key
export MAIL_API_KEY=your_mail_service_api_key

# Start all services
docker compose --profile production up -d
```

> **Note:** The `production` profile starts all services including the dashboard container, exposed on port `8919`. The `development` profile starts only the infrastructure services and is intended for running the Next.js dev server locally.

### Useful compose commands

```bash
# Stop containers without removing them
pnpm docker:stop

# Start previously stopped containers
pnpm docker:start

# Stop and remove containers
pnpm docker:down
```

---

## Configuration

The following environment variables must be set when running the dashboard, either in a `.env` file for local development or passed directly to the container.

| Variable | Required | Description |
|---|---|---|
| `ACCESS_TOKEN_SECRET` | ✅ | Must match the secret used by the Auth service to sign access JWTs |
| `AUTH_API_URI` | ✅ | Host and port of the Auth API, e.g. `taylab-auth:7313` |
| `HOST_URI` | ✅ | Public-facing URL of the dashboard, used for redirects, e.g. `localhost:8919` |
| `SERVICE_NAME` | | Identifier used when scoping requests to the Auth service (default: `dashboard`) |

> **Note:** `ACCESS_TOKEN_SECRET` must be identical to the value configured in the Auth service, as the dashboard verifies tokens locally to determine session state and pending actions without making a round-trip to the API on every request.

---

## Development Setup

### Requirements

- Node.js
- Docker (for the Auth, Keys, Mail, Postgres, and Redis containers)

### Steps

```bash
# 1. Install dependencies
pnpm install

# 2. Start infrastructure
docker compose --profile development up -d

# 3. Start the dev server
pnpm dev
```

The dev server runs on port `7919` by default.

### Available scripts

| Script | Description |
|---|---|
| `pnpm dev` | Start the Next.js development server on port 7919 |
| `pnpm build` | Build the application for production |
| `pnpm start` | Start the production build on port 7919 |
| `pnpm lint` | Run ESLint across the project |
| `pnpm docker:build` | Build the `taylabs-dashboard` Docker image |
| `pnpm docker:up` | Start development infrastructure containers |
| `pnpm docker:start` | Start previously stopped containers |
| `pnpm docker:stop` | Stop running containers |
| `pnpm docker:down` | Stop and remove containers |

---

## License

This project is licensed under the **GNU Affero General Public License v3.0**. See [LICENSE](./LICENSE) for details.

In short: if you run a modified version of this software on a network server, you must make the source code of your modifications available to users of that service.
