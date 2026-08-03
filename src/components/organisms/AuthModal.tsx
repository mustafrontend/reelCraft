import { useState } from 'react'
import { X, Video } from 'lucide-react'
import { Button } from '@/components/atoms/Button'
import { Input } from '@/components/atoms/Input'
import { useUiStore } from '@/store/uiStore'
import { useAuthStore } from '@/store/authStore'
import { API_BASE } from '@/config'

export default function AuthModal() {
  const { isAuthModalOpen, closeAuthModal } = useUiStore()
  const { setAuth } = useAuthStore()
  
  const [isLogin, setIsLogin] = useState(true)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (!isAuthModalOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register'
      const body = isLogin ? { email, password } : { username, email, password }
      
      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Bir hata oluştu')
      }
      
      setAuth(data.token, data.user)
      closeAuthModal()
      
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    closeAuthModal()
    setError('')
    setEmail('')
    setPassword('')
    setUsername('')
  }

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={handleClose}></div>
      <div className="relative w-full max-w-md bg-white rounded-[2rem] shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white">
              <Video size={16} />
            </div>
            <h2 className="text-xl font-black text-slate-900">{isLogin ? 'Giriş Yap' : 'Kayıt Ol'}</h2>
          </div>
          <button onClick={handleClose} className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-900 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 bg-slate-50">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm border border-red-100 font-medium">
                {error}
              </div>
            )}

            {!isLogin && (
              <Input
                label="Kullanıcı Adı"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="ornek_kullanici"
              />
            )}

            <Input
              label="E-Posta Adresi"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ornek@mail.com"
            />

            <Input
              label="Şifre"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />

            <Button type="submit" className="w-full gap-2 mt-2" isLoading={loading}>
              {isLogin ? 'Giriş Yap' : 'Hesap Oluştur'}
            </Button>
            
            <div className="mt-4 text-center">
              <button 
                type="button" 
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors"
              >
                {isLogin ? 'Hesabınız yok mu? Kayıt Olun' : 'Zaten hesabınız var mı? Giriş Yapın'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
