import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { useI18nStore } from '@/store/i18nStore'
import { Button } from '@/components/atoms/Button'
import { Input } from '@/components/atoms/Input'
import { Video, ArrowLeft } from 'lucide-react'
import { API_BASE } from '@/config'

export default function Login() {
  const { t } = useI18nStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const setAuth = useAuthStore(state => state.setAuth)
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Giriş yapılamadı')
      setAuth(data.token, data.user)
      navigate('/studio')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col overflow-y-auto py-12 pb-24 px-4 sm:px-6 lg:px-8">
      
      <div className="w-full max-w-md mx-auto mb-8">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">
          <ArrowLeft size={16} /> {t('landing.btn.studio')} {/* Reuse or add back button key */}
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Link to="/">
            <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl hover:scale-105 transition-transform cursor-pointer">
              <Video size={28} />
            </div>
          </Link>
        </div>
        <h2 className="mt-6 text-center text-3xl font-black text-slate-900 tracking-tight">
          {t('login.header')}
        </h2>
        <p className="mt-2 text-center text-sm font-medium text-slate-500">
          {t('login.desc')}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl shadow-slate-200/50 border border-slate-200 rounded-[2rem] sm:px-10">
          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100 font-bold">
                {error}
              </div>
            )}
            <Input
              label={t('login.email')}
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ornek@mail.com"
            />
            <Input
              label={t('login.password')}
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
            <Button type="submit" className="w-full h-12 text-base shadow-lg shadow-slate-900/10 mt-4" isLoading={loading}>
              {t('login.btn')}
            </Button>
            <div className="mt-6 text-center">
              <span className="text-sm font-medium text-slate-500">{t('login.noaccount')}</span>
              <Link to="/register" className="text-sm font-black text-indigo-600 hover:text-indigo-700 hover:underline">
                {t('login.registerlink')}
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
