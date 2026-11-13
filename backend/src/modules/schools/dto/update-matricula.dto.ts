import { IsInt, Max, Min } from 'class-validator';

/** Validación también en backend: el frontend se puede saltar (corrige HU-05.2). */
export class UpdateMatriculaDto {
  @IsInt({ message: 'La matrícula debe ser un número entero' })
  @Min(0, { message: 'La matrícula no puede ser negativa' })
  @Max(100_000, { message: 'La matrícula excede el máximo permitido' })
  matricula!: number;
}
