# Coding Rules & Conventions

## General Rules
- ✅ **Do** use TypeScript's strict mode.
- ✅ **Do** use absolute imports via `@/`.
- ❌ **Don't** use `any`. Use `unknown` if a type is truly unknown.
- ✅ **Do** use `kebab-case` for file/folder names (except React components).
- ✅ **Do** use `PascalCase` for React components.

## Component Structure
```tsx
import { type FC } from 'react';
import { Button } from '@/shared/components/ui/Button';

interface Props {
  title: string;
}

export const MyComponent: FC<Props> = ({ title }) => {
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">{title}</h1>
      <Button>Click Me</Button>
    </div>
  );
};
```

## Naming Conventions
- Hooks: `use[Name]` (e.g., `useAuth`)
- Services: `[Name]Service` (e.g., `authService`)
- Types: `[Name].types.ts`
- Tests: `[Name].test.tsx`
