'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import icon from '../../../assets/icon.png';
import { removeToken } from '@/lib/auth';
import type { UserRole } from '@/types/auth';
import { roleLabels } from './menuConfig';
import type { RoleMenuItem } from './types';

type DashboardSidebarProps = {
  role: UserRole;
  items: RoleMenuItem[];
  currentPath: string;
  open: boolean;
  onClose: () => void;
};

function isActiveItem(item: RoleMenuItem, currentPath: string) {
  return currentPath === item.href;
}

function getRoleHome(role: UserRole) {
  return `/${role === 'USER_ADMIN' ? 'user-admin' : role.toLowerCase()}`;
}

function SidebarContent({ role, items, currentPath, onClose }: DashboardSidebarProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  function handleSignOut() {
    removeToken();
    queryClient.clear();
    onClose();
    router.replace('/auth/signin');
  }

  return (
    <aside className="flex h-full flex-col overflow-y-auto bg-[linear-gradient(180deg,var(--color-inverse-surface)_0%,#0b1c30_100%)] p-4 text-inverse-on-surface shadow-xl">
      <Link
        href={getRoleHome(role)}
        className="mb-10 mt-2 flex items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-fixed-dim"
        onClick={onClose}
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white shadow-lg shadow-primary/20 ring-1 ring-white/80">
          <Image src={icon} alt="" className="h-12 w-12 rounded-md" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-headline-sm font-bold text-on-primary">STNK SatuJasa</p>
          <p className="truncate text-label-sm font-bold uppercase tracking-wider text-outline-variant/70">Operational Command</p>
        </div>
      </Link>

      <nav className="flex flex-1 flex-col gap-2" aria-label={`Menu ${roleLabels[role]}`}>
        <div className="px-2 pb-2">
          <span className="px-3 text-label-sm font-bold uppercase tracking-[0.16em] text-outline-variant/60">Navigasi</span>
        </div>

        {items.map((item) => {
          const active = isActiveItem(item, currentPath);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              aria-current={active ? 'page' : undefined}
              className={`group flex items-center gap-4 rounded-lg px-4 py-3.5 text-label-md transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-fixed-dim ${
                active
                  ? 'bg-surface text-primary opacity-95 shadow-sm'
                  : 'text-outline-variant hover:text-surface-variant'
              }`}
            >
              {item.icon ? (
                <span className={`material-symbols-outlined text-[23px] transition-transform ${active ? "[font-variation-settings:'FILL'_1]" : 'group-hover:scale-110'}`}>
                  {item.icon}
                </span>
              ) : null}
              <span className="font-semibold">{item.label}</span>
              {item.badge ? <span className="ml-auto rounded-full bg-primary-fixed px-2 py-0.5 text-[11px] font-bold text-primary">{item.badge}</span> : null}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-3">
        <div className="rounded-xl border border-surface-container/10 bg-surface-container/5 p-4">
          <div className="mb-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary [font-variation-settings:'FILL'_1]">shield</span>
            <span className="text-label-sm font-bold uppercase tracking-[0.14em] text-on-primary">Secure Panel</span>
          </div>
          <p className="text-[11px] leading-relaxed text-outline-variant/80">
            Akses menu mengikuti role aktif dan tetap berada dalam area kerja dashboard.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSignOut}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-error/30 bg-error/10 px-4 py-3 text-label-md font-bold text-error-container transition-colors hover:bg-error hover:text-on-error focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-error-container"
        >
          <span className="material-symbols-outlined text-[20px]">logout</span>
          Sign Out
        </button>
      </div>
    </aside>
  );
}

export default function DashboardSidebar(props: DashboardSidebarProps) {
  return (
    <>
      <div className="hidden h-screen w-[280px] shrink-0 lg:fixed lg:left-0 lg:top-0 lg:z-50 lg:block">
        <SidebarContent {...props} />
      </div>

      <div
        className={`fixed inset-0 z-40 bg-inverse-surface/45 backdrop-blur-sm transition-opacity lg:hidden ${props.open ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
        onClick={props.onClose}
        aria-hidden="true"
      />
      <div
        className={`fixed inset-y-0 left-0 z-50 w-[min(280px,88vw)] transition-transform duration-300 lg:hidden ${props.open ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <SidebarContent {...props} />
      </div>
    </>
  );
}
