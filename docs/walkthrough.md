# Enterprise React Boilerplate Walkthrough

This boilerplate is designed for high scalability, featuring a modular architecture and strict enforcement rules.

## Key Features

### 1. Feature-Based Architecture
The project is split into self-contained modules in `src/features/`.
- **Auth Feature**: Handles login, session management, and protected routing.
- **Dashboard Feature**: Handles data visualization and business logic.
- **Shared Layer**: Contains generic UI components (shadcn) and utility functions.

### 2. Strict Rule Enforcement
Check the `/docs` directory for enforceable guidelines:
- [architecture.md](./architecture.md)
- [coding-rules.md](./coding-rules.md)
- [state-management.md](./state-management.md)

### 3. State Management Strategy
- **Zustand**: Used for local/global UI state (e.g., `src/features/auth/store/auth-store.ts`).
- **React Query**: Used for all async server state (e.g., `src/features/dashboard/hooks/use-dashboard-stats.ts`).

### 4. Components & Styling
- **Premium UI**: Crafted with Tailwind CSS and shadcn/ui.
- **Dumb Components**: Located in `src/shared/components/ui`.
- **Smart Components**: Located in feature `pages/`.

### 5. Absolute Imports
Configured via `tsconfig.json` and `vite.config.ts` for clean imports:
`import { Button } from '@/shared/components/ui/Button';`

### 6. Testing Suite
- **Jest + Testing Library** configured for unit and integration tests.
- Example: `src/features/auth/store/auth-store.test.ts`.

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start development server:
   ```bash
   npm run dev
   ```
3. Run tests:
   ```bash
   npm run test
   ```
