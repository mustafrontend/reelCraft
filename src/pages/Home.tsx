import { Link } from 'react-router-dom'
import { Button } from '@/components/atoms/Button'
import PhoneMockup from '@/components/organisms/PhoneMockup'
import { Sparkles, Zap, Smartphone } from 'lucide-react'
import { useI18nStore } from '@/store/i18nStore'

export default function Home() {
  const { t } = useI18nStore()
  return (
    <div className="flex-1 bg-slate-50 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 pt-20 pb-32 sm:pt-32 flex flex-col lg:flex-row items-center gap-16">
        
        {/* Sol İçerik */}
        <div className="flex-1 text-center lg:text-left z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-sm font-medium mb-6 border-[0.5px] border-slate-200">
            <Sparkles size={14} className="text-amber-500" />
            <span>ReelCraft AI v1.0 is Live</span>
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-6">
            {t('home.title1')} <br className="hidden lg:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">
              {t('home.title2')}
            </span>
          </h1>
          
          <p className="text-lg text-slate-600 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed">
            {t('home.desc')}
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
            <Link to="/studio">
              <Button size="lg" className="w-full sm:w-auto gap-2 px-8 h-14 rounded-2xl text-base shadow-lg shadow-slate-900/10">
                <Zap size={18} />
                {t('home.cta.studio')}
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="w-full sm:w-auto gap-2 px-8 h-14 rounded-2xl text-base bg-white">
              <Smartphone size={18} />
              {t('home.cta.app')}
            </Button>
          </div>
          
          <div className="mt-12 flex items-center justify-center lg:justify-start gap-8 text-sm font-medium text-slate-500">
            <div className="flex flex-col items-center lg:items-start gap-1">
              <span className="text-2xl font-black text-slate-900">10k+</span>
              <span>Üretilen Video</span>
            </div>
            <div className="w-px h-10 bg-slate-200"></div>
            <div className="flex flex-col items-center lg:items-start gap-1">
              <span className="text-2xl font-black text-slate-900">99%</span>
              <span>Viral Başarı</span>
            </div>
          </div>
        </div>

        {/* Sağ 3D Mockup */}
        <div className="flex-1 relative w-full max-w-md lg:max-w-none flex justify-center">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-purple-200 to-pink-100 rounded-full blur-3xl opacity-50 z-0"></div>
          <PhoneMockup />
        </div>
        
      </div>
    </div>
  )
}
