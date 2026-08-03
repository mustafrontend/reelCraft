import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RefreshCw, Download, Trash2, CheckCircle2, AlertCircle, Sparkles,
  Image as ImageIcon, Rocket, Sliders, Tv, Type, Video, Zap,
  Search, X, Link as LinkIcon, Users, Plus, Wand2, Grid
} from 'lucide-react';
import { VideoEditorPreview } from '@/components/organisms/VideoEditorPreview';
import { useAuthStore } from '@/store/authStore';
import { useI18nStore } from '@/store/i18nStore';
import { API_BASE } from '@/config';



interface GeneratedImageItem {
  id: number;
  url: string;
  isDeleted: boolean;
}

// ── KATEGORİ BAZLI HAZIR GÖRSEL KÜTÜPHANESİ DATA ──
const CATEGORY_STOCK_LIBRARY: {
  id: string;
  name: string;
  icon: string;
  images: { title: string; url: string }[];
}[] = [
  {
    id: 'animals',
    name: 'Hayvanlar & Doğa',
    icon: '🐱',
    images: [
      { title: 'Sevimli Ev Kedisi', url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&auto=format&fit=crop&q=80' },
      { title: 'Vahşi Aslan Portresi', url: 'https://images.unsplash.com/photo-1534188753412-3e26d0d618d6?w=800&auto=format&fit=crop&q=80' },
      { title: 'Sadık Köpek Dostu', url: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&auto=format&fit=crop&q=80' },
      { title: 'Sisli Çam Ormanı', url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&auto=format&fit=crop&q=80' },
      { title: 'Görkemli Dağ Zirvesi', url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop&q=80' }
    ]
  },
  {
    id: 'history',
    name: 'Tarih & Kültür',
    icon: '🏛️',
    images: [
      { title: 'Antik Roma Koloseum', url: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&auto=format&fit=crop&q=80' },
      { title: 'Mısır Piramitleri', url: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?w=800&auto=format&fit=crop&q=80' },
      { title: 'Ortaçağ Şatosu', url: 'https://images.unsplash.com/photo-1524397057410-1e775ed476f3?w=800&auto=format&fit=crop&q=80' },
      { title: 'Tarihi Kütüphane & Parşömen', url: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800&auto=format&fit=crop&q=80' }
    ]
  },
  {
    id: 'space',
    name: 'Uzay & Bilim',
    icon: '🚀',
    images: [
      { title: 'Derin Uzay Nebulası', url: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800&auto=format&fit=crop&q=80' },
      { title: 'Astronot & Ay Yüzeyi', url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80' },
      { title: 'Gezegen & Yıldızlar', url: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=800&auto=format&fit=crop&q=80' },
      { title: 'Futurist Siber Şehir', url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80' }
    ]
  },
  {
    id: 'city',
    name: 'Şehir & Mimari',
    icon: '🌆',
    images: [
      { title: 'Gece Tokyo Işıkları', url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&auto=format&fit=crop&q=80' },
      { title: 'Paris Eyfel Kulesi', url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&auto=format&fit=crop&q=80' },
      { title: 'Gökdelenler & Bulutlar', url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80' }
    ]
  },
  {
    id: 'cinematic',
    name: 'Sinematik Drama',
    icon: '🎨',
    images: [
      { title: 'Dramatik Işık & Portre', url: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&auto=format&fit=crop&q=80' },
      { title: 'Gün Batımı Süzülüşü', url: 'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=800&auto=format&fit=crop&q=80' },
      { title: 'Gizemli Gece Işıkları', url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&auto=format&fit=crop&q=80' }
    ]
  }
];

// ── KART BİLEŞENİ (Görsel Onaylama & Yükleme Spinner'ı) ──
function ImageCardItem({
  img,
  idx,
  isCover,
  handleSelectCover,
  handleToggleDeleteImage,
  onOpenCategoryModal
}: {
  img: GeneratedImageItem;
  idx: number;
  isCover: boolean;
  handleSelectCover: (idx: number) => void;
  handleToggleDeleteImage: (id: number) => void;
  onOpenCategoryModal: (idx: number) => void;
}) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: idx * 0.04 }}
      className={`relative bg-white border rounded-2xl overflow-hidden transition-all shadow-xs flex flex-col justify-between ${
        img.isDeleted
          ? 'opacity-40 border-slate-200 grayscale'
          : isCover
          ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-md'
          : 'border-slate-200 hover:border-slate-300'
      }`}
    >
      {/* Visual Header Badges */}
      <div className="absolute top-3 left-3 px-2.5 py-1 bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-black rounded-lg z-10 shadow-xs">
        #{img.id}
      </div>

      {isCover && (
        <div className="absolute top-3 right-3 px-2.5 py-1 bg-emerald-600 text-white text-[10px] font-black rounded-lg z-10 shadow-xs tracking-wider uppercase flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          Kapak Resmi
        </div>
      )}

      {/* Image Display Area */}
      <div className="aspect-video bg-slate-100 relative overflow-hidden flex items-center justify-center">
        {!loaded && !failed && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2.5 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-slate-100 z-0">
            <RefreshCw className="w-6 h-6 text-indigo-400 animate-spin" />
            <span className="text-[11px] font-bold text-indigo-300 animate-pulse tracking-wide">
              8K AI Üretiliyor...
            </span>
          </div>
        )}

        {failed && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-slate-100 text-slate-700 p-4 text-center z-0">
            <AlertCircle className="w-6 h-6 text-amber-500" />
            <span className="text-[11px] font-bold text-slate-600">
              Görsel Hazırlanıyor...
            </span>
            <button
              onClick={() => onOpenCategoryModal(idx)}
              className="px-3 py-1 bg-indigo-600 text-white text-[10px] font-bold rounded-lg hover:bg-indigo-700 transition-all shadow-2xs"
            >
              Görsel Seç / Değiştir
            </button>
          </div>
        )}

        <img
          src={img.url}
          alt={`Görsel #${img.id}`}
          className={`w-full h-full object-cover transition-all duration-500 ${
            loaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
          onLoad={() => {
            setLoaded(true);
            setFailed(false);
          }}
          onError={(e) => {
            setLoaded(false);
            const target = e.currentTarget;
            const tries = parseInt(target.dataset.tries || '0', 10);
            if (tries < 40) {
              target.dataset.tries = String(tries + 1);
              const base = img.url.split('?')[0];
              setTimeout(() => {
                if (target) {
                  target.src = `${base}?r=${tries + 1}&t=${Date.now()}`;
                }
              }, 1500);
            } else {
              setFailed(true);
            }
          }}
        />
      </div>

      {/* Card Controls Footer */}
      <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-1.5 flex-wrap">
        <button
          onClick={() => handleSelectCover(idx)}
          disabled={img.isDeleted}
          className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 active:scale-[0.98] flex items-center gap-1 ${
            isCover
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full border ${
              isCover ? 'bg-white border-white' : 'border-slate-400'
            }`}
          />
          <span>{isCover ? 'KAPAK' : 'KAPAK YAP'}</span>
        </button>

        <button
          onClick={() => onOpenCategoryModal(idx)}
          disabled={img.isDeleted}
          className="px-2.5 py-1.5 bg-indigo-50 text-indigo-700 border border-indigo-100 hover:bg-indigo-100 rounded-xl text-xs font-bold transition-all active:scale-[0.98] flex items-center gap-1"
        >
          <ImageIcon className="w-3.5 h-3.5 text-indigo-600" />
          <span>Değiştir</span>
        </button>

        <button
          onClick={() => handleToggleDeleteImage(img.id)}
          className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 active:scale-[0.98] flex items-center gap-1 ${
            img.isDeleted
              ? 'bg-slate-200 text-slate-800'
              : 'bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-100'
          }`}
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>{img.isDeleted ? 'Geri Al' : 'Sil'}</span>
        </button>
      </div>
    </motion.div>
  );
}

const safeParseJson = async (r: Response) => {
  const text = await r.text();
  try {
    return JSON.parse(text);
  } catch {
    return { success: false, message: text || 'Sunucudan geçersiz yanıt alındı.' };
  }
};

export default function Studio() {
  const { t } = useI18nStore();
  const user = useAuthStore((state) => state.user);
  const fetchUser = useAuthStore((state) => state.fetchUser);
  const setUser = (_u: any) => { if (fetchUser) fetchUser(); };
  // ── 0. MOD SEÇİMİ ('auto' = AI Tümünü Üretsin, 'manual' = Slotlar {t("studio.story.open")}ık Gelsin) ──
  const [studioMode, setStudioMode] = useState<'auto' | 'manual'>('auto');

  // 1. Core State Parameters
  const [topic, setTopic] = useState('');
  const [language, setLanguage] = useState('Turkish');
  const [voice, setVoice] = useState('Standard A');
  const [speed, setSpeed] = useState<number>(0.00);
  const [pitch, setPitch] = useState<number>(0.00);
  const [durationSec, setDurationSec] = useState<number>(60);
  const [numImages, setNumImages] = useState<number>(5);
  const [aspectRatio, setAspectRatio] = useState<'9:16' | '16:9' | '1:1'>('16:9');

  const [videoFilename, setVideoFilename] = useState('');
  const [channelName, setChannelName] = useState('');
  const [coverText, setCoverText] = useState('');

  // EPAY Fiyatlandırma
  const REAL_VIDEO_BASE_COST = 5;
  const REAL_VIDEO_PER_IMAGE = 1;

  const getDurationCost = (sec: number) => {
    if (sec <= 30) return 0;
    if (sec <= 60) return 2;
    if (sec <= 120) return 5;
    if (sec <= 180) return 8;
    if (sec <= 300) return 14;
    if (sec <= 600) return 25;
    if (sec <= 900) return 35;
    if (sec <= 1200) return 45;
    return 60;
  };

  const durationCost = getDurationCost(durationSec);
  const estimatedCost = REAL_VIDEO_BASE_COST + REAL_VIDEO_PER_IMAGE * numImages + durationCost;

  // 2. Flow & Render States
  const [isGenerating, setIsGenerating] = useState(false);
  const [stepMessage, setStepMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  // 3. Image Approval / Manual Selection Grid State
  const [images, setImages] = useState<GeneratedImageItem[]>([]);
  const [coverIndex, setCoverIndex] = useState<number>(0);
  const [stateId, setStateId] = useState<string | null>(null);

  // Kurgu editörü: sahne başına göreli süre ağırlığı (id -> ağırlık). Kullanıcı
  // sürükleyerek ayarlamadıysa (weightsEdited=false) render eski davranışı korur.
  const [sceneWeights, setSceneWeights] = useState<{ [id: number]: number }>({});
  const [weightsEdited, setWeightsEdited] = useState<boolean>(false);

  // Arka plan müziği
  const [musicUrl, setMusicUrl] = useState<string>('');
  const [musicVolume, setMusicVolume] = useState<number>(0.12);
  const [musicTracks, setMusicTracks] = useState<{ name: string; url: string }[]>([]);

  const [musicUploading, setMusicUploading] = useState<boolean>(false);

  // 💡 Hikaye Örgüsü / Öneri Üretici (5 EPAY)
  const [showStoryGen, setShowStoryGen] = useState<boolean>(false);
  const [storyGenre, setStoryGenre] = useState<string>('Korku');
  const [storyChapters, setStoryChapters] = useState<number>(3);
  const [storySeed, setStorySeed] = useState<string>('');
  const [storyLoading, setStoryLoading] = useState<boolean>(false);
  const [storyResult, setStoryResult] = useState<{ title: string; logline: string; chapters: { title: string; summary: string }[]; narration: string } | null>(null);

  const handleGenerateStory = async () => {
    setStoryLoading(true);
    setError(null);
    setStoryResult(null);
    try {
      const token = localStorage.getItem('lithos_token');
      const res = await fetch('/api/seo/story_suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ genre: storyGenre, chapters: storyChapters, seed: storySeed, language }),
      });
      const data = await res.json();
      if (data.success && data.story) {
        setStoryResult(data.story);
        if (setUser && data.balance !== undefined) setUser({ ...user, balance: data.balance });
      } else {
        setError(data.message || 'Hikaye önerisi üretilemedi.');
      }
    } catch (e: any) {
      setError('Hikaye önerisi hatası: ' + (e?.message || ''));
    } finally {
      setStoryLoading(false);
    }
  };

  const useStoryAsTopic = () => {
    if (!storyResult) return;
    const t = storyResult.narration || storyResult.logline || '';
    if (t) {
      setTopic(t);
      if (storyResult.title) setVideoFilename?.(storyResult.title.slice(0, 60));
    }
  };

  // 🖼️ Thumbnail (kapak) stil üretici
  const [thumbStyle, setThumbStyle] = useState<string>('mrbeast');
  const [thumbTitle, setThumbTitle] = useState<string>('');
  const [thumbUrl, setThumbUrl] = useState<string>('');
  const [thumbLoading, setThumbLoading] = useState<boolean>(false);

  const handleGenerateThumbnail = async () => {
    if (!stateId) return;
    setThumbLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('lithos_token');
      const res = await fetch('/api/seo/generate_thumbnail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ state_id: stateId, style: thumbStyle, title: (thumbTitle || coverText || topic), cover_index: coverIndex }),
      });
      const data = await res.json();
      if (data.success && data.thumbnail_url) setThumbUrl(data.thumbnail_url);
      else setError(data.message || 'Thumbnail oluşturulamadı.');
    } catch (e: any) {
      setError('Thumbnail hatası: ' + (e?.message || ''));
    } finally {
      setThumbLoading(false);
    }
  };

  // 🎞️ {t("studio.past.title")} (geçmiş)
  const [myVideos, setMyVideos] = useState<any[]>([]);
  const [showMyVideos, setShowMyVideos] = useState<boolean>(false);
  const [loadingMyVideos, setLoadingMyVideos] = useState<boolean>(false);

  const toggleMyVideos = async () => {
    const next = !showMyVideos;
    setShowMyVideos(next);
    if (next) {
      setLoadingMyVideos(true);
      try {
        const token = localStorage.getItem('lithos_token');
        const res = await fetch('/api/user/videos', { headers: { Authorization: `Bearer ${token}` } });
        const data = await res.json();
        if (data.success) setMyVideos(data.data || []);
      } catch {
        /* yoksay */
      } finally {
        setLoadingMyVideos(false);
      }
    }
  };

  // Senaryo (anlatı metni) görüntüle + düzenle + sesi yenile
  const [scriptText, setScriptText] = useState<string>('');
  const [regeneratingVoice, setRegeneratingVoice] = useState<boolean>(false);
  const [audioVersion, setAudioVersion] = useState<number>(0);

  const handleRegenerateVoice = async () => {
    if (!stateId || !scriptText.trim()) return;
    setRegeneratingVoice(true);
    setError(null);
    try {
      const token = localStorage.getItem('lithos_token');
      const res = await fetch('/api/seo/generate_real_video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ action: 'regenerate_voiceover', state_id: stateId, script: scriptText, language, voice, speed, pitch }),
      });
      const data = await res.json();
      if (data.success) {
        setAudioVersion((v) => v + 1); // önizleme sesini + dalga formunu yenile
      } else {
        setError(data.message || 'Ses yeniden oluşturulamadı.');
      }
    } catch (e: any) {
      setError('Ses yenileme hatası: ' + (e?.message || ''));
    } finally {
      setRegeneratingVoice(false);
    }
  };

  // Altyazı (anlatıdan otomatik zamanlı)
  const [subtitlesOn, setSubtitlesOn] = useState<boolean>(false);
  const [captionPosition, setCaptionPosition] = useState<'bottom' | 'top'>('bottom');

  // 🎵 Bilgisayardan müzik yükle → public/music preset olur
  const handleUploadMusic = async (file: File) => {
    setMusicUploading(true);
    try {
      const token = localStorage.getItem('lithos_token');
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/seo/upload_music', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      const data = await res.json();
      if (data.success && data.url) {
        setMusicTracks((prev) => [...prev.filter((t) => t.url !== data.url), { name: data.name, url: data.url }]);
        setMusicUrl(data.url);
      } else {
        setError(data.message || 'Müzik yüklenemedi.');
      }
    } catch (e: any) {
      setError('Müzik yükleme hatası: ' + (e?.message || ''));
    } finally {
      setMusicUploading(false);
    }
  };

  // 4. Modal & Custom Selection State
  const [categoryModalSceneIdx, setCategoryModalSceneIdx] = useState<number | null>(null);
  const [activeCategoryTab, setActiveCategoryTab] = useState<string>('community');
  const [customSearchTerm, setCustomSearchTerm] = useState<string>('');
  const [customUrlInput, setCustomUrlInput] = useState<string>('');
  const [isReplacingImage, setIsReplacingImage] = useState<boolean>(false);
  const [communityImages, setCommunityImages] = useState<{ url: string; title: string }[]>([]);

  // Manuel modda kullanıcı tarafından atanan slot görselleri (Map: idx -> url)
  const [manualSlotUrls, setManualSlotUrls] = useState<{ [key: number]: string }>({});

  // 5. Final Rendered Video State
  const [renderedVideoUrl, setRenderedVideoUrl] = useState<string | null>(null);
  const [renderedCoverUrl, setRenderedCoverUrl] = useState<string | null>(null);

  const sampleTopics = [
    'Le Chien Qui Refusa de Quitter un Hôpital Pendant 11 Ans | Brésil | XXIe Siècle',
    'İstanbul Surlarının 1500 Yıllık Gizli Geçitleri ve Fatih Sultan Mehmet Destanı',
    'The Mystery of the Deep Ocean Creatures: Unexplored Wonders of the Mariana Trench'
  ];

  // Topluluk görsellerini çek
  useEffect(() => {
    fetch(`${API_BASE}/api/seo/music_library`)
      .then((res) => res.json())
      .then((data) => { if (data.success && Array.isArray(data.tracks)) setMusicTracks(data.tracks); })
      .catch(() => {});

    fetch(`${API_BASE}/api/seo/community_images`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.images) {
          setCommunityImages(data.images);
        }
      })
      .catch(() => {});
  }, []);

  const handleClearText = () => {
    setTopic('');
  };

  const handleLoadSampleTopic = (sample: string) => {
    setTopic(sample);
  };

  const pollJobStatus = (sId: string, onComplete: (job: any) => void) => {
    const token = localStorage.getItem('lithos_token');
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/seo/generate_real_video_status?state_id=${sId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await safeParseJson(res);
        if (data.success && data.job) {
          const j = data.job;
          if (j.message) setStepMessage(j.message);

          if (j.status === 'completed') {
            clearInterval(interval);
            onComplete(j);
          } else if (j.status === 'failed') {
            clearInterval(interval);
            setError(j.error || j.message || 'İşlem sırasında hata oluştu.');
            setIsGenerating(false);
            setStepMessage('');
          }
        }
      } catch (e) {
        console.warn('Poll error:', e);
      }
    }, 2500);
  };

  // 🚀 TAM OTOMATİK VEYA MANUEL MODDA VİDEOYU BAŞLAT
  const handleStartAutoMode = async () => {
    // Zorunlu alanlar
    const eksik: string[] = [];
    if (!topic.trim()) eksik.push('İşlenecek Konu');
    if (!channelName.trim()) eksik.push('Kanal İsmi');
    if (!coverText.trim()) eksik.push('Kapak Yazısı');
    if (eksik.length > 0) {
      setError(`Lütfen zorunlu alanları doldurun: ${eksik.join(', ')}.`);
      return;
    }

    setIsGenerating(true);
    setError(null);
    setRenderedVideoUrl(null);

    // Manuel moddaysa seçilen slot URL'lerini derle
    const preSelectedList: string[] = [];
    if (studioMode === 'manual') {
      for (let i = 0; i < numImages; i++) {
        if (manualSlotUrls[i]) {
          preSelectedList.push(manualSlotUrls[i]);
        }
      }
    }

    setStepMessage(`🚀 Metin, Ses ve ${numImages} Adet Görsel İşleniyor...`);

    try {
      const token = localStorage.getItem('lithos_token');
      const res = await fetch('/api/seo/generate_real_video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          action: 'generate_images_and_script',
          prompt: topic,
          language,
          voice,
          speed,
          pitch,
          duration_sec: durationSec,
          num_images: numImages,
          aspect_ratio: aspectRatio,
          video_filename: videoFilename,
          channel_name: channelName,
          cover_text: coverText,
          custom_image_urls: preSelectedList
        })
      });

      const data = await safeParseJson(res);
      if (!res.ok || !data.success) {
        setError(data.message || 'Üretim sırasında hata oluştu.');
        setIsGenerating(false);
        setStepMessage('');
        return;
      }

      const newId = data.state_id || 'state_' + Date.now();
      setStateId(newId);

      if (setUser && data.balance !== undefined) {
        setUser({ ...user, balance: data.balance });
      }

      if (data.async) {
        pollJobStatus(newId, (completedJob) => {
          const generatedList: GeneratedImageItem[] = (completedJob.images || []).map(
            (imgUrl: string, idx: number) => ({
              id: idx + 1,
              url: imgUrl,
              isDeleted: false
            })
          );
          setImages(generatedList);
          setCoverIndex(0);
          setScriptText(completedJob.story_script || '');
          setStepMessage('');
          setIsGenerating(false);
        });
      } else {
        const generatedList: GeneratedImageItem[] = (data.images || []).map(
          (imgUrl: string, idx: number) => ({
            id: idx + 1,
            url: imgUrl,
            isDeleted: false
          })
        );
        setImages(generatedList);
        setCoverIndex(0);
        setScriptText(data.story_script || '');
        setStepMessage('');
        setIsGenerating(false);
      }
    } catch (err: any) {
      setError(err.message || 'Sunucu bağlantı hatası.');
      setIsGenerating(false);
    }
  };

  // 🗑️ Görsel Sil / Kaldır Toggle
  const handleToggleDeleteImage = (id: number) => {
    setImages((prev) =>
      prev.map((img) => (img.id === id ? { ...img, isDeleted: !img.isDeleted } : img))
    );
  };

  // ⚪ KAPAK YAP
  const handleSelectCover = (index: number) => {
    setCoverIndex(index);
  };

  // ↔️ Sahneyi sırala (kurgu şeridi). En yakın silinmemiş komşuyla yer değiştirir.
  // Render motoru image_urls'i sırayla işlediği için bu sıra final videoya yansır.
  const handleMoveImage = (imgId: number, dir: -1 | 1) => {
    const arr = [...images];
    const from = arr.findIndex((x) => x.id === imgId);
    if (from < 0) return;
    let to = from + dir;
    while (to >= 0 && to < arr.length && arr[to].isDeleted) to += dir;
    if (to < 0 || to >= arr.length) return;
    [arr[from], arr[to]] = [arr[to], arr[from]];
    setImages(arr);
    setCoverIndex((ci) => (ci === from ? to : ci === to ? from : ci));
  };

  // ↔️ Sürükle-bırak sıralama: fromId'yi toId'nin konumuna taşı.
  const handleReorderTo = (fromId: number, toId: number) => {
    if (fromId === toId) return;
    const arr = [...images];
    const from = arr.findIndex((x) => x.id === fromId);
    const to = arr.findIndex((x) => x.id === toId);
    if (from < 0 || to < 0) return;
    const coverId = images[coverIndex]?.id;
    const [moved] = arr.splice(from, 1);
    arr.splice(to, 0, moved);
    setImages(arr);
    // Kapak, taşınan görseli takip etsin
    if (coverId !== undefined) {
      const newCover = arr.findIndex((x) => x.id === coverId);
      if (newCover >= 0) setCoverIndex(newCover);
    }
  };

  // ⏱️ Sahne süresini (göreli ağırlık) ayarla — editörde sürükleyince.
  const handleSetWeight = (imgId: number, weight: number) => {
    setSceneWeights((prev) => ({ ...prev, [imgId]: Math.max(0.3, weight) }));
    setWeightsEdited(true);
  };

  // ➕ Yeni foto ekle: mevcut "Değiştir" modalını "ekle" modunda (-1) aç.
  const handleAddPhoto = () => {
    setActiveCategoryTab('community');
    setCategoryModalSceneIdx(-1);
  };

  // 🔄 OLUŞMAYAN GÖRSELLERİ TEKRAR TETİKLE (Retry Failed Images)
  const handleRetryMissingImages = async () => {
    if (!stateId || images.length === 0) return;

    setIsGenerating(true);
    setStepMessage('🔄 Oluşmayan görseller yeniden üretiliyor...');

    try {
      const token = localStorage.getItem('lithos_token');
      const failedIndices = images.map((_, idx) => idx);

      const res = await fetch('/api/seo/generate_real_video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          action: 'retry_missing_images',
          state_id: stateId,
          prompt: topic,
          failed_indices: failedIndices
        })
      });

      const data = await res.json();
      if (res.ok && data.success && data.updated_urls) {
        setImages((prev) =>
          prev.map((img, i) => {
            const updated = data.updated_urls[String(i)] || data.updated_urls[i];
            return updated ? { ...img, url: updated } : img;
          })
        );
        setStepMessage('✅ Görseller Başarıyla Yeniden Üretildi!');
        setTimeout(() => setStepMessage(''), 3000);
      } else {
        setError(data.message || 'Yeniden üretim başarısız.');
      }
    } catch (err: any) {
      setError(err.message || 'Yeniden üretim bağlantı hatası.');
    } finally {
      setIsGenerating(false);
    }
  };

  // 📷 SAHNE RESMİNİ ATAMA / DEĞİŞTİRME (Hem Manuel Slotlar Hem Canlı Kartlar İçin)
  const handleAssignSceneImage = async (
    sceneIdx: number,
    selectedUrl?: string,
    selectedPrompt?: string
  ) => {
    // 1. Manuel Modda henüz video üretilmemişse doğrudan slot nesnesini güncelle
    if (studioMode === 'manual' && images.length === 0) {
      if (selectedUrl) {
        setManualSlotUrls((prev) => ({ ...prev, [sceneIdx]: selectedUrl }));
      }
      setCategoryModalSceneIdx(null);
      setCustomSearchTerm('');
      setCustomUrlInput('');
      return;
    }

    // 2. Canlı üretilmiş resimler varsa backend üzerinden resmi güncelle
    if (stateId) {
      setIsReplacingImage(true);
      try {
        const token = localStorage.getItem('lithos_token');
        const res = await fetch('/api/seo/generate_real_video', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            action: 'replace_single_image',
            state_id: stateId,
            // sceneIdx === -1 => YENİ FOTO EKLE: yeni bir sahne dosyasına (max id) yaz
            scene_index: sceneIdx === -1 ? images.reduce((m, x) => Math.max(m, x.id), 0) : sceneIdx,
            custom_url: selectedUrl || '',
            custom_prompt: selectedPrompt || customSearchTerm || topic
          })
        });

        const data = await res.json();
        if (res.ok && data.success && data.image_url) {
          if (sceneIdx === -1) {
            // Yeni sahneyi diziye ekle
            const newId = images.reduce((m, x) => Math.max(m, x.id), 0) + 1;
            setImages((prev) => [...prev, { id: newId, url: data.image_url, isDeleted: false }]);
          } else {
            setImages((prev) =>
              prev.map((img, i) =>
                i === sceneIdx ? { ...img, url: data.image_url } : img
              )
            );
          }
          setCategoryModalSceneIdx(null);
          setCustomSearchTerm('');
          setCustomUrlInput('');
        } else {
          setError(data.message || 'Görsel değiştirilemedi.');
        }
      } catch (err: any) {
        setError(err.message || 'Görsel değiştirme bağlantı hatası.');
      } finally {
        setIsReplacingImage(false);
      }
    }
  };

  // 🚀 Onayla ve Videoyu Yap (Final Render)
  const handleConfirmAndRenderVideo = async () => {
    const activeImages = images.filter((img) => !img.isDeleted);
    if (activeImages.length === 0) {
      setError('Lütfen en az 1 adet görseli onaylı bırakın!');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setStepMessage(
      '🎬 Görseller, Ses ve Efektler Birleştirilerek Final Video Render Ediliyor...'
    );

    try {
      const token = localStorage.getItem('lithos_token');
      const deletedIndices = images
        .filter((img) => img.isDeleted)
        .map((img) => img.id - 1);
      const activeList = images.filter((img) => !img.isDeleted);
      const activeImageUrls = activeList.map((img) => img.url);
      // Kapak: silme/sıralama sonrası doğru kalması için AKTİF sıradaki index'e çevir
      const coverId = images[coverIndex]?.id;
      const activeCoverIndex = Math.max(0, activeList.findIndex((img) => img.id === coverId));

      const res = await fetch('/api/seo/generate_real_video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          action: 'render_final_video',
          state_id: stateId,
          aspect_ratio: aspectRatio,
          deleted_indices: deletedIndices,
          image_urls: activeImageUrls,
          // Kullanıcı editörde süre ayarladıysa göreli ağırlıkları gönder (aktif sıra ile hizalı)
          durations: weightsEdited
            ? activeList.map((img) => sceneWeights[img.id] ?? 1)
            : undefined,
          music_url: musicUrl || undefined,
          music_volume: musicVolume,
          subtitles: subtitlesOn,
          caption_position: captionPosition,
          cover_index: activeCoverIndex,
          cover_text: coverText,
          channel_name: channelName,
          video_title: videoFilename
        })
      });

      const data = await safeParseJson(res);
      if (!res.ok || !data.success) {
        setError(data.message || 'Render sırasında hata oluştu.');
        setIsGenerating(false);
      } else {
        if (data.async) {
          pollJobStatus(stateId!, (renderedJob) => {
            setRenderedVideoUrl(renderedJob.video_url || null);
            setRenderedCoverUrl(renderedJob.thumbnail_url || null);
            if (setUser && renderedJob.balance !== undefined) {
              setUser({ ...user, balance: renderedJob.balance });
            }
            setStepMessage('🎉 Final Video Başarıyla Oluşturuldu!');
            setIsGenerating(false);
          });
        } else {
          setRenderedVideoUrl(data.video_url || null);
          setRenderedCoverUrl(data.thumbnail_url || null);
          if (setUser && data.balance !== undefined) {
            setUser({ ...user, balance: data.balance });
          }
          setStepMessage('🎉 Final Video Başarıyla Oluşturuldu!');
          setIsGenerating(false);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Render bağlantı hatası.');
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 font-sans pb-16 text-slate-800">
      {/* EDITORIAL TOP HEADER */}
      <div className="bg-white border-[0.5px] border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-full text-indigo-700 text-xs font-bold tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            {/* i18n */}<span>{t("studio.header.badge")}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {t("studio.header.title")}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
            {t("studio.header.desc")}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl flex items-center gap-2 text-xs font-bold text-slate-700">
            <Zap className="w-4 h-4 text-emerald-500" />
            <span>{t("studio.balance.label")}</span>
            <span className="font-black text-slate-900">
              {user?.balance ?? 1000} EPAY
            </span>
          </div>
        </div>
      </div>

      {/* MODE SWITCHER TAB BAR (Tam Otomatik vs Kendin Seç) */}
      <div className="bg-slate-100 p-1.5 rounded-2xl border border-slate-200/80 flex items-center gap-2">
        <button
          onClick={() => setStudioMode('auto')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
            studioMode === 'auto'
              ? 'bg-white text-indigo-600 shadow-sm border border-slate-200/60'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Wand2 className="w-4 h-4 text-indigo-600" />
          <span>{t("studio.mode.auto")}</span>
        </button>

        <button
          onClick={() => setStudioMode('manual')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
            studioMode === 'manual'
              ? 'bg-white text-indigo-600 shadow-sm border border-slate-200/60'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Grid className="w-4 h-4 text-indigo-600" />
          <span>{t("studio.mode.manual")}</span>
        </button>
      </div>

      {/* ERROR ALERT DISPLAY */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs font-bold text-rose-700 flex items-center justify-between gap-3 shadow-2xs"
          >
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-rose-500 hover:text-rose-700 text-xs font-bold"
            >
              Kapat
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* STEP MESSAGE NOTIFICATION */}
      <AnimatePresence>
        {stepMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 bg-indigo-50 border border-indigo-200 rounded-xl text-xs font-bold text-indigo-900 flex items-center gap-3 shadow-2xs"
          >
            <RefreshCw className="w-4 h-4 text-indigo-600 animate-spin shrink-0" />
            <span>{stepMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🎞️ VIDEOLARIM (GEÇMİŞ) */}
      <div className="bg-white border-[0.5px] border-slate-200/80 rounded-2xl shadow-xs">
        <button
          onClick={toggleMyVideos}
          className="w-full flex items-center justify-between px-5 py-3.5"
        >
          <span className="text-sm font-black text-slate-800 flex items-center gap-2">🎞️ {t("studio.past.title")} {myVideos.length > 0 && <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">{myVideos.length}</span>}</span>
          <span className="text-[11px] font-bold text-indigo-600">{showMyVideos ? '{t("studio.myvideos.toggle")} ▲' : '{t("studio.myvideos.toggle")} ▼'}</span>
        </button>
        {showMyVideos && (
          <div className="px-5 pb-5">
            {loadingMyVideos ? (
              <div className="text-xs text-slate-400 py-4 text-center">{t("studio.generating.desc")}</div>
            ) : myVideos.length === 0 ? (
              <div className="text-xs text-slate-400 py-4 text-center">Henüz oluşturulmuş video yok.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {myVideos.map((v: any) => {
                  const vurl = (v.videoUrl || '').startsWith('http') ? v.videoUrl : v.videoUrl;
                  return (
                    <div key={v.id} className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                      {vurl && vurl.endsWith('.mp4') ? (
                        <video src={vurl} controls className="w-full aspect-video bg-black object-contain" />
                      ) : (
                        <div className="w-full aspect-video bg-slate-200 flex items-center justify-center text-slate-400 text-xs">Önizleme yok</div>
                      )}
                      <div className="p-2.5 space-y-1">
                        <div className="text-xs font-bold text-slate-800 line-clamp-2">{v.topic || 'AI Video'}</div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-slate-400">{v.duration || ''} · {(v.createdAt || '').toString().slice(0, 10)}</span>
                          {vurl && (
                            <a href={vurl} download className="text-[10px] font-bold text-white bg-indigo-500 hover:bg-indigo-600 px-2 py-1 rounded-md">İndir</a>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* MAIN TWO-COLUMN STUDIO GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: TOPIC INPUT & WORKFLOW INFO (col-span-7) */}
        <div className="lg:col-span-7 space-y-6">
          {/* 💡 HİKAYE ÖRGÜSÜ / ÖNERİ ÜRETİCİ (5 EPAY) */}
          <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-fuchsia-50 border border-indigo-200/70 rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
                💡 {t("studio.story.title")}
                <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">5 EPAY</span>
              </h3>
              <button
                onClick={() => setShowStoryGen((v) => !v)}
                className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 px-2 py-1 rounded-lg hover:bg-indigo-100/60"
              >
                {showStoryGen ? 'Gizle' : '{t("studio.story.open")}'}
              </button>
            </div>
            {showStoryGen && (
              <>
                <p className="text-[11px] text-slate-500 -mt-1">
                  Fikrin yok mu? Tür + bölüm sayısı seç; yapay zeka ilk cümlede yakalayan, çok bölümlü, dönüşü ve finali olan bir hikaye kurgulasın. Sonra tek tıkla konu yap.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div className="col-span-2 sm:col-span-1 space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-400">Tür</label>
                    <select
                      value={storyGenre}
                      onChange={(e) => setStoryGenre(e.target.value)}
                      className="w-full px-2.5 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 focus:outline-none focus:border-indigo-400"
                    >
                      {['Korku', 'Gizem', 'Gerilim', 'Bilim Kurgu', 'Fantastik', 'Aşk', 'Macera', 'Gerçek Suç', 'Tarih', 'Belgesel', 'Motivasyon', 'Dram', 'Komedi'].map((g) => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-400">Bölüm</label>
                    <select
                      value={storyChapters}
                      onChange={(e) => setStoryChapters(parseInt(e.target.value, 10))}
                      className="w-full px-2.5 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 focus:outline-none focus:border-indigo-400"
                    >
                      {[1, 2, 3, 4, 5, 6, 8, 10, 12].map((n) => (<option key={n} value={n}>{n} bölüm</option>))}
                    </select>
                  </div>
                  <div className="col-span-2 space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-400">Fikir (opsiyonel)</label>
                    <input
                      value={storySeed}
                      onChange={(e) => setStorySeed(e.target.value)}
                      placeholder="Örn: terk edilmiş hastane / uzayda kaybolan ekip"
                      className="w-full px-2.5 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:border-indigo-400"
                    />
                  </div>
                </div>
                <button
                  onClick={handleGenerateStory}
                  disabled={storyLoading}
                  className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-95 text-white font-black text-xs rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {storyLoading ? '⏳ Hikaye kurgulanıyor...' : '✨ Hikaye Kurgula (5 EPAY)'}
                </button>

                {storyResult && (
                  <div className="bg-white border border-indigo-200 rounded-xl p-4 space-y-2.5">
                    <div className="text-sm font-black text-slate-800">{storyResult.title}</div>
                    {storyResult.logline && <div className="text-xs italic text-indigo-600">“{storyResult.logline}”</div>}
                    {storyResult.chapters?.length > 0 && (
                      <ol className="space-y-1.5">
                        {storyResult.chapters.map((ch, i) => (
                          <li key={i} className="text-[11px] text-slate-600">
                            <b className="text-slate-800">{ch.title}</b>{ch.summary ? ` — ${ch.summary}` : ''}
                          </li>
                        ))}
                      </ol>
                    )}
                    {storyResult.narration && (
                      <details className="text-[11px] text-slate-500">
                        <summary className="cursor-pointer font-bold text-slate-600">Anlatı metnini gör</summary>
                        <p className="mt-1 whitespace-pre-wrap leading-relaxed max-h-40 overflow-y-auto">{storyResult.narration}</p>
                      </details>
                    )}
                    <button
                      onClick={useStoryAsTopic}
                      className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs rounded-lg transition-all"
                    >
                      ⬇️ Bu Hikayeyi Konu Yap
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* TOPIC TEXTAREA CARD */}
          <div className="bg-white border-[0.5px] border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black text-slate-800 tracking-wider uppercase flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>İşlenecek Konu (Düzenlenebilir) <span className="text-rose-500">*</span></span>
              </label>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleClearText}
                  className="text-[11px] font-bold text-slate-500 hover:text-slate-800 transition-colors px-2 py-1 rounded-lg hover:bg-slate-100"
                >
                  {t("studio.topic.clear")}
                </button>
              </div>
            </div>

            <textarea
              rows={5}
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder={t("studio.topic.placeholder")}
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/10 transition-all leading-relaxed placeholder:text-slate-400"
            />

            {/* QUICK SAMPLE TOPICS */}
            <div className="space-y-2 pt-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Örnek Konularla Dene:
              </span>
              <div className="flex flex-wrap gap-2">
                {sampleTopics.map((sample, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleLoadSampleTopic(sample)}
                    className="text-[11px] font-semibold text-slate-600 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 px-3 py-1.5 rounded-lg border border-slate-200/60 transition-all text-left truncate max-w-xs"
                  >
                    {sample}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* WORKFLOW STEPS CARD */}
          <div className="bg-gradient-to-br from-slate-50 via-indigo-50/40 to-slate-50 border border-slate-200/80 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-indigo-700 font-black text-xs uppercase tracking-wider">
              <Rocket className="w-4 h-4 text-indigo-600" />
              <span>{t("studio.workflow.title")} {studioMode === "auto" ? t("studio.mode.auto") : t("studio.mode.manual")}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 space-y-1 shadow-2xs">
                <span className="font-black text-slate-900 block">{t("studio.workflow.step1_title")}</span>
                <p className="text-slate-600 font-medium">
                  {t("studio.workflow.step1_desc")}
                </p>
              </div>

              <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 space-y-1 shadow-2xs">
                <span className="font-black text-slate-900 block">{t("studio.workflow.step2_title")}</span>
                <p className="text-slate-600 font-medium">
                  {studioMode === 'auto'
                    ? '{t("studio.workflow.step2_auto")}'
                    : '{t("studio.workflow.step2_manual")}'}
                </p>
              </div>
            </div>
          </div>

          {/* PRIMARY ACTION BUTTON */}
          <button
            onClick={handleStartAutoMode}
            disabled={isGenerating || !topic.trim()}
            className="w-full py-4 px-6 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white font-black text-sm rounded-xl transition-all duration-200 shadow-sm disabled:opacity-50 flex items-center justify-center gap-2.5"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>{t("studio.btn.processing")}</span>
              </>
            ) : (
              <>
                <Rocket className="w-5 h-5 text-indigo-200" />
                <span>
                  {studioMode === 'auto'
                    ? `${t("studio.btn.start_auto")} (${estimatedCost} EPAY)`
                    : `${t("studio.btn.start_manual")} (${estimatedCost} EPAY)`}
                </span>
              </>
            )}
          </button>
        </div>

        {/* RIGHT COLUMN: PRODUCTION PARAMETERS (col-span-5) */}
        <div className="lg:col-span-5">
          <div className="bg-white border-[0.5px] border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-5 sticky top-6">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-slate-500" />
                {t("studio.params.title")}
              </span>
              <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-md">
                ≈ {estimatedCost} EPAY
              </span>
            </div>

            {/* VIDEO FORMAT (ASPECT RATIO) SELECT */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-black uppercase tracking-wider text-slate-700">
                {t("studio.params.format")}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {([
                  { v: '9:16', label: t('studio.format.vertical'), sub: 'Reels/Shorts' },
                  { v: '16:9', label: t('studio.format.horizontal'), sub: 'YouTube' },
                  { v: '1:1', label: t('studio.format.square'), sub: 'Post' },
                ] as const).map((f) => (
                  <button
                    key={f.v}
                    type="button"
                    onClick={() => setAspectRatio(f.v)}
                    className={`flex flex-col items-center gap-0.5 py-2 rounded-xl border text-center transition-all ${
                      aspectRatio === f.v
                        ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                        : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-xs font-black">{f.label}</span>
                    <span className="text-[9px] font-bold opacity-70">{f.v} · {f.sub}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* VIDEO DURATION SELECT */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-black uppercase tracking-wider text-slate-700">
                  {t("studio.params.duration")}
                </label>
                <span className="text-[10px] font-mono text-indigo-600 font-bold">
                  ~{Math.round(durationSec * 2.5)} {t("studio.params.words")}
                </span>
              </div>
              <select
                value={durationSec}
                onChange={(e) => setDurationSec(parseInt(e.target.value, 10))}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-600"
              >
                <option value={30}>30 saniye (Kısa / Shorts)</option>
                <option value={60}>1 dakika (Standart)</option>
                <option value={120}>2 dakika</option>
                <option value={180}>3 dakika</option>
                <option value={300}>5 dakika</option>
                <option value={600}>10 dakika</option>
                <option value={900}>15 dakika</option>
                <option value={1200}>20 dakika</option>
                <option value={1800}>30 dakika (Maksimum Belgesel)</option>
              </select>
            </div>

            {/* IMAGE COUNT SELECT */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-black uppercase tracking-wider text-slate-700">
                  {t("studio.params.slots")}
                </label>
                <span className="text-[10px] font-bold text-slate-500">
                  {t("studio.params.slots_minmax")}
                </span>
              </div>
              <select
                value={numImages}
                onChange={(e) => setNumImages(parseInt(e.target.value, 10))}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-600"
              >
                <option value={2}>2 görsel / slot (En Hızlı)</option>
                <option value={3}>3 görsel / slot</option>
                <option value={4}>4 görsel / slot</option>
                <option value={5}>5 görsel / slot (Varsayılan)</option>
                <option value={6}>6 görsel / slot</option>
                <option value={8}>8 görsel / slot</option>
                <option value={10}>10 görsel / slot</option>
                <option value={12}>12 görsel / slot</option>
                <option value={15}>15 görsel / slot (Önerilen)</option>
                <option value={18}>18 görsel / slot</option>
                <option value={20}>20 görsel / slot (Maksimum)</option>
              </select>
            </div>

            {/* LANGUAGE SELECT */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-black uppercase tracking-wider text-slate-700">
                {t("studio.params.lang")}
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-600"
              >
                <option value="French">French (Fransızca)</option>
                <option value="Turkish">Turkish (Türkçe)</option>
                <option value="English">English (İngilizce)</option>
                <option value="German">German (Almanca)</option>
                <option value="Spanish">Spanish (İspanyolca)</option>
                <option value="Italian">Italian (İtalyanca)</option>
              </select>
            </div>

            {/* VOICE TYPE SELECT */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-black uppercase tracking-wider text-slate-700">
                {t("studio.params.voice")}
              </label>
              <select
                value={voice}
                onChange={(e) => setVoice(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-600"
              >
                <option value="Standard A">Standard Nöral</option>
                <option value="Neural Male (Erkek)">Neural Male (Erkek Sesi)</option>
                <option value="Neural Female (Kadın)">Neural Female (Kadın Sesi)</option>
              </select>
            </div>

            {/* SPEED SLIDER */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-xs">
                <label className="font-black uppercase tracking-wider text-slate-700">
                  {t("studio.params.speed")}
                </label>
                <span className="font-mono font-bold text-indigo-600">
                  {speed > 0 ? `+${speed.toFixed(2)}` : speed.toFixed(2)}
                </span>
              </div>
              <input
                type="range"
                min="-1.0"
                max="1.0"
                step="0.05"
                value={speed}
                onChange={(e) => setSpeed(parseFloat(e.target.value))}
                className="w-full accent-indigo-600 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* PITCH SLIDER */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label className="font-black uppercase tracking-wider text-slate-700">
                  {t("studio.params.pitch")}
                </label>
                <span className="font-mono font-bold text-indigo-600">
                  {pitch > 0 ? `+${pitch.toFixed(2)}` : pitch.toFixed(2)}
                </span>
              </div>
              <input
                type="range"
                min="-1.0"
                max="1.0"
                step="0.05"
                value={pitch}
                onChange={(e) => setPitch(parseFloat(e.target.value))}
                className="w-full accent-indigo-600 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* CHANNEL NAME INPUT */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              <label className="text-[11px] font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Tv className="w-3.5 h-3.5 text-slate-500" />
                <span>{t("studio.params.channel")} <span className="text-rose-500">*</span></span>
              </label>
              <input
                type="text"
                value={channelName}
                onChange={(e) => setChannelName(e.target.value)}
                placeholder="Örn: Destins Animaux"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-600"
              />
            </div>

            {/* COVER TEXT INPUT */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Type className="w-3.5 h-3.5 text-slate-500" />
                <span>{t("studio.params.cover")} <span className="text-rose-500">*</span></span>
              </label>
              <input
                type="text"
                value={coverText}
                onChange={(e) => setCoverText(e.target.value)}
                placeholder="Örn: PERSONNE NE CONNAISSAIT SON SECRET !"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-600"
              />
            </div>
          </div>
        </div>
      </div>

      {/* MANUEL MODDA SLOT EKRANI VEYA ÜRETİLMİŞ RESİMLER GRID'İ */}
      {(studioMode === 'manual' || images.length > 0) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border-[0.5px] border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6"
        >
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 flex-wrap gap-3">
            <div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">
                {images.length > 0
                  ? 'Görsel Onaylama ve Düzenleme Ekranı'
                  : `Görsel Slot Ekranı (${numImages} Adet Görsel Slotu)`}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {images.length > 0
                  ? 'Kapak yapmak istediğiniz görseli seçin, görseli değiştirin veya istemediğiniz fotoğrafları silin.'
                  : 'Aşağıdaki slotlardan görselleri kendiniz seçebilir veya boş bırakarak AI otomatik üretimine devredebilirsiniz.'}
              </p>
            </div>

            {images.length > 0 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleRetryMissingImages}
                  disabled={isGenerating}
                  className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl transition-all shadow-xs flex items-center gap-1.5 active:scale-[0.98] disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
                  <span>Oluşmayan Görselleri Tekrar Tetikle</span>
                </button>

                <div className="px-3.5 py-1.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-700">
                  {images.filter((i) => !i.isDeleted).length} / {images.length} Görsel Onaylı
                </div>
              </div>
            )}
          </div>

          {/* KURGU ÖNİZLEME (ADOBE-TARZI OYNATICI + ZAMAN ÇİZELGESİ) */}
          {images.length > 0 && (
            <>
            {stateId && images.length > 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-2 shadow-sm">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <h4 className="text-sm font-black text-slate-800 flex items-center gap-1.5">📝 Senaryo (Anlatı Metni)</h4>
                  <button
                    onClick={handleRegenerateVoice}
                    disabled={regeneratingVoice || !scriptText.trim()}
                    className="text-[11px] font-black text-white bg-gradient-to-r from-indigo-600 to-sky-500 hover:opacity-95 px-3 py-2 rounded-lg transition-all disabled:opacity-50 inline-flex items-center gap-1.5"
                  >
                    {regeneratingVoice ? '⏳ Ses oluşturuluyor...' : '🔊 Sesi Yeniden Oluştur'}
                  </button>
                </div>
                <textarea
                  value={scriptText}
                  onChange={(e) => setScriptText(e.target.value)}
                  rows={6}
                  placeholder="Anlatı metni burada görünür; düzenleyip 'Sesi Yeniden Oluştur' diyebilirsin."
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-indigo-400 resize-y leading-relaxed"
                />
                <p className="text-[11px] text-slate-400">
                  Metni düzenle → <b>Sesi Yeniden Oluştur</b> → önizleme oynatıcıda yeni seslendirmeyi dinle. Beğenince HD Render.
                </p>
              </div>
            )}

            <VideoEditorPreview
              images={images}
              audioUrl={stateId ? `/api/seo/temp_images/${stateId}/voiceover.mp3?v=${audioVersion}` : ''}
              coverIndex={coverIndex}
              weights={sceneWeights}
              onMove={handleMoveImage}
              onReorder={handleReorderTo}
              onSetWeight={handleSetWeight}
              onDelete={handleToggleDeleteImage}
              onSetCover={handleSelectCover}
              onAddPhoto={handleAddPhoto}
              isBusy={isReplacingImage}
              musicUrl={musicUrl}
              musicVolume={musicVolume}
              musicTracks={musicTracks}
              onMusicUrlChange={setMusicUrl}
              onMusicVolumeChange={setMusicVolume}
              subtitlesOn={subtitlesOn}
              captionPosition={captionPosition}
              onSubtitlesToggle={setSubtitlesOn}
              onCaptionPositionChange={setCaptionPosition}
              onUploadMusic={handleUploadMusic}
              musicUploading={musicUploading}
            />

            {/* 🖼️ THUMBNAIL (KAPAK) STİL ÜRETİCİ */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3 shadow-sm">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <h4 className="text-sm font-black text-slate-800 flex items-center gap-1.5">🖼️ Thumbnail (Kapak) Stili</h4>
                <button
                  onClick={handleGenerateThumbnail}
                  disabled={thumbLoading}
                  className="text-[11px] font-black text-white bg-gradient-to-r from-rose-500 to-orange-500 hover:opacity-95 px-3 py-2 rounded-lg transition-all disabled:opacity-50"
                >
                  {thumbLoading ? '⏳ Oluşturuluyor...' : '✨ Thumbnail Oluştur'}
                </button>
              </div>
              <p className="text-[11px] text-slate-400 -mt-1">Seçili kapak sahnesinden, aşağıdaki tarza göre özel bir YouTube thumbnail üretir. Başlığı boş bırakırsan kapak yazısı/konu kullanılır.</p>
              <input
                value={thumbTitle}
                onChange={(e) => setThumbTitle(e.target.value)}
                placeholder="Thumbnail başlığı (opsiyonel)"
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-rose-400"
              />
              <div className="flex items-center gap-1.5 flex-wrap">
                {[
                  { id: 'mrbeast', label: 'MrBeast' }, { id: 'gaming', label: 'Gaming' },
                  { id: 'reaksiyon', label: 'Reaksiyon' }, { id: 'sinematik', label: 'Sinematik' },
                  { id: 'haber', label: 'Haber' }, { id: 'gercek_suc', label: 'Gerçek Suç' },
                  { id: 'teknoloji', label: 'Teknoloji' }, { id: 'vlog', label: 'Vlog' },
                  { id: 'belgesel', label: 'Belgesel' }, { id: 'spor', label: 'Spor' },
                  { id: 'egitim', label: 'Eğitim' },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setThumbStyle(s.id)}
                    className={`text-[11px] font-bold px-3 py-1.5 rounded-lg border transition-all ${thumbStyle === s.id ? 'bg-rose-500 text-white border-rose-500' : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-rose-300'}`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
              {thumbUrl && (
                <div className="space-y-2 pt-1">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={thumbUrl} alt="Thumbnail" className="w-full rounded-xl border border-slate-200 aspect-video object-cover" />
                  <a href={thumbUrl} download="thumbnail.jpg" className="inline-block text-[11px] font-bold text-white bg-slate-800 hover:bg-slate-900 px-3 py-1.5 rounded-lg">⬇️ Thumbnail'i İndir</a>
                </div>
              )}
            </div>
            </>
          )}

          {/* GRID OF IMAGES OR MANUALLY SELECTED SLOTS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {images.length > 0
              ? images.map((img, idx) => {
                  const isCover = coverIndex === idx;
                  return (
                    <ImageCardItem
                      key={img.id}
                      img={img}
                      idx={idx}
                      isCover={isCover}
                      handleSelectCover={handleSelectCover}
                      handleToggleDeleteImage={handleToggleDeleteImage}
                      onOpenCategoryModal={(selectedIdx) => setCategoryModalSceneIdx(selectedIdx)}
                    />
                  );
                })
              : Array.from({ length: numImages }).map((_, slotIdx) => {
                  const hasSelectedUrl = !!manualSlotUrls[slotIdx];
                  return (
                    <div
                      key={slotIdx}
                      className="bg-slate-50 border border-slate-200 border-dashed rounded-2xl p-4 flex flex-col items-center justify-center min-h-[160px] space-y-3 hover:bg-slate-100/80 transition-all group"
                    >
                      <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
                        Görsel Slot #{slotIdx + 1}
                      </span>

                      {hasSelectedUrl ? (
                        <div className="w-full aspect-video rounded-xl overflow-hidden relative border border-slate-200">
                          <img
                            src={manualSlotUrls[slotIdx]}
                            alt={`Slot #${slotIdx + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            onClick={() => setCategoryModalSceneIdx(slotIdx)}
                            className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1"
                          >
                            <ImageIcon className="w-4 h-4" />
                            Değiştir
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setCategoryModalSceneIdx(slotIdx)}
                          className="px-4 py-2.5 bg-white border border-slate-200 hover:border-indigo-500 hover:text-indigo-600 rounded-xl text-xs font-bold text-slate-700 transition-all flex items-center gap-1.5 shadow-2xs"
                        >
                          <Plus className="w-4 h-4 text-indigo-600" />
                          <span>+ Kütüphaneden Görsel Seç</span>
                        </button>
                      )}

                      <span className="text-[10px] text-slate-400 font-medium">
                        {hasSelectedUrl ? 'Görsel Seçildi' : '(Boş kalırsa AI otomatik üretir)'}
                      </span>
                    </div>
                  );
                })}
          </div>

          {/* BOTTOM FINAL RENDER CONFIRMATION BUTTON */}
          {images.length > 0 && (
            <div className="pt-4 border-t border-slate-100">
              <button
                onClick={handleConfirmAndRenderVideo}
                disabled={isGenerating}
                className="w-full py-4 px-6 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-black text-sm rounded-xl transition-all duration-200 shadow-sm disabled:opacity-50 flex items-center justify-center gap-2.5"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Final Video Render Ediliyor...</span>
                  </>
                ) : (
                  <>
                    <Video className="w-5 h-5 text-emerald-200" />
                    <span>ONAYLA VE VİDEOYU YAP (HD RENDER)</span>
                  </>
                )}
              </button>
            </div>
          )}
        </motion.div>
      )}

      {/* CATEGORY & COMMUNITY IMAGE SELECTION MODAL */}
      <AnimatePresence>
        {categoryModalSceneIdx !== null && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white border border-slate-200 rounded-2xl max-w-3xl w-full max-h-[85vh] overflow-hidden flex flex-col shadow-2xl"
            >
              {/* MODAL HEADER */}
              <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-indigo-100 rounded-xl text-indigo-600">
                    <ImageIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 text-sm tracking-tight">
                      Görsel Slot #{categoryModalSceneIdx + 1} İçin Fotoğraf Seç
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      Topluluk görsellerinden, stok kategorilerden seçin veya özel AI üretimi yapın.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setCategoryModalSceneIdx(null)}
                  className="p-2 hover:bg-slate-200 rounded-xl text-slate-500 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* MODAL BODY */}
              <div className="p-6 overflow-y-auto space-y-6 flex-1">
                {/* SEARCH & REGENERATE BAR */}
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <Search className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Özel Konu ile Görseli Üret (AI)</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customSearchTerm}
                      onChange={(e) => setCustomSearchTerm(e.target.value)}
                      placeholder="Örn: Dağ kenarında yalnız bir kurt, 8k sinematik..."
                      className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-600"
                    />
                    <button
                      onClick={() =>
                        handleAssignSceneImage(categoryModalSceneIdx, '', customSearchTerm)
                      }
                      disabled={isReplacingImage}
                      className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-2 shrink-0 disabled:opacity-50"
                    >
                      {isReplacingImage ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <Sparkles className="w-4 h-4" />
                      )}
                      <span>Görseli Üret</span>
                    </button>
                  </div>
                </div>

                {/* IMAGE URL INPUT */}
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <LinkIcon className="w-3.5 h-3.5 text-slate-500" />
                    <span>Özel Görsel Bağlantısı (URL) Yapıştır</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customUrlInput}
                      onChange={(e) => setCustomUrlInput(e.target.value)}
                      placeholder="https://images.unsplash.com/...jpg"
                      className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-600"
                    />
                    <button
                      onClick={() =>
                        handleAssignSceneImage(categoryModalSceneIdx, customUrlInput)
                      }
                      disabled={isReplacingImage || !customUrlInput.trim()}
                      className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all shrink-0 disabled:opacity-50"
                    >
                      Resmi Kullan
                    </button>
                  </div>
                </div>

                {/* CATEGORY & COMMUNITY TABS */}
                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-700 block">
                    Galeriden Seçin:
                  </span>
                  <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                    <button
                      onClick={() => setActiveCategoryTab('community')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                        activeCategoryTab === 'community'
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <Users className="w-3.5 h-3.5" />
                      <span>🔥 Topluluk AI Galerisi ({communityImages.length})</span>
                    </button>

                    {CATEGORY_STOCK_LIBRARY.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setActiveCategoryTab(cat.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                          activeCategoryTab === cat.id
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        <span>{cat.icon}</span>
                        <span>{cat.name}</span>
                      </button>
                    ))}
                  </div>

                  {/* IMAGES DISPLAY GRID */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                    {activeCategoryTab === 'community' ? (
                      communityImages.length > 0 ? (
                        communityImages.map((cImg, cIdx) => (
                          <button
                            key={cIdx}
                            onClick={() =>
                              handleAssignSceneImage(categoryModalSceneIdx, cImg.url)
                            }
                            disabled={isReplacingImage}
                            className="group relative aspect-video rounded-xl overflow-hidden border border-slate-200 hover:border-indigo-600 transition-all text-left focus:outline-none"
                          >
                            <img
                              src={cImg.url}
                              alt={cImg.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent p-2 flex items-end">
                              <span className="text-[10px] font-bold text-white leading-tight truncate drop-shadow-xs">
                                {cImg.title}
                              </span>
                            </div>
                          </button>
                        ))
                      ) : (
                        <div className="col-span-3 py-8 text-center text-xs text-slate-400 font-bold">
                          Henüz topluluk görseli yüklenmedi.
                        </div>
                      )
                    ) : (
                      CATEGORY_STOCK_LIBRARY.find((c) => c.id === activeCategoryTab)?.images.map(
                        (stock, sIdx) => (
                          <button
                            key={sIdx}
                            onClick={() =>
                              handleAssignSceneImage(categoryModalSceneIdx, stock.url)
                            }
                            disabled={isReplacingImage}
                            className="group relative aspect-video rounded-xl overflow-hidden border border-slate-200 hover:border-indigo-600 transition-all text-left focus:outline-none"
                          >
                            <img
                              src={stock.url}
                              alt={stock.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent p-2 flex items-end">
                              <span className="text-[10px] font-bold text-white leading-tight drop-shadow-xs">
                                {stock.title}
                              </span>
                            </div>
                          </button>
                        )
                      )
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FINAL RENDERED VIDEO DISPLAY */}
      {renderedVideoUrl && (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white border-[0.5px] border-emerald-200 rounded-2xl p-6 sm:p-8 shadow-md space-y-6"
        >
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              <div>
                <h3 className="text-lg font-black text-slate-900 tracking-tight">
                  Videonuz Hazır!
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Seslendirme, görseller ve efektler başarıyla birleştirildi.
                </p>
              </div>
            </div>

            <a
              href={renderedVideoUrl}
              download
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Videoyu İndir (MP4)</span>
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* VIDEO PLAYER */}
            <div className="md:col-span-7 bg-slate-950 rounded-2xl overflow-hidden shadow-sm aspect-video flex items-center justify-center">
              <video
                src={renderedVideoUrl}
                controls
                className="w-full h-full object-contain"
              />
            </div>

            {/* THUMBNAIL PREVIEW */}
            <div className="md:col-span-5 space-y-3">
              <span className="text-xs font-black uppercase text-slate-400 tracking-wider block">
                Oluşturulan Kapak Görseli (Thumbnail)
              </span>
              {renderedCoverUrl && (
                <div className="rounded-xl overflow-hidden border border-slate-200 aspect-video relative group">
                  <img
                    src={renderedCoverUrl}
                    alt="Kapak Görseli"
                    className="w-full h-full object-cover"
                  />
                  <a
                    href={renderedCoverUrl}
                    download
                    className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white text-xs font-bold"
                  >
                    <Download className="w-4 h-4" />
                    <span>Kapagi İndir</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
