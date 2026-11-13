const TOKEN_KEY = 'escuela.accessToken';

/**
 * Persistencia del token en localStorage (HU-01.3). Aislado aquí para poder
 * migrar a cookie httpOnly sin tocar el resto de la app.
 */
export const tokenStorage = {
  get(): string | null {
    if (typeof window === 'undefined') return null;
    try {
      return window.localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },
  set(token: string): void {
    try {
      window.localStorage.setItem(TOKEN_KEY, token);
    } catch {
      /* almacenamiento no disponible: la sesión dura solo en memoria */
    }
  },
  clear(): void {
    try {
      window.localStorage.removeItem(TOKEN_KEY);
    } catch {
      /* noop */
    }
  },
};
