<p align="center">
  <img src="./asset/andromeda-logo.png" alt="Andromeda logo" width="240" />
</p>

<p align="center"><em>Your key, your book.</em></p>

---
[![codecov](https://codecov.io/gh/nova-collective/andromeda/graph/badge.svg?token=Y9crT7fh7l)](https://codecov.io/gh/nova-collective/andromeda) [![HitCount](https://hits.dwyl.com/nova-collective/andromeda.svg)](https://hits.dwyl.com/nova-collective/andromeda)

Andromeda is an open-source web3 publishing platform that lets authors mint their works as NFTs and deliver them directly to readers. By coupling a Next.js front-end with Polygon smart contracts and MongoDB persistence, the project aims to redefine the relationship between authors and readers while keeping operational costs low.

## Table of Contents

- [Table of Contents](#table-of-contents)
- [Why Andromeda](#why-andromeda)
- [Key Features](#key-features)
- [Architecture \& Tech Stack](#architecture--tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Setup](#setup)
  - [Run the App](#run-the-app)
- [Available Scripts](#available-scripts)
- [Testing \& Coverage](#testing--coverage)
  - [Test conventions](#test-conventions)
- [Continuous Integration](#continuous-integration)
- [Documentation](#documentation)
- [Deployment \& Environments](#deployment--environments)
- [Contributing](#contributing)
- [License](#license)

## Why Andromeda

- **Direct author-to-reader distribution**: Authors mint limited editions, set pricing, and receive payment without intermediaries.
- **Certified ownership**: Readers collect NFTs that prove ownership of a digital edition—akin to a signed physical copy.
- **Sustainable model**: Gas fees and a light platform commission fund ongoing maintenance without advertising or sponsorship lock-in.
- **Inclusive roadmap**: Built with accessibility in mind so screen-reader and wallet-based flows can eventually purchase and read books without extra tooling.

## Key Features

- **Authentication & Authorization**: JWT bearer tokens with user/group permission merging, Joi-based validation, and reusable middleware helpers.
- **User & Group Management**: RESTful APIs for CRUD operations, uniqueness enforcement, and normalized Joi schemas.
- **Password Utilities**: Centralized hashing, comparison, and strength validation.
- **Configurable Patterns**: Shared regex utilities for IDs, usernames, wallets, and emails across services.
- **Smart Contract Tooling**: Hardhat-powered workspace prepared for ERC-1155 book minting and sales contracts.
- **Documentation First**: Each API route and validator module ships with inline JSDoc and README guidance.

## Architecture & Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend & API | Next.js App Router (React 19, TypeScript, Tailwind CSS 4) |
| Authentication | JWT (jsonwebtoken), bearer tokens, bcryptjs |
| Database | MongoDB + Mongoose repositories |
| Blockchain | Hardhat (Solidity 0.8), Polygon PoS (Mainnet & Amoy) |
| Tooling | pnpm, Vercel CLI/hosting, ESLint, PostCSS |

Repository highlights:

- `src/app/api` – Next.js API route handlers for auth, users, groups, and validators.
- `src/app/lib` – Shared services, repositories, types, utils, and validators with modular documentation.
- `contracts` & `ignition` – Solidity contracts plus deployment scripts (Hardhat Ignition).
- `public/assets` – Static assets consumed by the frontend.

## Getting Started

### Prerequisites

- Node.js 22.20.0 and pnpm 10.16.1 (consider using `nvm`).
- Vercel CLI (`npm i -g vercel`).
- Local MongoDB instance or a connection string (e.g., MongoDB Atlas).

### Setup

```bash
pnpm install
vercel login            # requires access to the Vercel project
vercel link             # link local repo to Vercel project
vercel env pull .env.local
```

Configure MongoDB:

1. Start `mongod` locally or provision a remote cluster.
2. (Optional) Use MongoDB Compass to create a database named `andromeda`.
3. Ensure the connection string you pulled via Vercel points to the running instance.

### Run the App

```bash
# Development (recommended during active work)


# Production build & serve
pnpm build
pnpm start
```

Visit `http://localhost:3000` once the server is running.

> Fonts are optimized using [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) with Vercel's Geist family.

## Available Scripts

- `pnpm dev` – Start the Next.js dev server.
- `pnpm build` – Create an optimized production build.
- `pnpm start` – Run the production server (after `pnpm build`).
- `pnpm lint` – Execute ESLint with the shared config.
- `node test-password-utils.mjs` – Smoke-test password hashing utilities.

## Testing & Coverage

- `pnpm test` – Run the full Vitest suite once.
- `pnpm test -- --watch` – Re-run tests on file changes while developing.
- `pnpm test:coverage` – Generate a coverage report with source maps.

The project uses [Vitest](https://vitest.dev/), React Testing Library, and `@testing-library/jest-dom` for unit and integration-style tests across API routes, React components, and library utilities. Coverage reports are output to `coverage/` (HTML + JSON). After running `pnpm test:coverage`, open `coverage/index.html` in a browser to inspect per-file metrics.

### Test conventions

- Place new tests next to the code they exercise (e.g., `feature.ts` → `feature.test.ts`).
- Mock external services (MongoDB, JWT, bcrypt) via Vitest's module mocking to keep tests deterministic.
- Avoid `any`; prefer explicit types or inference to maintain type safety in tests.
- When tests rely on environment variables, set them in the test via `vi.stubEnv` or local mocks rather than changing `.env` files.

Add contract testing and application-specific test scripts as the project matures.

## Continuous Integration

- **Workflow**: `.github/workflows/main.yml` runs on pull requests targeting `main` or `develop`, executing quality gates on Ubuntu runners.
- **Task runner**: Each CI step shells into the local orchestrator (`node ci --function <name>`). Available functions in `ci/functions.js` cover dependency install (`installDeps` → `pnpm install`), linting (`lint` → `pnpm run lint`), duplicate-code checks (`checksDuplications` → `pnpm run duplicated`), script unit tests (`scriptsUnitTest` → `pnpm run test-scripts`), and coverage runs (`scriptsCodeCoverage` → `pnpm run test:coverage`). Optional helpers exist for Hardhat tests (`smartContractsUnitTest` → `pnpm run test-contracts`) and Git tagging (`tagRelease`).
- **Manual usage**: Reproduce CI locally by calling `node ci --function lint` or any other function name. Pass JSON parameters with `--params '{"key":"value"}'` if the handler supports configurables.
- **Coverage upload**: After tests, the workflow publishes `coverage/` artifacts via `codecov/codecov-action@v4`; set `CODECOV_TOKEN` in repository secrets for PR status checks.
- **Extending CI**: Implement new automation in `ci/functions.js`, export it through the function map, and call it from the workflow for consistent local/remote parity.

## Documentation

- Functional overview: [Wiki · Functional analysis](https://github.com/nova-collective/andromeda/wiki/Functional-analysis)
- Technical deep dive: [Wiki · Technical analysis](https://github.com/nova-collective/andromeda/wiki/Technical-analysis)
- API docs live alongside routes (e.g., `src/app/api/auth/login/README.md`).
- Validator and utility usage docs located within `src/app/lib/**/README.md`.

## Deployment & Environments

- **Hosting**: Vercel (serverless functions + static assets).
- **Branches**:
  - `main` → Production (protected).
  - `develop` → Preview environment (protected).
  - `feature/*` → Ephemeral preview deployments when enabled.

CI/CD pipelines leverage Vercel Deploy Hooks; additional automation (tests, audits) will roll out as the codebase stabilizes.

## Contributing

1. Fork or clone the repository.
2. Branch from `develop` using `feature/<short-description>` (git-flow friendly).
3. Keep PRs scoped and documented (include testing notes, screenshots for UI changes).
4. Run `pnpm lint` before pushing to ensure style consistency.
5. Submit a pull request to `develop` for review.

Security issues should be reported privately to `nova.web3.collective@gmail.com`.

## License

Distributed under the terms of the **GNU General Public License v3.0**. See [LICENSE](LICENSE) for details.
