export type Role = 'ADMIN' | 'CONSULTA';

export interface User {
  id: number;
  nombre: string;
  email: string;
  rol: Role;
}

export interface LoginResponse {
  accessToken: string;
  tokenType: 'Bearer';
  expiresIn: number;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}
