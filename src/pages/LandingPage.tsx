import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Video, Sparkles, ChevronRight, CheckCircle2, Play, Upload, Smartphone, Zap } from 'lucide-react'
import { Button } from '@/components/atoms/Button'
import { useI18nStore } from '@/store/i18nStore'

export default function LandingPage() {
  const { t } = useI18nStore()
  
  const steps = [
    {
      icon: <Sparkles size={24} className="text-indigo-500" />,
      title: t('landing.step1.title'),
      desc: t('landing.step1.desc')
    },
    {
      icon: <Zap size={24} className="text-amber-500" />,
      title: t('landing.step2.title'),
      desc: t('landing.step2.desc')
    },
    {
      icon: <Play size={24} className="text-purple-500" />,
      title: t('landing.step3.title'),
      desc: t('landing.step3.desc')
    },
    {
      icon: <Upload size={24} className="text-green-500" />,
      title: t('landing.step4.title'),
      desc: t('landing.step4.desc')
    }
  ]

  return (
    <div className="flex-1 w-full bg-slate-50 overflow-hidden">
      
      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-4 pt-20 pb-32 flex flex-col lg:flex-row items-center gap-16">
        
        <div className="flex-1 text-center lg:text-left z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 font-bold text-sm mb-6 border border-indigo-200">
              <Sparkles size={16} /> {t('landing.badge')}
            </div>
            <h1 className="text-5xl lg:text-7xl font-black text-slate-900 tracking-tight leading-[1.1] mb-6">
              {t('landing.title1')} <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">{t('landing.title2')}</span>
            </h1>
            <p className="text-lg text-slate-600 font-medium mb-10 max-w-2xl mx-auto lg:mx-0">
              {t('landing.desc')}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link to="/studio">
                <Button size="lg" className="h-14 px-8 text-lg w-full sm:w-auto bg-slate-900 hover:bg-slate-800 shadow-xl shadow-slate-900/20">
                  <Video size={20} className="mr-2" /> {t('landing.btn.studio')}
                </Button>
              </Link>
              <Link to="/register">
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg w-full sm:w-auto bg-white">
                  {t('landing.btn.try')} <ChevronRight size={20} className="ml-2" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* 3D Kinetic Phone Mockup */}
        <div className="flex-1 relative perspective-1000 w-full max-w-md mx-auto lg:max-w-none">
          <motion.div 
            initial={{ rotateY: 15, rotateX: 5, y: 50, opacity: 0 }}
            animate={{ rotateY: -6, rotateX: 4, y: 0, opacity: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            style={{ transformStyle: 'preserve-3d' }}
            className="relative mx-auto w-[320px] h-[650px] bg-slate-900 rounded-[3rem] p-3 shadow-2xl border-4 border-slate-800 ring-4 ring-slate-100 ring-offset-4"
          >
            {/* Dynamic Island */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 w-24 h-7 bg-black rounded-full z-20"></div>
            
            {/* Screen */}
            <div className="relative w-full h-full bg-slate-50 rounded-[2.2rem] overflow-hidden flex flex-col border border-slate-200 shadow-inner">
              <div className="flex-1 bg-gradient-to-b from-indigo-500 to-purple-600 p-6 flex flex-col justify-between">
                <div className="mt-8 bg-white/20 backdrop-blur-md rounded-2xl p-4 border border-white/30 text-white">
                  <div className="font-bold text-sm mb-1">Yeni Video Hazır!</div>
                  <div className="text-xs text-white/80">Siberpunk Tokyo Belgeseli</div>
                </div>
                
                <div className="flex justify-center mb-10">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white cursor-pointer hover:bg-white/30 transition-colors">
                    <Play size={24} className="ml-1" />
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Glass Pop-out Cards */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -right-12 top-32 bg-white/80 backdrop-blur-xl p-4 rounded-2xl shadow-xl border border-white/40 flex items-center gap-3"
              style={{ transform: 'translateZ(50px)' }}
            >
              <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center"><CheckCircle2 size={20} /></div>
              <div>
                <div className="text-sm font-bold text-slate-900">Senaryo Üretildi</div>
                <div className="text-xs font-medium text-slate-500">1.2 saniye</div>
              </div>
            </motion.div>
            
            <motion.div 
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -left-16 bottom-40 bg-white/80 backdrop-blur-xl p-4 rounded-2xl shadow-xl border border-white/40 flex items-center gap-3"
              style={{ transform: 'translateZ(80px)' }}
            >
              <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center"><Smartphone size={20} /></div>
              <div>
                <div className="text-sm font-bold text-slate-900">1080p Export</div>
                <div className="text-xs font-medium text-slate-500">%100 Tamamlandı</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Nasıl Çalışır? */}
      <section className="py-24 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">{t('landing.how.title')}</h2>
            <p className="text-lg text-slate-500 font-medium">{t('landing.how.desc')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-slate-50 rounded-3xl p-8 border border-slate-100 relative group hover:border-indigo-200 transition-colors"
              >
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center font-black text-slate-300 text-xl group-hover:text-indigo-500 transition-colors">
                  {idx + 1}
                </div>
                <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
                <p className="text-sm text-slate-600 font-medium leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}
