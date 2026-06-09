import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Button, Input, Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui'
import { api } from '../../lib/api'
import { authStore } from '../../stores/auth'

export function LoginPage() {
  const navigate = useNavigate()
  const { setAuth } = authStore()

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const getRedirectPath = (role: string) => {
    switch (role) {
      case 'super-admin':
        return '/super-admin/dashboard'
      case 'owner':
        return '/owner/dashboard'
      case 'admin-user':
        return '/admin-user/dashboard'
      default:
        return '/'
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)
    setIsLoading(true)

    try {
      const response = await api.post('/api/v1/auth/login', formData)
      const { data } = response

      if (data.accessToken && data.user) {
        const user = {
          id: data.user.id,
          email: data.user.email,
          name: data.user.name || data.user.email,
          role: data.user.role,
        }

        // Fetch subscription for owners
        let subscription = undefined
        if (data.user.role === 'owner' && data.subscription) {
          subscription = {
            tier: data.subscription.tier,
            max_tenants: data.subscription.max_tenants,
            max_admin_users: data.subscription.max_admin_users,
          }
        }

        setAuth(data.accessToken, user, subscription)
        navigate(getRedirectPath(data.user.role))
      }
    } catch (err) {
      const message =
        (err as { response?: { data?: { error?: string } } })?.response?.data?.error ||
        'Login gagal. Periksa email dan password Anda.'
      setFormError(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Masuk ke akun STNK Jasa Anda</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {formError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-md text-sm">
                {formError}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Email
              </label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="email@example.com"
                disabled={isLoading}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Password
              </label>
              <Input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                disabled={isLoading}
                required
              />
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? 'Loading...' : 'Masuk'}
            </Button>
          </form>

          <p className="text-sm text-slate-600 mt-4 text-center">
            Belum punya akun?{' '}
            <Link to="/register" className="text-primary hover:underline font-medium">
              Daftar di sini
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
