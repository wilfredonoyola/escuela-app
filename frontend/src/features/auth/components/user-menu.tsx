'use client';

import { useAuth } from '../context/auth-context';

export function UserMenu() {
  const { user, logout } = useAuth();
  if (!user) return null;

  return (
    <div className="flex items-center gap-3 text-sm">
      <div className="text-right">
        <p className="font-medium">{user.nombre}</p>
        <p className="text-xs text-gray-500">{user.email}</p>
      </div>
      <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-800">
        {user.rol}
      </span>
      <button
        type="button"
        onClick={logout}
        className="rounded-md border border-gray-300 px-3 py-1 hover:bg-gray-100"
      >
        Salir
      </button>
    </div>
  );
}
