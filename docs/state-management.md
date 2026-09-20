# State Management Rules

We distinguish between **UI/Global State** and **Server/Async State**.

## Zustand (UI State)
Used for local UI state that needs to be shared across a feature or the whole app (e.g., sidebar open/close, current theme, temporary user preferences).

- ✅ **Do** keep stores small and feature-specific.
- ✅ **Do** define actions alongside state.
- ❌ **Don't** store large amounts of data that should be in a database.

## React Query (Server State)
Used for all asynchronous data fetching, caching, and synchronization.

- ✅ **Do** create custom hooks for each query/mutation in `hooks/`.
- ✅ **Do** use centralized query keys.
- ❌ **Don't** manually sync server data to Zustand unless absolutely necessary (e.g., complex optimistic updates).

## Example Pattern

```typescript
// features/dashboard/hooks/use-dashboard-data.ts
import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../services/dashboard-service';

export const useDashboardData = () => {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: dashboardService.getStats,
  });
};
```
