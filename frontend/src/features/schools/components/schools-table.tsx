import type { School } from '../types';
import { MatriculaCell } from './matricula-cell';

interface Props {
  schools: School[];
  canEdit: boolean;
}

export function SchoolsTable({ schools, canEdit }: Props) {
  if (schools.length === 0) {
    return <p className="py-8 text-center text-sm text-gray-500">No hay centros que coincidan.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50 text-left text-xs font-semibold uppercase text-gray-600">
          <tr>
            <th scope="col" className="px-4 py-3">Código</th>
            <th scope="col" className="px-4 py-3">Nombre</th>
            <th scope="col" className="px-4 py-3">Departamento</th>
            <th scope="col" className="px-4 py-3">Municipio</th>
            <th scope="col" className="px-4 py-3 text-right">Matrícula</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {schools.map((school) => (
            <tr key={school.id}>
              <td className="px-4 py-3 font-mono">{school.codigo}</td>
              <td className="px-4 py-3">{school.nombre}</td>
              <td className="px-4 py-3">{school.departamento}</td>
              <td className="px-4 py-3">{school.municipio}</td>
              <td className="px-4 py-3">
                <MatriculaCell school={school} canEdit={canEdit} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
