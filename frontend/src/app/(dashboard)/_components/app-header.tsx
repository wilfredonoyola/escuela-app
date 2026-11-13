import { UserMenu } from '@/features/auth';

export function AppHeader() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <span className="font-semibold">Directorio Escolar</span>
        <UserMenu />
      </div>
    </header>
  );
}
