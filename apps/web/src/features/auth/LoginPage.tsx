import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Button, Input, Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui'
import { api } from '../../lib/api'
import { authStore } from '../../stores/auth'

export function LoginPage() {
  const navigate = useNavigate()
  const { setAuth, setLoading, setError, isLoading, error } = authStore()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [formError, setFormError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)
    setLoading(true)

    try {
      const response = await api.post('/auth/login', { email, password })
      const { data } = response

      if (data.token && data.user) {
        const role = data.user.role || 'owner'
        setAuth(data.token, role, data.user.id)
        navigate(`/${role}/dashboard`)
      }
    } catch (err) {
      const message = (err as any)?.response?.data?.error?.message || 'Login failed'
      setFormError(message)
      setError(message)
    } finally {
      setLoading(false)
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={isLoading}
                required
              />
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? 'Loading...' : 'Login'}
            </Button>
          </form>

          <p className="text-sm text-slate-600 mt-4 text-center">
            Belum punya akun?{' '}
            <Link to="/register" className="text-primary hover:underline">
              Daftar sekarang
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
