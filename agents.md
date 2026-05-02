# AGENTS.md

## Project Overview

This repository is a pet project for a film library. It is a monorepo with a Vue/TypeScript client and a Go server.

- Root package: `flicks`.
- Frontend: `client/`, package name `flicks-client`.
- Backend: `server/`, Go module `film-library/server`.
- Do not commit or expose `.env` files. Use `.env.example` as the public reference.

## Repository Layout

- `client/` contains the Vite frontend.
- `server/` contains the Go API.
- `scripts/dev.sh` starts the backend if `server/cmd/api/main.go` exists and then starts the frontend.
- `client/film-library.pen` is a design file and is ignored by git via `*.pen`.

## Root Commands

- `pnpm dev` or `npm run dev`: run `scripts/dev.sh` from the repo root.
- `pnpm dev:client` or `npm run dev:client`: run the Vite dev server in `client/`.
- `dev:server` exists in root `package.json` but is currently empty.

## Frontend Stack

- Vue 3 with `<script setup lang="ts">`.
- Vite 8 with `@vitejs/plugin-vue`.
- TypeScript is strict: `strict`, `noUnusedLocals`, `noUnusedParameters`, and `noFallthroughCasesInSwitch` are enabled.
- Pinia 3 is installed with `pinia-plugin-persistedstate` in `client/src/stores/store.ts`.
- Vue Router is used from `client/src/router/router.ts`.
- Ofetch is used through a singleton client in `client/src/api/http.ts`, wrapped by `client/src/composables/useAPI.ts`.
- Sass/SCSS is used for styling.

## Frontend Commands

Run frontend commands from `client/` unless using the root `dev:client` script.

- `pnpm dev`: start Vite.
- `pnpm build`: run `vite build --debug`.
- `pnpm preview`: preview the built app.
- `pnpm lint`: run ESLint.
- `pnpm lint:fix`: run ESLint with fixes.

There are no test scripts configured yet.

## Frontend Conventions

- Prefer imports through the `@` alias, which points to `client/src`.
- Existing TS imports include explicit `.ts` extensions, for example `@/router/router.ts`; follow the local pattern.
- Keep Vue components in single-file components with `<script setup lang="ts">` and template sections.
- Base reusable UI components live in `client/src/components/base/`.
- App-specific components live in `client/src/components/app/`.
- Layouts live in `client/src/layouts/` and route views live in `client/src/views/`.
- Shared types are exported from `client/src/types/index.ts`.
- Store setup lives in `client/src/stores/store.ts`; feature stores live next to it, for example `auth.ts`.
- API access should go through `useAPI()` from `client/src/composables/useAPI.ts`.
- Reuse the singleton ofetch instance from `client/src/api/http.ts`; do not create additional HTTP client instances unless there is a concrete need.

## Frontend Styling

- Global styles are imported from `client/src/styles/main.scss` in `client/src/main.ts`.
- CSS custom properties are defined in `client/src/styles/core/_root.scss`.
- SCSS color token variables are defined in `client/src/styles/core/_colors.scss` and forwarded through `client/src/styles/resources.scss`.
- SCSS metric token variables are defined in `client/src/styles/core/_variables.scss` and forwarded through `client/src/styles/resources.scss`.
- Component SCSS should use forwarded SCSS tokens like `$text-primary`, `$bg-page`, `$accent`, `$border-default`, `$padding-md`, `$border-radius-sm`, and `$transition-base` instead of direct `var(...)` references.
- Reuse existing mixins from `client/src/styles/mixins/` before adding new styling primitives.
- Component styles are organized under `client/src/styles/components/`; layout styles are under `client/src/styles/layouts/`.
- Dark theme tokens already exist under `:root.dark` and `:root[data-theme="dark"]`.
- The main fonts are Inter and Playfair Display, loaded from `client/src/assets/fonts/`.

## Frontend Lint Style

- No semicolons.
- Single quotes.
- No trailing commas.
- Object curly spacing is required.
- Vue multi-word component names are disabled.
- Vue block padding and attribute order are enforced by ESLint.
- `no-console` is a warning.

## Frontend Environment

Public environment reference is `.env.example`:

- `VITE_APP_API_URL`
- `VITE_APP_WS_URL`
- `VITE_APP_API_BEARER`

Do not read, print, commit, or copy values from `.env` or `client/.env` unless explicitly required for a task and safe to do so.

## Backend Stack

- Go 1.22.
- The server currently uses the standard library `net/http`.
- Entry point: `server/cmd/api/main.go`.
- Current route: `GET /health`, returns `ok`.
- Default port is `8080`; override with the `PORT` environment variable.
- CORS middleware lives in `server/internal/http/middleware.go`.
- CORS currently allows `http://localhost:5173` and `http://127.0.0.1:5173` with credentials.

## Backend Commands

Run backend commands from `server/`.

- `go run ./cmd/api`: start the API.
- `go test ./...`: run backend tests when tests exist.
- `gofmt -w <files>`: format edited Go files.

There are no third-party Go dependencies yet.

## Backend Conventions

- Keep server code under `server/internal/` except executable entry points under `server/cmd/`.
- Use `internal/http` for routing, handlers, and HTTP middleware.
- Use `internal/config` for configuration concerns.
- Use `internal/app` for application wiring as the backend grows.
- Prefer the standard library until a real need for a dependency appears.
- Always run `gofmt` on changed Go files.

## General Workflow Notes

- This is a young codebase; prefer small, direct changes over abstractions.
- Preserve the existing project structure and naming style.
- Check existing files before introducing new patterns or dependencies.
- If a task touches both client and server, verify each side with the relevant commands above.
- Do not add backward compatibility layers unless there is a concrete persisted or external contract to preserve.
