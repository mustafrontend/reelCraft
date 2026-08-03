import { useEffect } from 'react'
import { Globe, X } from 'lucide-react'
import { useUiStore } from '@/store/uiStore'
import { useI18nStore } from '@/store/i18nStore'

const LANGUAGES: { id: any, name: string, flag: string }[] = [
  { id: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { id: 'en', name: 'English', flag: '🇬🇧' },
  { id: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { id: 'es', name: 'Español', flag: '🇪🇸' },
  { id: 'fr', name: 'Français', flag: '🇫🇷' },
  { id: 'it', name: 'Italiano', flag: '🇮🇹' },
  { id: 'pt', name: 'Português', flag: '🇵🇹' },
  { id: 'ru', name: 'Русский', flag: '🇷🇺' },
  { id: 'ar', name: 'العربية', flag: '🇸🇦' },
  { id: 'ja', name: '日本語', flag: '🇯🇵' },
  { id: 'ko', name: '한국어', flag: '🇰🇷' },
  { id: 'zh', name: '中文', flag: '🇨🇳' }
]

export default function LanguageSelectionModal() {
  const { isLangModalOpen, closeLangModal, openLangModal } = useUiStore()
  const { lang, setLang } = useI18nStore()

  useEffect(() => {
    const hasSelected = localStorage.getItem('app_lang_selected')
    if (!hasSelected) {
      openLangModal()
    }
  }, [openLangModal])

  const handleSelect = (selectedLang: any) => {
    setLang(selectedLang)
    localStorage.setItem('app_lang_selected', 'true')
    closeLangModal()
  }

  if (!isLangModalOpen) return null

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={closeLangModal}></div>
      <div className="relative w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
              <Globe size={20} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900">Choose Language</h2>
              <p className="text-xs font-medium text-slate-500">Select your preferred language / Dil seçiminizi yapın</p>
            </div>
          </div>
          {localStorage.getItem('app_lang_selected') && (
            <button onClick={closeLangModal} className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-900 transition-colors">
              <X size={20} />
            </button>
          )}
        </div>

        <div className="p-6 bg-slate-50 overflow-y-auto max-h-[60vh]">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {LANGUAGES.map((l) => (
              <button
                key={l.id}
                onClick={() => handleSelect(l.id)}
                className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all hover:scale-105 hover:shadow-md ${
                  lang === l.id 
                    ? 'border-indigo-500 bg-indigo-50 shadow-indigo-100' 
                    : 'border-slate-200 bg-white hover:border-indigo-200 hover:bg-indigo-50/50'
                }`}
              >
                <span className="text-3xl mb-2">{l.flag}</span>
                <span className={`text-sm font-bold ${lang === l.id ? 'text-indigo-700' : 'text-slate-700'}`}>
                  {l.name}
                </span>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
