import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Button, Input, Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui'
import { api } from '../../lib/api'
import { authStore } from '../../stores/auth'

export function RegisterPage() {
  const navigate = useNavigate()
  const { setAuth, setLoading } = authStore()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)
    setIsLoading(true)

    try {
      const response = await api.post('/auth/register', formData)
      const { data } = response

      if (data.token && data.user) {
        const role = data.user.role || 'owner'
        setAuth(data.token, role, data.user.id)
        setLoading(false)
        navigate('/owner/dashboard')
      }
    } catch (err) {
      const message = (err as any)?.response?.data?.error?.message || 'Registration failed'
      setFormError(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Daftar</CardTitle>
          <CardDescription>Buat akun STNK Jasa Anda sebagai owner</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            {formError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-md text-sm">
                {formError}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Nama Lengkap
              </label>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Nama Anda"
                disabled={isLoading}
                required
              />
            </div>

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
                Nomor Telepon
              </label>
              <Input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+62..."
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
              {isLoading ? 'Loading...' : 'Daftar'}
            </Button>
          </form>

          <p className="text-sm text-slate-600 mt-4 text-center">
            Sudah punya akun?{' '}
            <Link to="/login" className="text-primary hover:underline">
              Login di sini
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
