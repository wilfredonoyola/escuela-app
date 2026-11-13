import { z } from 'zod';

export const MATRICULA_MAX = 100_000;

/** Misma regla que el backend (UpdateMatriculaDto): entero entre 0 y 100 000. */
export const matriculaSchema = z
  .string()
  .trim()
  .regex(/^\d+$/, 'Debe ser un número entero mayor o igual a 0')
  .transform(Number)
  .refine((n) => n <= MATRICULA_MAX, 'Excede el máximo permitido');
