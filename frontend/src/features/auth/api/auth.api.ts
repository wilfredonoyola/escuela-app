import { apiRequest } from '@/shared/lib/api-client';
import type { LoginCredentials, LoginResponse, User } from '../types';

export const authApi = {
  login: (credentials: LoginCredentials) =>
    apiRequest<LoginResponse>('/auth/login', { method: 'POST', body: credentials, auth: false }),
  me: () => apiRequest<User>('/auth/me'),
};
