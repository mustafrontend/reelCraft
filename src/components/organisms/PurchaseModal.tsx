import { X, Check, CreditCard, Wallet, Star, Copy, ExternalLink, Building2 } from 'lucide-react'
import { Button } from '@/components/atoms/Button'
import { useUiStore } from '@/store/uiStore'
import { useState } from 'react'

export default function PurchaseModal() {
  const { isPurchaseModalOpen, closePurchaseModal } = useUiStore()
  const [copied, setCopied] = useState(false)

  if (!isPurchaseModalOpen) return null

  const handleCopyIban = () => {
    navigator.clipboard.writeText('TR14 0006 4000 0011 2260 4924 13')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={closePurchaseModal}></div>
      <div className="relative w-full max-w-5xl bg-white rounded-[2rem] shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div>
            <h2 className="text-2xl font-black text-slate-900">Bakiye Yükle & Paket Seç</h2>
            <p className="text-sm text-slate-500 font-medium mt-1">Stüdyo özelliklerini sınırsız kullanmak için paket seçin.</p>
          </div>
          <button onClick={closePurchaseModal} className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-900 transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            
            {/* Başlangıç Paket */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col relative overflow-hidden group hover:border-slate-300 transition-all">
              <div className="mb-4">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
                  <Wallet size={24} />
                </div>
                <h3 className="text-lg font-bold text-slate-900">🚀 Başlangıç</h3>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-3xl font-black text-slate-900">₺250</span>
                </div>
                <div className="text-sm font-semibold text-slate-500 mt-1">50 EPAY Kredisi</div>
              </div>
              
              <ul className="space-y-3 flex-1">
                <li className="flex gap-3 text-sm text-slate-600">
                  <Check size={18} className="text-green-500 shrink-0" /> Yaklaşık 10 Video Üretimi
                </li>
                <li className="flex gap-3 text-sm text-slate-600">
                  <Check size={18} className="text-green-500 shrink-0" /> Standart Seslendirmeler
                </li>
                <li className="flex gap-3 text-sm text-slate-600">
                  <Check size={18} className="text-green-500 shrink-0" /> 720p Çözünürlük
                </li>
              </ul>
            </div>

            {/* Pro Paket */}
            <div className="bg-slate-900 rounded-3xl p-6 border-2 border-purple-500 shadow-xl flex flex-col relative overflow-hidden transform md:-translate-y-2">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500"></div>
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-purple-500/20 blur-2xl rounded-full"></div>
              
              <div className="mb-4 relative z-10">
                <div className="inline-flex px-3 py-1 bg-purple-500/20 text-purple-300 text-xs font-bold rounded-full mb-4">
                  EN ÇOK SATAN
                </div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">👑 Pro Üretici <Star size={16} className="text-yellow-400 fill-yellow-400" /></h3>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-3xl font-black text-white">₺750</span>
                </div>
                <div className="text-sm font-semibold text-slate-400 mt-1">200 EPAY Kredisi</div>
              </div>
              
              <ul className="space-y-3 flex-1 relative z-10">
                <li className="flex gap-3 text-sm text-slate-300">
                  <Check size={18} className="text-purple-400 shrink-0" /> Yaklaşık 45 Video Üretimi
                </li>
                <li className="flex gap-3 text-sm text-slate-300">
                  <Check size={18} className="text-purple-400 shrink-0" /> Premium Yapay Zeka Sesleri
                </li>
                <li className="flex gap-3 text-sm text-slate-300">
                  <Check size={18} className="text-purple-400 shrink-0" /> 1080p & 4K Upscale
                </li>
                <li className="flex gap-3 text-sm text-slate-300">
                  <Check size={18} className="text-purple-400 shrink-0" /> Filigransız İndirme
                </li>
              </ul>
            </div>

            {/* Kurumsal Paket */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col relative overflow-hidden group hover:border-slate-300 transition-all">
              <div className="mb-4">
                <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mb-4">
                  <CreditCard size={24} />
                </div>
                <h3 className="text-lg font-bold text-slate-900">🏢 Kurumsal</h3>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-3xl font-black text-slate-900">₺1.500</span>
                </div>
                <div className="text-sm font-semibold text-slate-500 mt-1">500 EPAY Kredisi</div>
              </div>
              
              <ul className="space-y-3 flex-1">
                <li className="flex gap-3 text-sm text-slate-600">
                  <Check size={18} className="text-green-500 shrink-0" /> Sınırsız Hız & Öncelikli Render
                </li>
                <li className="flex gap-3 text-sm text-slate-600">
                  <Check size={18} className="text-green-500 shrink-0" /> Özel Şablon Desteği
                </li>
                <li className="flex gap-3 text-sm text-slate-600">
                  <Check size={18} className="text-green-500 shrink-0" /> API Erişimi (Sınırlı)
                </li>
                <li className="flex gap-3 text-sm text-slate-600">
                  <Check size={18} className="text-green-500 shrink-0" /> Dedike Müşteri Temsilcisi
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <CreditCard className="text-slate-500" /> Güvenli Ödeme Yöntemleri
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Shopier Yöntemi */}
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-3">
                    <CreditCard size={20} />
                  </div>
                  <h4 className="text-base font-bold text-slate-900">💳 Shopier Kredi/Banka Kartı</h4>
                  <p className="text-sm text-slate-500 mt-2 mb-4">
                    Tüm kartlarla 3D Secure güvencesiyle anında bakiye yükleyebilirsiniz.
                  </p>
                </div>
                
                <a href="https://www.shopier.com/efendiluxshop" target="_blank" rel="noreferrer">
                  <Button className="w-full gap-2 bg-indigo-600 hover:bg-indigo-700">
                    <ExternalLink size={16} /> 🛍️ Shopier Mağazası ile Öde
                  </Button>
                </a>
              </div>

              {/* Havale / EFT Yöntemi */}
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 flex flex-col">
                <div className="w-10 h-10 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-3">
                  <Building2 size={20} />
                </div>
                <h4 className="text-base font-bold text-slate-900 mb-4">🏦 İş Bankası Havale / EFT / FAST</h4>
                
                <div className="space-y-3 bg-white p-4 rounded-xl border border-slate-200 flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2">
                    <span className="text-sm text-slate-500 font-medium">Banka</span>
                    <span className="text-sm font-bold text-slate-900">İş Bankası</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2">
                    <span className="text-sm text-slate-500 font-medium">Alıcı Adı</span>
                    <span className="text-sm font-bold text-slate-900">Müslüm Mustafa Öztürk</span>
                  </div>
                  <div className="flex flex-col gap-1 border-b border-slate-100 pb-2">
                    <span className="text-sm text-slate-500 font-medium">IBAN</span>
                    <div className="flex items-center justify-between bg-slate-50 p-2 rounded-lg border border-slate-200">
                      <code className="text-xs font-bold text-slate-900 tracking-wider">TR14 0006 4000 0011 2260 4924 13</code>
                      <button 
                        onClick={handleCopyIban}
                        className="text-slate-400 hover:text-slate-900 p-1"
                        title="IBAN Kopyala"
                      >
                        {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span className="text-sm text-slate-500 font-medium">Açıklama</span>
                    <span className="text-sm font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-md">Kayıtlı E-Posta adresiniz</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
