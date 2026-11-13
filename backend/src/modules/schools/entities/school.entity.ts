export interface Director {
  nombre: string;
  dui: string;
  telefonoPersonal: string;
}

/** Registro completo tal como vive en la fuente de datos (incluye datos sensibles). */
export interface School {
  id: number;
  codigo: string;
  nombre: string;
  departamento: string;
  municipio: string;
  matricula: number;
  director: Director;
  observacionesInternas: string;
  createdBy: string;
}
