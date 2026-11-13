import { Role } from '../enums/role.enum';

/** Datos del usuario extraídos del JWT y adjuntados a `request.user`. */
export interface AuthenticatedUser {
  id: number;
  email: string;
  rol: Role;
}
