/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { Music, Volume2, VolumeX, Edit2, Check, AlertCircle, Loader2 } from 'lucide-react';

interface AudioPlayerProps {
  isAdmin?: boolean;
}

// Clean and direct romantic piano fallback if no custom url is set yet
const DEFAULT_FALLBACK_URL = "/music.mp3";

export default function AudioPlayer({ isAdmin = false }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [mp3Url, setMp3Url] = useState<string>(() => {
    return localStorage.getItem('nadindra_custom_audio_url') || DEFAULT_FALLBACK_URL;
  });
  const [inputValue, setInputValue] = useState(mp3Url);
  const [isEditing, setIsEditing] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  
  const audioElRef = useRef<HTMLAudioElement | null>(null);

  // Sync state with local storage
  useEffect(() => {
    setInputValue(mp3Url);
  }, [mp3Url]);

  // Handle mute changes
  useEffect(() => {
    if (audioElRef.current) {
      audioElRef.current.muted = isMuted;
    }
  }, [isMuted]);

  // Play/Pause handler
  const togglePlayback = () => {
    const audio = audioElRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      setIsLoading(true);
      setAudioError(null);
      audio.play()
        .then(() => {
          setIsPlaying(true);
          setIsLoading(false);
        })
        .catch(err => {
          console.error("Audio playback error:", err);
          setIsLoading(false);
          setAudioError("Izin browser diperlukan. Silakan klik tombol Play lagi!");
          setIsPlaying(false);
        });
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  // Submit new custom song URL
  const handleSaveUrl = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    
    setMp3Url(trimmed);
    localStorage.setItem('nadindra_custom_audio_url', trimmed);
    setAudioError(null);
    setIsEditing(false);
    setIsPlaying(false); // Pause first to reload track

    // Safely load and play new URL
    setTimeout(() => {
      const audio = audioElRef.current;
      if (audio) {
        audio.load();
        setIsLoading(true);
        audio.play()
          .then(() => {
            setIsPlaying(true);
            setIsLoading(false);
          })
          .catch(e => {
            console.log("Auto-play for new URL was paused:", e);
            setIsLoading(false);
          });
      }
    }, 150);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end" id="audio-player-global-wrapper">
      {/* Native HTML5 Audio node - No complex web synth APIs */}
      <audio
        ref={audioElRef}
        src={mp3Url}
        loop
        preload="auto"
        className="hidden"
        onLoadStart={() => setIsLoading(true)}
        onCanPlay={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setAudioError("Gagal memuat. Pastikan link adalah direct .mp3!");
          setIsPlaying(false);
        }}
      />

      {/* Very simple URL settings bar directly above the controller (Admin only) */}
      {isEditing && isAdmin && (
        <div className="mb-3 w-80 bg-white/95 backdrop-blur-md rounded-2xl p-4 border border-pink-200/50 shadow-2xl relative z-50 text-slate-800 animate-in fade-in slide-in-from-bottom-2 duration-300" id="audio-settings-popup">
          <div className="flex justify-between items-center pb-2 border-b border-pink-100 mb-2.5">
            <span className="text-[10px] font-sans font-bold text-pink-500 uppercase tracking-widest">
              Ganti Link Musik Latar
            </span>
            <button
              onClick={() => {
                setInputValue(mp3Url);
                setIsEditing(false);
              }}
              className="text-slate-400 hover:text-pink-500 text-xs font-bold"
            >
              Batal
            </button>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex gap-1.5">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Paste link direct .mp3 disini..."
                className="flex-1 text-xs font-sans px-3 py-2 bg-pink-50/20 border border-dashed border-pink-200 rounded-xl outline-none text-slate-700"
              />
              <button
                onClick={handleSaveUrl}
                className="bg-pink-500 hover:bg-pink-600 text-white p-2 rounded-xl transition-colors flex items-center justify-center"
              >
                <Check className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[9px] text-slate-400 leading-normal">
              💡 Harap gunakan URL direct MP3 yang diakhiri dengan <strong className="text-pink-400">.mp3</strong> agar dapat diputar dengan lancar.
            </p>
          </div>
        </div>
      )}

      {/* Elegant audio capsule */}
      <div className="bg-white/70 backdrop-blur-md border border-pink-100 rounded-full px-4 py-2.5 shadow-lg flex items-center gap-3 transition-all duration-500 hover:shadow-pink-100/50 hover:bg-white/90">
        <div className="flex items-center gap-2">
          {/* Circular Play / Pause toggle */}
          <button
            onClick={togglePlayback}
            disabled={isLoading}
            className={`p-2.5 rounded-full transition-all duration-300 ${
              isPlaying 
                ? 'bg-pink-500 text-white animate-spin-slow' 
                : 'bg-pink-100 text-pink-600 hover:bg-pink-200'
            } disabled:opacity-50`}
            title={isPlaying ? "Klik untuk Jeda" : "Klik untuk Putar"}
            id="music-box-btn"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Music className="w-4 h-4" />
            )}
          </button>

          <div className="flex flex-col pr-1 text-left select-none">
            <span className="text-[10px] font-mono text-pink-400 font-bold uppercase tracking-wider">
              {isPlaying ? 'Now Playing' : 'Musik Latar'}
            </span>
            <span className="text-xs font-serif text-slate-700 font-semibold max-w-[140px] truncate leading-tight">
              {audioError ? "Gagal memutar ⚠️" : "song 4 u 💖"}
            </span>
          </div>
        </div>

        {/* Action button panel */}
        <div className="flex items-center gap-1 border-l border-pink-100 pl-2">
          {isAdmin && (
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`p-1.5 rounded-full hover:text-pink-500 hover:bg-pink-50 transition-all ${
                isEditing ? 'text-pink-500 rotate-12 bg-pink-50' : 'text-slate-400'
              }`}
              title="Ganti URL musik"
              id="music-box-settings-btn"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={toggleMute}
            className="p-1.5 text-slate-400 hover:text-pink-500 hover:bg-pink-50 rounded-full transition-colors"
            title={isMuted ? "Aktifkan Suara" : "Matikan Suara"}
            id="music-box-mute-btn"
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Music visualizer ripples */}
        {isPlaying && (
          <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 flex gap-1 h-3 items-end">
            {[...Array(4)].map((_, i) => (
              <span
                key={i}
                className="bg-pink-400/50 w-0.5 rounded-full animate-pulse"
                style={{
                  height: `${Math.random() * 80 + 20}%`,
                  animationDelay: `${i * 150}ms`
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Clean alert for file errors */}
      {audioError && (
        <div className="mt-2 bg-rose-50 border border-rose-100 rounded-xl px-3 py-2 text-[10px] text-rose-600 flex items-center gap-1.5 max-w-[240px] shadow-sm font-sans animate-bounce" id="audio-error-toast">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="leading-tight font-medium">{audioError}</span>
        </div>
      )}
    </div>
  );
}
