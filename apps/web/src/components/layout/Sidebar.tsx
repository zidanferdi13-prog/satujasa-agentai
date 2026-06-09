import { Link, useLocation } from 'react-router-dom'
import type { ApplicationRole } from '@stnk/contracts'
import { authStore } from '../../stores/auth'
import { Button, Badge } from '../ui'

const navConfig: Record<ApplicationRole, Array<{ label: string; href: string }>> = {
  'super-admin': [
    { label: 'Dashboard', href: '/super-admin/dashboard' },
    { label: 'Kelola Owner', href: '/super-admin/owners' },
  ],
  owner: [
    { label: 'Dashboard', href: '/owner/dashboard' },
    { label: 'Tenant', href: '/owner/tenants' },
    { label: 'Admin User', href: '/owner/admin-users' },
    { label: 'Transaksi', href: '/owner/transactions' },
    { label: 'Setting Jasa', href: '/owner/services' },
  ],
  'admin-user': [
    { label: 'Dashboard', href: '/admin-user/dashboard' },
    { label: 'Transaksi', href: '/admin-user/transactions' },
    { label: 'Pelanggan', href: '/admin-user/customers' },
    { label: 'Setting Jasa', href: '/admin-user/services' },
  ],
}

const tierColors: Record<string, string> = {
  free: 'bg-slate-600 text-slate-200',
  pro: 'bg-blue-600 text-blue-100',
  plus: 'bg-purple-600 text-purple-100',
  expert: 'bg-amber-600 text-amber-100',
}

export function Sidebar() {
  const { role, user, subscription, logout } = authStore()
  const location = useLocation()

  if (!role) return null

  const navItems: { label: string; href: string }[] =
    (navConfig as Record<string, { label: string; href: string }[]>)[role] ?? []

  const tier = subscription?.tier ?? 'free'

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col h-screen border-r border-slate-800">
      {/* Brand */}
      <div className="p-6 border-b border-slate-800">
        <Link to="/" className="text-xl font-bold">
          STNK Jasa
        </Link>
        <p className="text-xs text-slate-400 mt-2 capitalize">{role.replace(/-/g, ' ')}</p>
        {user?.name && (
          <p className="text-xs text-slate-300 mt-1 truncate">{user.name}</p>
        )}
        {role === 'owner' && (
          <Badge className={`mt-2 text-xs ${tierColors[tier]}`}>
            {tier.toUpperCase()}
          </Badge>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href ||
            (item.href !== '/' && location.pathname.startsWith(item.href))

          return (
            <Link
              key={item.href}
              to={item.href}
              className={`block px-4 py-2.5 rounded-md text-sm transition-colors ${
                isActive
                  ? 'bg-slate-700 text-white font-medium'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-800">
        <Button
          variant="ghost"
          onClick={logout}
          className="w-full text-left text-slate-300 hover:text-white"
        >
          Logout
        </Button>
      </div>
    </aside>
  )
}
