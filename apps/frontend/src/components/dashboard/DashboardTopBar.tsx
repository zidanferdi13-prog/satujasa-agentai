'use client';

import type { User, UserRole } from '@/types/auth';
import { roleLabels } from './menuConfig';

type DashboardTopBarProps = {
  title: string;
  user?: User | null;
  role: UserRole;
  onMenuClick: () => void;
};

const roleBadgeClasses: Record<UserRole, string> = {
  ADMIN: 'bg-primary text-on-primary',
  OWNER: 'bg-secondary text-on-secondary',
  USER_ADMIN: 'bg-tertiary-container text-on-tertiary-container',
};

function getInitials(user?: User | null) {
  const source = user?.name || user?.email || 'SatuJasa';
  const words = source.trim().split(/\s+/).slice(0, 2);
  return words.map((word) => word[0]?.toUpperCase()).join('') || 'SA';
}

export default function DashboardTopBar({ title, user, role, onMenuClick }: DashboardTopBarProps) {
  const displayName = user?.name || 'Super Admin';
  const email = user?.email || 'superadmin@satujasa.id';

  return (
    <header className="sticky top-0 z-40 flex h-20 items-center justify-between border-b border-outline-variant bg-surface px-4 md:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-on-surface-variant transition-all duration-100 hover:bg-surface-container-low active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary lg:hidden"
          aria-label="Buka menu navigasi"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>

        <div className="min-w-0">
          <nav className="mb-0.5 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-outline" aria-label="Breadcrumb">
            <span>Workspace</span>
            <span className="material-symbols-outlined text-[12px]">chevron_right</span>
            <span className="text-primary">{roleLabels[role]}</span>
          </nav>
          <h1 className="truncate text-headline-md font-extrabold text-on-surface md:text-[24px]">{title}</h1>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-3 md:gap-6">
        <button
          type="button"
          className="relative flex h-10 w-10 items-center justify-center rounded-full text-on-surface-variant transition-all duration-100 hover:bg-surface-container-low active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          aria-label="Notifikasi"
        >
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-surface bg-error" />
        </button>

        <div className="flex items-center gap-3 rounded-xl border border-outline-variant/30 bg-surface-container-lowest px-2 py-2 md:gap-4 md:px-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-container text-sm font-bold text-white">
            {getInitials(user)}
          </div>
          <div className="hidden flex-col text-right sm:flex">
            <div className="flex items-center justify-end gap-2">
              <span className="max-w-40 truncate text-sm font-bold text-on-surface">{displayName}</span>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-tighter ${roleBadgeClasses[role]}`}>
                {roleLabels[role]}
              </span>
            </div>
            <span className="max-w-52 truncate text-xs font-medium text-outline">{email}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
