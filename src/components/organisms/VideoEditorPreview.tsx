"use client";

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Play, Pause, Trash2, Star, Film, Clock, Plus, GripVertical, Loader2, Music, Captions } from 'lucide-react';

export interface EditorImg {
  id: number;
  url: string;
  isDeleted?: boolean;
}

export interface MusicTrack {
  name: string;
  url: string;
}

interface Props {
  images: EditorImg[];
  audioUrl: string;
  coverIndex: number;
  weights: { [id: number]: number };
  onMove?: (imgId: number, dir: -1 | 1) => void;
  onReorder: (fromId: number, toId: number) => void;
  onSetWeight: (imgId: number, weight: number) => void;
  onDelete: (imgId: number) => void;
  onSetCover: (fullIdx: number) => void;
  onAddPhoto: () => void;
  isBusy?: boolean;
  // Arka plan müziği
  musicUrl: string;
  musicVolume: number;
  musicTracks: MusicTrack[];
  onMusicUrlChange: (u: string) => void;
  onMusicVolumeChange: (v: number) => void;
  // Altyazı
  subtitlesOn: boolean;
  captionPosition: 'bottom' | 'top';
  onSubtitlesToggle: (v: boolean) => void;
  onCaptionPositionChange: (p: 'bottom' | 'top') => void;
  onUploadMusic: (file: File) => void;
  musicUploading?: boolean;
}

const fmt = (s: number) => {
  if (!isFinite(s) || s < 0) s = 0;
  const m = Math.floor(s / 60);
  const ss = Math.floor(s % 60);
  return `${m}:${ss.toString().padStart(2, '0')}`;
};

export function VideoEditorPreview({
  images, audioUrl, coverIndex, weights,
  onMove: _onMove, onReorder, onSetWeight, onDelete, onSetCover, onAddPhoto, isBusy,
  musicUrl, musicVolume, musicTracks, onMusicUrlChange, onMusicVolumeChange,
  subtitlesOn, captionPosition, onSubtitlesToggle, onCaptionPositionChange,
  onUploadMusic, musicUploading,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const musicRef = useRef<HTMLAudioElement | null>(null);
  const musicPreviewRef = useRef<HTMLAudioElement | null>(null);
  const [musicPreviewing, setMusicPreviewing] = useState(false);
  const stripRef = useRef<HTMLDivElement | null>(null);
  const [duration, setDuration] = useState(0);
  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const [dragId, setDragId] = useState<number | null>(null);
  const [overId, setOverId] = useState<number | null>(null);
  const [peaks, setPeaks] = useState<number[]>([]);
  const [customMusic, setCustomMusic] = useState('');
  const [musicWarn, setMusicWarn] = useState('');

  const active = useMemo(
    () => images.map((img, idx) => ({ ...img, fullIdx: idx })).filter((i) => !i.isDeleted),
    [images]
  );
  const n = active.length;
  const w = (id: number) => Math.max(0.3, weights[id] ?? 1);
  const sumW = active.reduce((acc, im) => acc + w(im.id), 0) || 1;

  const bounds = useMemo(() => {
    const b: { start: number; end: number }[] = [];
    let acc = 0;
    for (const im of active) {
      const start = (acc / sumW) * duration;
      acc += w(im.id);
      b.push({ start, end: (acc / sumW) * duration });
    }
    return b;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, sumW, duration, weights]);

  const playIdx = (() => {
    if (duration <= 0) return 0;
    const i = bounds.findIndex((bb) => current >= bb.start && current < bb.end);
    return i < 0 ? Math.max(0, n - 1) : i;
  })();

  // Ana seslendirme olayları
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const onMeta = () => setDuration(a.duration || 0);
    const onTime = () => setCurrent(a.currentTime || 0);
    const onEnd = () => {
      setPlaying(false); setCurrent(0); a.currentTime = 0;
      if (musicRef.current) { musicRef.current.pause(); musicRef.current.currentTime = 0; }
    };
    const onErr = () => setAudioError(true);
    a.addEventListener('loadedmetadata', onMeta);
    a.addEventListener('timeupdate', onTime);
    a.addEventListener('ended', onEnd);
    a.addEventListener('error', onErr);
    return () => {
      a.removeEventListener('loadedmetadata', onMeta);
      a.removeEventListener('timeupdate', onTime);
      a.removeEventListener('ended', onEnd);
      a.removeEventListener('error', onErr);
    };
  }, [audioUrl]);

  // Dalga formu (Web Audio API ile çözümle → tepe noktaları)
  useEffect(() => {
    if (!audioUrl) return;
    let cancelled = false;
    (async () => {
      try {
        const resp = await fetch(audioUrl);
        const buf = await resp.arrayBuffer();
        const Ctx = (window as any).AudioContext || (window as any).webkitAudioContext;
        if (!Ctx) return;
        const ctx = new Ctx();
        const audioBuf: AudioBuffer = await ctx.decodeAudioData(buf);
        const ch = audioBuf.getChannelData(0);
        const N = 180;
        const block = Math.max(1, Math.floor(ch.length / N));
        const p: number[] = [];
        for (let i = 0; i < N; i++) {
          let max = 0;
          for (let j = 0; j < block; j++) {
            const v = Math.abs(ch[i * block + j] || 0);
            if (v > max) max = v;
          }
          p.push(max);
        }
        const peak = Math.max(...p, 0.01);
        if (!cancelled) setPeaks(p.map((v) => v / peak));
        ctx.close();
      } catch { /* dalga formu opsiyonel */ }
    })();
    return () => { cancelled = true; };
  }, [audioUrl]);

  // Müzik: src + volume + oynatma senkronu
  useEffect(() => {
    const v = Math.max(0, Math.min(1, musicVolume));
    if (musicRef.current) musicRef.current.volume = v;
    if (musicPreviewRef.current) musicPreviewRef.current.volume = v;
  }, [musicVolume, musicUrl]);

  // Müzik değişince auditionı durdur
  useEffect(() => { setMusicPreviewing(false); musicPreviewRef.current?.pause(); }, [musicUrl]);

  // Sadece müziği dinle (ana önizlemeden bağımsız)
  const toggleMusicPreview = () => {
    const mp = musicPreviewRef.current;
    if (!mp || !musicUrl) return;
    if (musicPreviewing) { mp.pause(); setMusicPreviewing(false); return; }
    // ana önizleme sesini durdur ki üst üste binmesin
    audioRef.current?.pause(); musicRef.current?.pause(); setPlaying(false);
    mp.currentTime = 0;
    mp.play().then(() => setMusicPreviewing(true)).catch(() => {});
  };

  useEffect(() => {
    const m = musicRef.current;
    if (!m) return;
    if (playing && musicUrl) { m.play().catch(() => {}); }
    else { m.pause(); }
  }, [playing, musicUrl]);

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) {
      a.pause(); setPlaying(false);
      musicRef.current?.pause();
    } else {
      // audition çalıyorsa durdur
      musicPreviewRef.current?.pause(); setMusicPreviewing(false);
      a.play().catch(() => setAudioError(true)); setPlaying(true);
      if (musicUrl) musicRef.current?.play().catch(() => {});
    }
  };

  const seekTo = (t: number) => {
    const a = audioRef.current;
    const clamped = Math.max(0, Math.min(duration || 0, t));
    setCurrent(clamped);
    if (a && duration > 0) a.currentTime = clamped;
  };
  const onBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (duration <= 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    seekTo(((e.clientX - rect.left) / rect.width) * duration);
  };

  // Kenardan sürükleyerek süre ayarlama
  const resizeState = useRef<{ id: number; startX: number; startW: number; stripW: number; sumW: number } | null>(null);
  const onResizeDown = (e: React.PointerEvent, id: number) => {
    e.preventDefault(); e.stopPropagation();
    const stripW = stripRef.current?.getBoundingClientRect().width || 600;
    resizeState.current = { id, startX: e.clientX, startW: w(id), stripW, sumW };
    window.addEventListener('pointermove', onResizeMove);
    window.addEventListener('pointerup', onResizeUp);
  };
  const onResizeMove = (e: PointerEvent) => {
    const rs = resizeState.current;
    if (!rs) return;
    const dx = e.clientX - rs.startX;
    onSetWeight(rs.id, Math.max(0.3, rs.startW + (dx / rs.stripW) * rs.sumW));
  };
  const onResizeUp = () => {
    resizeState.current = null;
    window.removeEventListener('pointermove', onResizeMove);
    window.removeEventListener('pointerup', onResizeUp);
  };

  const applyCustomMusic = () => {
    const u = customMusic.trim();
    if (!u.startsWith('http')) { setMusicWarn('Geçerli bir http(s) linki girin.'); return; }
    // Sayfa linki değil, DOĞRUDAN ses dosyası linki olmalı
    const path = u.split('?')[0].toLowerCase();
    if (!/\.(mp3|m4a|wav|ogg)$/.test(path)) {
      setMusicWarn('⚠️ Bu bir sayfa linki gibi görünüyor. Doğrudan .mp3 dosya linki gerekli — ya da aşağıdaki "Yükle" ile dosyayı bilgisayarından ekle.');
      return;
    }
    setMusicWarn('');
    onMusicUrlChange(u);
  };

  const onPickFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) { setMusicWarn(''); onUploadMusic(f); }
    e.target.value = '';
  };

  if (n === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-slate-900 p-5 text-center">
        <button onClick={onAddPhoto} className="text-sm font-bold text-indigo-300 hover:text-indigo-200 inline-flex items-center gap-1.5">
          <Plus className="w-4 h-4" /> Foto Ekle
        </button>
      </div>
    );
  }

  const shown = active[playIdx] || active[0];
  const progressPct = duration > 0 ? (current / duration) * 100 : 0;

  return (
    <div className="rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-900 to-slate-800 p-4 sm:p-5 space-y-4">
      {audioUrl && <audio ref={audioRef} src={audioUrl} preload="metadata" />}
      {musicUrl && <audio ref={musicRef} src={musicUrl} preload="none" loop />}
      {musicUrl && <audio ref={musicPreviewRef} src={musicUrl} preload="none" loop onEnded={() => setMusicPreviewing(false)} />}

      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2 text-white">
          <Film className="w-4 h-4 text-indigo-300" />
          <span className="text-sm font-black">Kurgu Editörü</span>
          <span className="text-[11px] text-slate-400 font-medium">{n} sahne · {duration > 0 ? fmt(duration) : '—'} toplam</span>
        </div>
        {audioError && (
          <span className="text-[11px] font-bold text-amber-300 bg-amber-500/10 border border-amber-500/30 rounded-lg px-2 py-1">
            ⚠️ Seslendirme yüklenemedi — önizleme sessiz, render sesli olur.
          </span>
        )}
      </div>

      {/* SAHNE (BÜYÜK ÖNİZLEME) */}
      <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black border border-white/10 group">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={shown.url} alt={`Sahne ${playIdx + 1}`} className="w-full h-full object-contain" />
        <div className="absolute top-2 left-2 bg-black/60 text-white text-[11px] font-black px-2 py-1 rounded-md">Sahne {playIdx + 1}/{n}</div>
        <button onClick={toggle} className="absolute inset-0 flex items-center justify-center" aria-label={playing ? 'Duraklat' : 'Oynat'}>
          <span className={`w-16 h-16 rounded-full bg-white/90 text-slate-900 flex items-center justify-center shadow-xl transition-all ${playing ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}>
            {playing ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 ml-1" />}
          </span>
        </button>
      </div>

      {/* TRANSPORT + DALGA FORMU */}
      <div className="flex items-center gap-3">
        <button onClick={toggle} className="shrink-0 w-9 h-9 rounded-full bg-indigo-500 hover:bg-indigo-400 text-white flex items-center justify-center transition-all">
          {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
        </button>
        <span className="text-[11px] font-mono text-slate-300 shrink-0 w-10 text-right">{fmt(current)}</span>
        {peaks.length > 0 ? (
          <div onClick={onBarClick} className="relative flex-1 h-10 flex items-center gap-px cursor-pointer">
            {peaks.map((v, i) => {
              const played = duration > 0 && i / peaks.length <= current / duration;
              return <div key={i} style={{ height: `${Math.max(10, v * 100)}%` }} className={`flex-1 rounded-sm ${played ? 'bg-indigo-400' : 'bg-white/20'}`} />;
            })}
            {bounds.map((bb, i) => i === 0 ? null : (
              <div key={`b${i}`} className="absolute top-0 h-full w-px bg-amber-300/50" style={{ left: `${duration > 0 ? (bb.start / duration) * 100 : 0}%` }} />
            ))}
          </div>
        ) : (
          <div onClick={onBarClick} className="relative flex-1 h-2.5 bg-white/15 rounded-full cursor-pointer">
            <div className="absolute left-0 top-0 h-full bg-indigo-400 rounded-full" style={{ width: `${progressPct}%` }} />
          </div>
        )}
        <span className="text-[11px] font-mono text-slate-300 shrink-0 w-10">{fmt(duration)}</span>
      </div>

      {/* ARKA PLAN MÜZİĞİ */}
      <div className="rounded-xl bg-white/5 border border-white/10 p-3 space-y-2">
        <div className="flex items-center gap-2 flex-wrap">
          <Music className="w-4 h-4 text-emerald-300" />
          <span className="text-xs font-bold text-white">Arka Plan Müziği</span>
          <select
            value={musicTracks.some((t) => t.url === musicUrl) ? musicUrl : (musicUrl ? '__custom__' : '')}
            onChange={(e) => { if (e.target.value !== '__custom__') onMusicUrlChange(e.target.value); }}
            className="text-xs bg-slate-800 text-slate-100 border border-white/15 rounded-lg px-2 py-1.5 focus:outline-none"
          >
            <option value="">🔇 Müzik yok</option>
            {musicTracks.map((t) => (<option key={t.url} value={t.url}>🎵 {t.name}</option>))}
            {musicUrl && !musicTracks.some((t) => t.url === musicUrl) && <option value="__custom__">🎵 Özel URL</option>}
          </select>
          {musicUrl && (
            <div className="flex items-center gap-1.5">
              <button
                onClick={toggleMusicPreview}
                className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1.5 rounded-lg transition-all ${musicPreviewing ? 'bg-emerald-500 text-white' : 'bg-white/10 text-emerald-300 hover:bg-white/20'}`}
                title="Sadece müziği dinle"
              >
                {musicPreviewing ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
                {musicPreviewing ? 'Durdur' : 'Dinle'}
              </button>
              <span className="text-[10px] text-slate-400">Ses</span>
              <input
                type="range" min={0} max={60} value={Math.round(musicVolume * 100)}
                onChange={(e) => onMusicVolumeChange(parseInt(e.target.value, 10) / 100)}
                className="w-24 accent-emerald-400"
              />
              <span className="text-[10px] font-mono text-slate-300 w-7">{Math.round(musicVolume * 100)}%</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <input
            value={customMusic}
            onChange={(e) => setCustomMusic(e.target.value)}
            placeholder="doğrudan .mp3 linki (sayfa linki değil)"
            className="flex-1 text-[11px] bg-slate-800 text-slate-100 border border-white/15 rounded-lg px-2 py-1.5 focus:outline-none"
          />
          <button onClick={applyCustomMusic} className="text-[11px] font-bold text-emerald-300 hover:text-emerald-200 px-2 py-1.5">Ekle</button>
          <span className="text-white/20">|</span>
          <input ref={fileInputRef} type="file" accept="audio/mpeg,audio/mp4,audio/wav,audio/ogg,.mp3,.m4a,.wav,.ogg" onChange={onPickFile} className="hidden" />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={musicUploading}
            className="text-[11px] font-bold text-sky-300 hover:text-sky-200 px-2 py-1.5 inline-flex items-center gap-1 disabled:opacity-50"
          >
            {musicUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />} Yükle
          </button>
        </div>
        {musicWarn && <div className="text-[10px] font-bold text-amber-300">{musicWarn}</div>}
        {/* Telifsiz müzik kaynakları */}
        <div className="text-[10px] text-slate-400 leading-relaxed">
          🎧 <b className="text-slate-300">Telifsiz müzik</b> (ticari kullanım serbest, atıf gerekmez):{' '}
          <a href="https://pixabay.com/music/" target="_blank" rel="noopener noreferrer" className="text-emerald-300 hover:text-emerald-200 underline">Pixabay Music</a>
          {' · '}
          <a href="https://mixkit.co/free-stock-music/" target="_blank" rel="noopener noreferrer" className="text-emerald-300 hover:text-emerald-200 underline">Mixkit</a>
          {' · '}
          <a href="https://studio.youtube.com/channel/UC/music" target="_blank" rel="noopener noreferrer" className="text-emerald-300 hover:text-emerald-200 underline">YouTube Ses Kitaplığı</a>
          {' · '}
          <a href="https://uppbeat.io/browse/music" target="_blank" rel="noopener noreferrer" className="text-emerald-300 hover:text-emerald-200 underline">Uppbeat</a>
          <br />
          <b className="text-sky-300">En kolay yol:</b> siteden <b className="text-slate-300">.mp3</b>&apos;i bilgisayarına indir → yukarıdaki <b className="text-sky-300">Yükle</b> ile ekle. (Sayfa linkini yapıştırmak çalışmaz; doğrudan dosya linki gerekir.)
        </div>
      </div>

      {/* ALTYAZI (anlatıdan otomatik zamanlı) */}
      <div className="rounded-xl bg-white/5 border border-white/10 p-3 flex items-center gap-3 flex-wrap">
        <Captions className="w-4 h-4 text-sky-300" />
        <span className="text-xs font-bold text-white">Altyazı</span>
        <button
          onClick={() => onSubtitlesToggle(!subtitlesOn)}
          className={`text-[11px] font-black px-3 py-1.5 rounded-lg transition-all ${subtitlesOn ? 'bg-sky-500 text-white' : 'bg-white/10 text-slate-300 hover:bg-white/20'}`}
        >
          {subtitlesOn ? '✓ Açık' : 'Kapalı'}
        </button>
        {subtitlesOn && (
          <>
            <span className="text-[10px] text-slate-400">Konum</span>
            <div className="flex rounded-lg overflow-hidden border border-white/15">
              <button onClick={() => onCaptionPositionChange('bottom')} className={`text-[11px] font-bold px-2.5 py-1.5 ${captionPosition === 'bottom' ? 'bg-sky-500 text-white' : 'bg-slate-800 text-slate-300'}`}>Alt</button>
              <button onClick={() => onCaptionPositionChange('top')} className={`text-[11px] font-bold px-2.5 py-1.5 ${captionPosition === 'top' ? 'bg-sky-500 text-white' : 'bg-slate-800 text-slate-300'}`}>Üst</button>
            </div>
            <span className="text-[10px] text-slate-400">Anlatı metni otomatik zamanlanıp videoya gömülür.</span>
          </>
        )}
      </div>

      {/* ZAMAN ÇİZELGESİ ŞERİDİ */}
      <div ref={stripRef} className="flex items-stretch gap-1 overflow-x-auto pb-1 min-h-[92px]">
        {active.map((img, i) => {
          const isCoverBlock = img.fullIdx === coverIndex;
          const isCurrent = i === playIdx;
          const widthPct = (w(img.id) / sumW) * 100;
          const sceneDur = duration > 0 ? (w(img.id) / sumW) * duration : 0;
          const isOver = overId === img.id && dragId !== img.id;
          return (
            <div
              key={img.id}
              draggable
              onDragStart={() => setDragId(img.id)}
              onDragEnd={() => { setDragId(null); setOverId(null); }}
              onDragOver={(e) => { e.preventDefault(); setOverId(img.id); }}
              onDrop={(e) => { e.preventDefault(); if (dragId !== null) onReorder(dragId, img.id); setDragId(null); setOverId(null); }}
              style={{ width: `${widthPct}%`, minWidth: 74 }}
              className={`relative shrink-0 rounded-lg overflow-hidden border-2 transition-all ${isCurrent ? 'border-indigo-400' : isOver ? 'border-amber-400' : 'border-white/10'} ${dragId === img.id ? 'opacity-40' : ''}`}
            >
              <button onClick={() => seekTo(bounds[i]?.start ?? 0)} className="block w-full cursor-pointer" title={`Sahne ${i + 1}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.url} alt={`Sahne ${i + 1}`} className="w-full h-16 object-cover" draggable={false} />
                <div className="absolute top-1 left-1 bg-black/60 text-white text-[10px] font-black px-1.5 py-0.5 rounded flex items-center gap-0.5">
                  <GripVertical className="w-2.5 h-2.5 opacity-70" />{i + 1}
                </div>
                {sceneDur > 0 && (<div className="absolute bottom-6 right-1 bg-black/70 text-white text-[9px] font-mono px-1 py-0.5 rounded">{fmt(sceneDur)}</div>)}
                {isCoverBlock && (<div className="absolute top-1 right-1 bg-emerald-500 text-white text-[9px] font-black px-1 py-0.5 rounded flex items-center gap-0.5"><Star className="w-2.5 h-2.5" /></div>)}
              </button>
              <div className="flex items-center justify-between bg-slate-800/90 px-1 py-1">
                <button onClick={() => onSetCover(img.fullIdx)} className={`w-6 h-6 flex items-center justify-center rounded ${isCoverBlock ? 'text-emerald-400' : 'text-slate-300 hover:text-emerald-300 hover:bg-white/10'}`} title="Kapak yap"><Star className="w-3.5 h-3.5" /></button>
                <button onClick={() => onDelete(img.id)} className="w-6 h-6 flex items-center justify-center rounded text-slate-300 hover:text-rose-400 hover:bg-white/10" title="Sil"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
              <div onPointerDown={(e) => onResizeDown(e, img.id)} onDragStart={(e) => e.preventDefault()} title="Süreyi ayarlamak için sürükle" className="absolute top-0 right-0 h-16 w-2.5 cursor-ew-resize hover:bg-indigo-400/60 transition-colors flex items-center justify-center">
                <span className="h-8 w-0.5 bg-white/50 rounded-full" />
              </div>
            </div>
          );
        })}

        <button onClick={onAddPhoto} disabled={isBusy} className="shrink-0 w-20 rounded-lg border-2 border-dashed border-white/20 hover:border-indigo-400 text-slate-300 hover:text-indigo-300 flex flex-col items-center justify-center gap-1 transition-all disabled:opacity-50" title="Yeni foto ekle">
          {isBusy ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
          <span className="text-[10px] font-bold">Foto Ekle</span>
        </button>
      </div>

      <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
        <Clock className="w-3 h-3" /> Sürükle-sırala · kenardan süre ayarla · ⭐ kapak · 🗑 sil · ➕ foto ekle · 🎵 müzik. Değişiklikler final videoya birebir uygulanır.
      </p>
    </div>
  );
}
