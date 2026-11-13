import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
/** Marca un endpoint como accesible sin token (por defecto todo está protegido). */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
