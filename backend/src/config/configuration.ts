import { join } from 'node:path';

export interface AppConfig {
  port: number;
  corsOrigins: string[];
  jwt: { secret: string; expiresInSeconds: number };
  cacheTtlMs: number;
  dataDir: string;
}

const toInt = (value: string | undefined, fallback: number): number => {
  const parsed = Number.parseInt(value ?? '', 10);
  return Number.isNaN(parsed) ? fallback : parsed;
};

export default (): AppConfig => {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      'JWT_SECRET no está definido o tiene menos de 32 caracteres. Copia backend/.env.example a backend/.env.',
    );
  }

  return {
    port: toInt(process.env.PORT, 4000),
    corsOrigins: (process.env.CORS_ORIGIN ?? 'http://localhost:3000')
      .split(',')
      .map((origin) => origin.trim()),
    jwt: {
      secret,
      expiresInSeconds: toInt(process.env.JWT_EXPIRES_IN_SECONDS, 3600),
    },
    cacheTtlMs: toInt(process.env.CACHE_TTL_MS, 60_000),
    dataDir: process.env.DATA_DIR ?? join(process.cwd(), 'data'),
  };
};
