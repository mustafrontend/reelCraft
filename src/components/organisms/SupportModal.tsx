import { useState } from 'react'
import { X, MessageCircle, Send, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/atoms/Button'
import { Input } from '@/components/atoms/Input'
import { useUiStore } from '@/store/uiStore'
import { API_BASE } from '@/config'

export default function SupportModal() {
  const { isSupportModalOpen, closeSupportModal } = useUiStore()
  const [email, setEmail] = useState('')
  const [topic, setTopic] = useState('teknik_hata')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  if (!isSupportModalOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await fetch(`${API_BASE}/api/support/ticket`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, topic, message })
      })
      setIsSuccess(true)
      setTimeout(() => {
        setIsSuccess(false)
        closeSupportModal()
        setEmail('')
        setMessage('')
      }, 3000)
    } catch (err) {
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={closeSupportModal}></div>
      <div className="relative w-full max-w-lg bg-white rounded-[2rem] shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-black text-slate-900">💬 Canlı Destek & Hata Bildirimi</h2>
            <p className="text-sm text-slate-500 font-medium mt-1">Karşılaştığınız sorunları veya önerilerinizi bize iletin.</p>
          </div>
          <button onClick={closeSupportModal} className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-900 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 bg-slate-50">
          
          <a href="https://wa.me/905491209804" target="_blank" rel="noreferrer" className="block mb-6">
            <div className="bg-[#25D366]/10 border border-[#25D366]/20 rounded-2xl p-4 flex items-center justify-center gap-3 hover:bg-[#25D366]/20 transition-colors">
              <MessageCircle size={24} className="text-[#25D366]" />
              <span className="font-bold text-[#25D366]">📱 7/24 WhatsApp Canlı Destek</span>
            </div>
          </a>

          <div className="flex items-center gap-4 mb-6">
            <div className="h-px bg-slate-200 flex-1"></div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">VEYA TICKET AÇIN</span>
            <div className="h-px bg-slate-200 flex-1"></div>
          </div>

          {isSuccess ? (
             <div className="text-center py-8">
               <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                 <CheckCircle2 size={32} />
               </div>
               <h3 className="text-lg font-bold text-slate-900 mb-2">Talebiniz Alındı!</h3>
               <p className="text-sm text-slate-500">En kısa sürede size dönüş yapacağız.</p>
             </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="E-Posta Adresi"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ornek@mail.com"
              />
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Konu / Hata Türü</label>
                <select 
                  className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all shadow-sm"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  required
                >
                  <option value="teknik_hata">Teknik Hata</option>
                  <option value="odeme_bakiye">Ödeme/Bakiye</option>
                  <option value="oneri_istek">Öneri/İstek</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Mesaj Detayı</label>
                <textarea
                  rows={4}
                  required
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all resize-none shadow-sm"
                  placeholder="Yaşadığınız sorunu detaylıca anlatın..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>

              <Button type="submit" className="w-full gap-2 mt-2" isLoading={isSubmitting}>
                <Send size={16} /> Gönder
              </Button>
            </form>
          )}

        </div>
      </div>
    </div>
  )
}
