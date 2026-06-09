import { Link } from 'react-router-dom'
import type { ApplicationRole } from '@stnk/contracts'
import { authStore } from '../../stores/auth'
import { Button } from '../ui'

const navConfig: Record<ApplicationRole, Array<{ label: string; href: string }>> = {
  'super-admin': [
    { label: 'Dashboard', href: '/super-admin/dashboard' },
    { label: 'Kelola Owner', href: '/super-admin/owners' },
    { label: 'Subscription', href: '/super-admin/subscriptions' },
    { label: 'Semua Tenant', href: '/super-admin/tenants' },
    { label: 'Semua Transaksi', href: '/super-admin/transactions' },
  ],
  owner: [
    { label: 'Dashboard', href: '/owner/dashboard' },
    { label: 'Tenant', href: '/owner/tenants' },
    { label: 'Admin User', href: '/owner/admin-users' },
    { label: 'Transaksi', href: '/owner/transactions' },
    { label: 'Layanan', href: '/owner/services' },
  ],
  'admin-user': [
    { label: 'Dashboard', href: '/admin-user/dashboard' },
    { label: 'Transaksi', href: '/admin-user/transactions' },
    { label: 'Pelanggan', href: '/admin-user/customers' },
    { label: 'Layanan', href: '/admin-user/services' },
  ],
}

export function Sidebar() {
  const { role, logout } = authStore()

  if (!role) return null

  const navItems = navConfig[role]

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col h-screen border-r">
      <div className="p-6 border-b border-slate-800">
        <Link to="/" className="text-xl font-bold">
          STNK Jasa
        </Link>
        <p className="text-xs text-slate-400 mt-2">{role.replace('-', ' ').toUpperCase()}</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className="block px-4 py-2 rounded-md text-sm hover:bg-slate-800 transition-colors"
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <Button variant="ghost" onClick={logout} className="w-full text-left">
          Logout
        </Button>
      </div>
    </aside>
  )
}
