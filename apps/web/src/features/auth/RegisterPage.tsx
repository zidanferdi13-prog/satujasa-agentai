import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Button, Input, Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui'
import { api } from '../../lib/api'
import { authStore } from '../../stores/auth'

export function RegisterPage() {
  const navigate = useNavigate()
  const { setAuth } = authStore()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)
    setIsLoading(true)

    try {
      const response = await api.post('/api/v1/auth/register', formData)
      const { data } = response

      if (data.accessToken && data.user) {
        const user = {
          id: data.user.id,
          email: data.user.email,
          name: formData.name,
          role: data.user.role || 'owner',
        }
        const subscription = {
          tier: 'free' as const,
          max_tenants: 0,
          max_admin_users: 0,
        }
        setAuth(data.accessToken, user, subscription)
        setShowSuccess(true)

        // Redirect after brief delay to show success message
        setTimeout(() => navigate('/owner/dashboard'), 2000)
      }
    } catch (err) {
      const message =
        (err as { response?: { data?: { error?: string } } })?.response?.data?.error ||
        'Registrasi gagal. Coba lagi.'
      setFormError(message)
    } finally {
      setIsLoading(false)
    }
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="text-4xl mb-3">✅</div>
            <CardTitle>Akun Berhasil Dibuat!</CardTitle>
            <CardDescription>
              Selamat datang di STNK Jasa. Akun Anda langsung aktif dengan paket <strong>Free</strong>.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
              <p className="text-sm font-medium text-amber-800 mb-2">📋 Paket Free</p>
              <ul className="text-xs text-amber-700 space-y-1">
                <li>• Anda bisa login dan melihat semua menu</li>
                <li>• Belum bisa membuat tenant</li>
                <li>• Belum bisa assign admin user</li>
                <li>• Belum bisa input transaksi</li>
              </ul>
              <p className="text-xs text-amber-600 mt-3">
                Hubungi admin untuk upgrade ke Pro, Plus, atau Expert.
              </p>
            </div>
            <p className="text-sm text-slate-500 text-center">
              Mengarahkan ke dashboard...
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Daftar sebagai Owner</CardTitle>
          <CardDescription>
            Buat akun biro jasa Anda. Akun langsung aktif dengan paket Free.
          </CardDescription>
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
                placeholder="08..."
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
                placeholder="Minimal 8 karakter"
                disabled={isLoading}
                required
                minLength={8}
              />
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? 'Mendaftar...' : 'Daftar Sekarang'}
            </Button>
          </form>

          <p className="text-sm text-slate-600 mt-4 text-center">
            Sudah punya akun?{' '}
            <Link to="/login" className="text-primary hover:underline font-medium">
              Login di sini
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
