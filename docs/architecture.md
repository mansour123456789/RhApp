# Frontend Architecture

This project follows a **Feature-Based Architecture** designed for scalability and maintainability.

## Layers

- **App (`src/app`)**: Application-wide configurations, providers, and global routing.
- **Features (`src/features`)**: Self-contained modules representing specific business domains (e.g., auth, dashboard).
- **Shared (`src/shared`)**: Reusable components, hooks, and libraries (e.g., axios config) with NO business logic.

## Rules

### Feature Isolation
- ❌ **Don't** import from one feature to another directly.
  - *Bad*: `import { UserProfile } from '@/features/user/components/UserProfile'` inside `auth` feature.
- ✅ **Do** move shared logic to the `shared/` directory.
- ✅ **Do** communicate between features only via high-level orchestrators in `app/` or via a generic `shared/` bridge if absolutely necessary.

### Dependency Flow
- `app` → `features`
- `features` → `shared`
- `app` → `shared`
- `shared` cannot depend on `features` or `app`.

### Smart vs. Dumb Components
- ✅ **Dumb Components**: UI only. Receive data via props, emit actions via callbacks. Located in `components/` of a feature or `shared/components`.
- ✅ **Smart Components**: Logic/Data handling. Use hooks, services, and stores. Usually the `pages/` or top-level components in a feature.
