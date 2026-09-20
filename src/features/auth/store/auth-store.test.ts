import { useAuthStore } from './auth-store';

describe('auth-store', () => {
  beforeEach(() => {
    useAuthStore.getState().logout();
  });

  it('should initialize with null user and not authenticated', () => {
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  it('should set user and authenticated on login', () => {
    const user = { id: '1', email: 'test@test.com', name: 'Test User' };
    useAuthStore.getState().login(user);
    
    const state = useAuthStore.getState();
    expect(state.user).toEqual(user);
    expect(state.isAuthenticated).toBe(true);
  });

  it('should clear user and authenticated on logout', () => {
    const user = { id: '1', email: 'test@test.com', name: 'Test User' };
    useAuthStore.getState().login(user);
    useAuthStore.getState().logout();
    
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });
});
