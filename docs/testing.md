# Testing Strategy

We use **Jest** and **React Testing Library** for unit and integration tests.

## Rules
- ✅ **Do** test behavior, not implementation details.
- ✅ **Do** write tests for every new feature component.
- ✅ **Do** mock external services/APIs in `shared/services`.
- ❌ **Don't** test 3rd party libraries or generic UI components (shadcn) unless customized.

## Example Test
```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { LoginForm } from './LoginForm';

describe('LoginForm', () => {
  it('should call onSubmit with credentials when submitted', async () => {
    const onSubmit = jest.fn();
    render(<LoginForm onSubmit={onSubmit} />);
    
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    
    expect(onSubmit).toHaveBeenCalledWith({ email: 'test@example.com' });
  });
});
```
