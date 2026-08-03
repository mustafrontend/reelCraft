import { useEffect, useState } from 'react'
import { Outlet, Link } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { useI18nStore } from '@/store/i18nStore'
import { useUiStore } from '@/store/uiStore'
import { Video, Home, PlaySquare, Globe, CreditCard, Zap, MessageSquare, Trash2, LogOut, UserCircle } from 'lucide-react'
import PurchaseModal from '@/components/organisms/PurchaseModal'
import SupportModal from '@/components/organisms/SupportModal'
import CookieBanner from '@/components/organisms/CookieBanner'
import AuthModal from '@/components/organisms/AuthModal'
import LanguageSelectionModal from '@/components/organisms/LanguageSelectionModal'

export default function AppLayout() {
  const { token, logout, user, fetchUser } = useAuthStore()
  const { t, lang, setLang } = useI18nStore()
  const { openPurchaseModal, openSupportModal, openLangModal } = useUiStore()
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  const handleLogout = () => {
    logout()
  }

  const handleDeleteAccount = () => {
    if (window.confirm(t('user.delete'))) {
      logout()
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col relative">
      <PurchaseModal />
      <SupportModal />
      <AuthModal />
      <LanguageSelectionModal />
      <CookieBanner />
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 max-w-full overflow-x-hidden">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 h-16 flex items-center justify-between gap-1 sm:gap-3">
          <Link to="/" className="flex items-center gap-1.5 sm:gap-2 group shrink-0">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white transition-transform group-hover:scale-105 shrink-0">
              <Video size={16} className="sm:hidden" />
              <Video size={18} className="hidden sm:block" />
            </div>
            <span className="font-bold text-base sm:text-lg tracking-tight">ReelCraft</span>
          </Link>
          
          <nav className="flex items-center gap-1 sm:gap-3 shrink-0">
            <Link to="/" className="text-slate-500 hover:text-slate-900 font-medium text-sm transition-colors items-center gap-1.5 hidden md:flex">
              <Home size={16} /> {t('nav.home')}
            </Link>
            <Link to="/studio" className="text-slate-500 hover:text-slate-900 font-medium text-sm transition-colors items-center gap-1.5 hidden md:flex">
              <PlaySquare size={16} /> {t('nav.studio')}
            </Link>
            
            <button 
              onClick={openSupportModal}
              className="hidden lg:flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
            >
              <MessageSquare size={16} /> Destek
            </button>

            <div className="flex items-center gap-2 border-l border-slate-200 pl-4 hidden md:flex">
              <Globe size={16} className="text-slate-400" />
              <select 
                value={lang} 
                onChange={(e) => setLang(e.target.value as any)}
                className="bg-transparent text-sm font-medium text-slate-700 outline-none cursor-pointer w-16"
              >
                <option value="tr">🇹🇷 TR</option>
                <option value="en">🇺🇸 EN</option>
                <option value="de">🇩🇪 DE</option>
                <option value="es">🇪🇸 ES</option>
                <option value="fr">🇫🇷 FR</option>
                <option value="it">🇮🇹 IT</option>
                <option value="pt">🇵🇹 PT</option>
                <option value="ru">🇷🇺 RU</option>
                <option value="ar">🇸🇦 AR</option>
                <option value="ja">🇯🇵 JA</option>
                <option value="ko">🇰🇷 KO</option>
                <option value="zh">🇨🇳 ZH</option>
              </select>
            </div>

            <div className="flex items-center gap-1 sm:gap-2 border-l border-slate-200 pl-2 sm:pl-3">
              <button 
                onClick={openLangModal}
                className="flex items-center gap-1 text-xs sm:text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-2 py-1.5 sm:px-3 sm:py-1.5 rounded-xl transition-colors"
              >
                <Globe size={14} className="text-indigo-500 sm:w-4 sm:h-4" /> {lang.toUpperCase()}
              </button>
              <button 
                onClick={openPurchaseModal}
                className="hidden xl:flex items-center gap-1.5 text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl transition-colors"
              >
                <CreditCard size={16} className="text-slate-500" /> {t('app.credit')}
              </button>
              {token && (
                <button 
                  onClick={openPurchaseModal}
                  className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-700 font-bold rounded-xl transition-colors border border-amber-200 shadow-sm"
                >
                  <Zap size={16} className="text-amber-500 fill-amber-500" />
                  {user?.balance ?? 0} EPAY
                </button>
              )}
              <button 
                onClick={openPurchaseModal}
                className="flex items-center gap-1 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-xl transition-all shadow-sm active:scale-95 whitespace-nowrap"
              >
                <Zap size={14} className="sm:w-4 sm:h-4" /> Pro Al
              </button>
            </div>

            {token ? (
              <div className="flex items-center gap-3 ml-2 pl-4 border-l border-slate-200 group relative">
                <button
                  type="button"
                  onClick={() => setUserMenuOpen((prev) => !prev)}
                  className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-sm hover:bg-indigo-200 active:scale-95 transition-all shadow-xs"
                >
                  {user?.username?.[0]?.toUpperCase() || 'U'}
                </button>
                <div
                  className={`absolute right-0 top-10 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-200 transition-all flex flex-col py-2 z-50 ${
                    userMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible group-hover:opacity-100 group-hover:visible'
                  }`}
                >
                  <div className="px-4 py-2 border-b border-slate-100 mb-1">
                    <span className="block text-xs font-bold text-slate-900 truncate">{user?.username || 'Kullanıcı'}</span>
                    <span className="block text-[10px] text-emerald-600 font-semibold">{user?.balance ?? 0} EPAY</span>
                  </div>
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      openSupportModal();
                    }}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 w-full text-left"
                  >
                    <MessageSquare size={14} /> {t('footer.support')}
                  </button>
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      handleDeleteAccount();
                    }}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 w-full text-left"
                  >
                    <Trash2 size={14} /> {t('user.delete')}
                  </button>
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 w-full text-left border-t border-slate-100 mt-1 pt-2"
                  >
                    <LogOut size={14} /> {t('user.logout')}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 ml-2 pl-4 border-l border-slate-200">
                <Link 
                  to="/login"
                  className="flex items-center gap-1.5 text-sm font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 px-3 py-1.5 rounded-xl transition-colors"
                >
                  <UserCircle size={16} /> {t('nav.login')}
                </Link>
              </div>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>

      {/* Footer for App Store requirements */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500 font-medium">© 2026 ReelCraft AI. Tüm hakları saklıdır.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-sm text-slate-500 hover:text-slate-900 font-medium">{t('footer.privacy')}</a>
            <a href="#" className="text-sm text-slate-500 hover:text-slate-900 font-medium">{t('footer.terms')}</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
