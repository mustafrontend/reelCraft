export default function PhoneMockup() {
  return (
    <div className="relative mx-auto w-[300px] h-[600px] perspective-1000 group">
      <div className="absolute inset-0 preserve-3d transition-transform duration-700 ease-out transform group-hover:rotate-y-0 -rotate-y-6 rotate-x-4 shadow-2xl rounded-[3rem] bg-white ring-1 ring-slate-900/5">
        
        {/* Metalik yan tuşlar */}
        <div className="absolute -left-[2px] top-24 w-[3px] h-12 bg-slate-300 rounded-l-md shadow-[inset_1px_0_1px_rgba(255,255,255,0.5)]"></div>
        <div className="absolute -left-[2px] top-40 w-[3px] h-12 bg-slate-300 rounded-l-md shadow-[inset_1px_0_1px_rgba(255,255,255,0.5)]"></div>
        <div className="absolute -right-[2px] top-32 w-[3px] h-16 bg-slate-300 rounded-r-md shadow-[inset_-1px_0_1px_rgba(255,255,255,0.5)]"></div>
        
        {/* Ekran */}
        <div className="absolute inset-[8px] bg-slate-900 rounded-[2.5rem] overflow-hidden flex flex-col items-center justify-center relative">
          
          {/* Dynamic Island */}
          <div className="absolute top-2 w-[100px] h-[30px] bg-black rounded-full z-20 mx-auto left-0 right-0 shadow-[0_0_10px_rgba(0,0,0,0.5)] flex items-center justify-between px-3">
            <div className="w-2 h-2 rounded-full bg-slate-800"></div>
            <div className="w-2 h-2 rounded-full bg-green-500/50"></div>
          </div>
          
          {/* Ekran İçeriği / Video Mockup */}
          <div className="w-full h-full object-cover bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 animate-pulse opacity-80" />
          
          <div className="absolute bottom-8 left-4 right-4 bg-white/10 backdrop-blur-md rounded-2xl p-4 border-[0.5px] border-white/20">
            <div className="h-2 w-1/3 bg-white/30 rounded-full mb-3"></div>
            <div className="h-2 w-2/3 bg-white/30 rounded-full mb-2"></div>
            <div className="h-2 w-1/2 bg-white/30 rounded-full"></div>
          </div>
          
        </div>
        
        {/* Cam yansıması */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/30 rounded-[3rem] pointer-events-none"></div>

      </div>
      
      {/* Floating glassmorphism badge */}
      <div className="absolute -right-12 top-32 bg-white/80 backdrop-blur-md border-[0.5px] border-slate-200 rounded-2xl p-3 shadow-xl transform translate-z-10 animate-bounce">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="text-sm font-semibold text-slate-800">Viral Ready</div>
        </div>
      </div>
      
    </div>
  )
}
