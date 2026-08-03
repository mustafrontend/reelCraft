import { useState, useEffect } from 'react'
import { Button } from '@/components/atoms/Button'
import { useI18nStore } from '@/store/i18nStore'

export default function CookieBanner() {
  const { t } = useI18nStore()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const accepted = localStorage.getItem('lithos_cookies')
    if (!accepted) setIsVisible(true)
  }, [])

  const handleAccept = () => {
    localStorage.setItem('lithos_cookies', 'true')
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-0 inset-x-0 z-[200] bg-white border-t border-slate-200 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
      <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-slate-600 font-medium">
          {t('cookie.text')}
        </p>
        <Button onClick={handleAccept} size="sm" className="whitespace-nowrap px-6">
          {t('cookie.accept')}
        </Button>
      </div>
    </div>
  )
}
