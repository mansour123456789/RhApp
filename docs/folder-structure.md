# Folder Structure

```text
src/
  app/                # Global config & orchestration
    providers/        # Context providers (Auth, Query, Theme)
    router/           # Routing definitions
    store/            # Global Zustand stores (only if global)
  features/           # Business domain logic
    [feature-name]/
      components/     # Feature-specific UI components
      hooks/          # Feature-specific hooks (Queries, logic)
      services/       # API calls & data fetching
      store/          # Feature-specific Zustand stores
      types/          # Feature-specific types/interfaces
      pages/          # Top-level page components
  shared/             # Reusable foundation
    components/       # UI Library (shadcn, generic)
    hooks/            # Generic hooks (useWindowSize, etc)
    lib/              # 3rd party lib wrappers (axios, utils)
    services/         # Global services (logging, telemetry)
    types/            # Global types
    utils/            # Pure functions
```

## Rules
- ❌ **No logic** in `shared/components`. Only UI props.
- ✅ **Every feature** should be deletable without breaking others.
- ✅ **Absolute imports** are mandatory for everything outside the current directory.
