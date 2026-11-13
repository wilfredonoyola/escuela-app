/** Variables públicas (se incrustan en el bundle del navegador en build). */
export const env = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000',
} as const;
