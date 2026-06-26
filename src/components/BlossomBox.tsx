/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Heart, Gift, VolumeX, Mic, MicOff } from 'lucide-react';

interface BlossomBoxProps {
  customLetter?: string;
  isAdmin?: boolean;
}

interface Candle {
  id: number;
  isLit: boolean;
  x: number;
  y: number;
}

export default function BlossomBox({ customLetter, isAdmin = false }: BlossomBoxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isRibbonRemoved, setIsRibbonRemoved] = useState(false);
  const [balloons, setBalloons] = useState<{ id: number; x: number; color: string; size: number }[]>([]);
  const [candles, setCandles] = useState<Candle[]>([]);
  const [allBlownOut, setAllBlownOut] = useState(false);
  const [micActive, setMicActive] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);

  const audioStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Initialize the 17 candles of sweet seventeen symmetrically arranged on a nice cake
  useEffect(() => {
    const list: Candle[] = [];
    const cakeRadiusX = 80;
    const cakeRadiusY = 25;
    const centerX = 150;
    const centerY = 45;

    for (let i = 0; i < 17; i++) {
      // polar coordinate placement over semi-ellipse for nice pseudo-3D perspective cake top
      const angle = (i / 16) * Math.PI; // spread 180 degrees
      const scaleX = cakeRadiusX * Math.cos(angle);
      const scaleY = cakeRadiusY * Math.sin(angle);
      list.push({
        id: i,
        isLit: true,
        x: centerX + scaleX,
        y: centerY - scaleY // subtract for arch arching upwards
      });
    }
    setCandles(list);
  }, []);

  // Mic Blowing Detector Node
  const toggleMic = async () => {
    if (micActive) {
      stopMic();
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioStreamRef.current = stream;

      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      audioContextRef.current = ctx;

      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;

      setMicActive(true);
      detectBlowing();
    } catch (err) {
      console.warn("Microphone access was denied or holds layout limits:", err);
      alert("Mic access is locked or unsupported in this preview frame. No worries! You can click or tap each candle to blow it out! 🎂");
    }
  };

  const stopMic = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach(track => track.stop());
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
    }
    setMicActive(false);
    setAudioLevel(0);
  };

  const detectBlowing = () => {
    const analyser = analyserRef.current;
    if (!analyser) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(dataArray);

    // Calculate root-mean-square level representing volume
    let sum = 0;
    for (let i = 0; i < bufferLength; i++) {
      sum += dataArray[i];
    }
    const average = sum / bufferLength;
    setAudioLevel(Math.min(100, Math.floor(average * 1.5)));

    // If she blows hard (threshold roughly 42)
    if (average > 42) {
      setCandles(prev => {
        // blow out candles randomly or in sequence
        const litOnes = prev.filter(c => c.isLit);
        if (litOnes.length > 0) {
          // Put out 2-3 candles with each breath
          const toExtinguishCount = Math.min(litOnes.length, 3);
          const indexesToBlow = [];
          
          while (indexesToBlow.length < toExtinguishCount) {
             const randIndex = Math.floor(Math.random() * prev.length);
             if (prev[randIndex].isLit && !indexesToBlow.includes(randIndex)) {
               indexesToBlow.push(randIndex);
             }
          }

          const next = prev.map((c, i) => 
            indexesToBlow.includes(i) ? { ...c, isLit: false } : c
          );

          if (next.every(c => !c.isLit)) {
            setAllBlownOut(true);
            setTimeout(() => stopMic(), 2000);
          }
          return next;
        }
        return prev;
      });
    }

    animationFrameRef.current = requestAnimationFrame(detectBlowing);
  };

  useEffect(() => {
    return () => {
      stopMic();
    };
  }, []);

  const triggerBalloons = () => {
    const list = Array.from({ length: 15 }).map((_, i) => ({
      id: Date.now() + i,
      x: 10 + Math.random() * 80, // percentage
      color: ['#FFC0CB', '#FFB6C1', '#F48FB1', '#FFD1DC', '#FFE5EC'][Math.floor(Math.random() * 5)],
      size: Math.random() * 25 + 20
    }));
    setBalloons(list);
  };

  const handleOpenGift = () => {
    if (!isRibbonRemoved) {
      setIsRibbonRemoved(true);
      return;
    }
    if (isOpen) return;

    setIsOpen(true);
    triggerBalloons();
  };

  const blowCandleManually = (id: number) => {
    setCandles(prev => {
      const next = prev.map(c => c.id === id ? { ...c, isLit: false } : c);
      if (next.every(c => !c.isLit)) {
        setAllBlownOut(true);
      }
      return next;
    });
  };

  const blowAllManually = () => {
    setCandles(prev => prev.map(c => ({ ...c, isLit: false })));
    setAllBlownOut(true);
  };

  const balloonColors = ['bg-rose-300', 'bg-pink-300', 'bg-pink-400', 'bg-amber-200/90', 'bg-sky-200/90'];

  const [letterContent, setLetterContent] = useState<string>(() => {
    if (customLetter) return customLetter;
    return localStorage.getItem('nadindra_custom_letter_content_v2') || `Dearest Nadindra,

Happy Sweet Seventeen! 🌸<3

Can you believe you are officially 17 today? June 27th marks the birth of an absolutely beautiful, bright, and loving soul in this world. It is such an incredible joy to watch you bloom year after year, stepping into your dreams with grace, your warm contagious laugh, and a heart so pure it makes everyone around you feel incredibly blessed.

Seventeen is a magical year. It is the bridge where your wild, sweet childhood meets the first exciting steps of your independence. My deepest prayers for you are:

-  That your gentle smile never fades, even on cloudy days.
-  That your path is filled with loyal friends, warm memories, and brave adventures.
-  That you remain raw, honest, and as deeply precious as you are today.

Remember, you are stronger than you think, kinder than you know, and loved more than you can possibly imagine. Enjoy every waltz, every sunset, and every rose petal on this beautiful seventeenth waltz of yours.

Wishing you a birthday as bright and beautiful as your soul. Happy 17th, Nadindra!

With infinite warmth & love,
Helma ❤️`;
  });

  return (
    <div className="py-12 px-4 max-w-2xl mx-auto flex flex-col items-center justify-center relative" id="gift-box-stage-container">
      
      {/* Confetti Balloons Flying Up Animation */}
      <div className="absolute inset-x-0 bottom-0 top-0 overflow-hidden pointer-events-none z-30">
        <AnimatePresence>
          {balloons.map((b) => (
            <motion.div
              key={b.id}
              initial={{ y: '110vh', opacity: 0 }}
              animate={{ y: '-20vh', opacity: [0, 1, 1, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: Math.random() * 3 + 4, ease: 'easeOut' }}
              className="absolute rounded-full shadow-md flex items-center justify-center"
              style={{
                left: `${b.x}%`,
                width: `${b.size}px`,
                height: `${b.size * 1.25}px`,
                backgroundColor: b.color,
                borderRadius: '50% 50% 50% 50% / 40% 40% 60% 60%'
              }}
            >
              {/* String */}
              <div className="absolute bottom-[-15px] left-1/2 -translate-x-1/2 w-[1px] h-[15px] bg-balance-border" />
              <Heart className="w-3.5 h-3.5 text-white/40" />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence mode="wait">
        {!isOpen ? (
          <motion.div
            key="gift-box"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex flex-col items-center text-center cursor-pointer select-none"
            onClick={handleOpenGift}
            id="unopened-gift-container"
          >
            <span className="text-[10px] font-sans font-extrabold uppercase tracking-[0.25em] text-balance-gold mb-1.5 block animate-pulse">
              Step 3: The Grand Finale
            </span>
            <h2 className="text-xl md:text-2xl font-serif text-balance-dark font-extrabold mb-4 leading-tight">
              {!isRibbonRemoved ? "Swipe the Golden Ribbon to Untie" : "Tap the Box to Open Your Gift!"}
            </h2>

            {/* Gift Box Component Visual from Geometric Balance design guide */}
            <div className="relative h-44 w-44 flex items-center justify-center mb-4">
              <motion.div
                key="box-wrap"
                animate={!isRibbonRemoved ? {} : { y: [0, -6, 0] }}
                transition={{ repeat: Infinity, duration: 2.2 }}
                className="relative"
              >
                {/* 3D-styled SVG Gift box */}
                <svg width="150" height="150" viewBox="0 0 200 200" fill="none">
                  {/* Shadow */}
                  <ellipse cx="100" cy="180" rx="65" ry="12" fill="rgba(140, 120, 81, 0.15)" />
                  
                  {/* Box Body */}
                  <rect x="35" y="70" width="130" height="100" rx="10" fill="#fdf1f1" stroke="#e9dcd2" strokeWidth="1.5" />
                  <rect x="35" y="70" width="65" height="100" rx="10" fill="#fcf5f0" /> {/* depth side */}

                  {/* Lid */}
                  <rect x="25" y="55" width="150" height="25" rx="6" fill="#f1e4e4" stroke="#e9dcd2" strokeWidth="1.5" />
                  <rect x="25" y="55" width="75" height="25" rx="6" fill="#e9dbdb" />

                  {/* Ribbon & Bow (conditional on removal) */}
                  <AnimatePresence>
                    {!isRibbonRemoved ? (
                      <motion.g key="ribbon-layer" exit={{ opacity: 0, y: -40, scale: 0.8 }} transition={{ duration: 0.6 }}>
                        {/* Vertical Ribbon */}
                        <rect x="90" y="70" width="20" height="100" fill="#8c7851" />
                        <rect x="90" y="55" width="20" height="25" fill="#705e3a" />
                        
                        {/* Horizontal Ribbon */}
                        <rect x="35" y="110" width="130" height="20" fill="#8c7851" />

                        {/* Satin Bow Loops */}
                        <path d="M100 55C80 40 80 20 100 55Z" fill="#d48c8c" stroke="#8c7851" strokeWidth="1.5" />
                        <path d="M100 55C120 40 120 20 100 55Z" fill="#d48c8c" stroke="#8c7851" strokeWidth="1.5" />

                        {/* Knot center */}
                        <circle cx="100" cy="55" r="8.5" fill="#8c7851" />
                      </motion.g>
                    ) : (
                      <motion.g initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="origin-center">
                        <path d="M80 40 L120 40" stroke="#d48c8c" strokeWidth="3" strokeDasharray="3 3" />
                        <circle cx="100" cy="40" r="1.5" fill="#d48c8c" />
                      </motion.g>
                    )}
                  </AnimatePresence>
                </svg>

                {/* Sparkling overlays */}
                <span className="absolute top-4 left-4 text-balance-rose font-bold animate-pulse text-sm">✨</span>
                <span className="absolute bottom-8 right-4 text-balance-gold font-bold animate-ping font-serif text-sm">🌸</span>
              </motion.div>
            </div>

            <p className="text-[11px] text-balance-gold tracking-wide italic max-w-sm font-sans leading-relaxed">
              {!isRibbonRemoved 
                ? "This box was wrapped with true affection. Carefully swipe or tap to shed the satin band." 
                : "The seal is broken. Press the floral box to witness Nadindra's Sweet 17 Letters!"
              }
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="opened-letters-and-cake"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="w-full flex flex-col items-center gap-5"
            id="opened-gift-stage"
          >
            {/* Elegant Sticky Letter Board */}
            <div className="bg-[#fffefe]/95 border-b-[6px] border-b-rose-100/50 border border-balance-border rounded-2xl shadow-xl p-4.5 md:p-7 relative overflow-visible w-full max-w-xl mx-auto select-none" id="love-scroll-card-wrapper">
              
              {/* Retro masking tape aesthetic at top center */}
              <div 
                className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2.5 w-24 h-6.5 bg-[#fefae0]/80 border-x border-[#ccd5ae]/40 shadow-xs z-10 rotate-[0.5deg]"
                style={{
                  clipPath: 'polygon(3% 0%, 97% 0%, 100% 100%, 0% 100%)'
                }}
              />
              {/* Cute heart sticker on tape */}
              <div className="absolute top-[-3px] left-1/2 -translate-x-1/2 z-20">
                <Heart className="w-3 h-3 fill-rose-400 text-rose-400 animate-pulse" />
              </div>

              {/* Paper Watermark Texture */}
              <div className="absolute inset-0 bg-radial from-balance-rose/5 via-transparent to-transparent pointer-events-none" />
              <div className="absolute top-3 left-3 w-3 h-3 rounded-full border border-balance-border/40" />
              <div className="absolute top-3 right-3 w-3 h-3 rounded-full border border-balance-border/40" />

              <div className="flex justify-center mb-3 text-balance-rose animate-pulse mt-1">
                <Heart className="w-5 h-5 fill-balance-rose" />
              </div>

              {/* Letter content text - Flat, No scrollbar, highly legible or editable if Admin */}
              {isAdmin ? (
                <div className="relative z-10 w-full" id="admin-letter-textarea-wrapper">
                  <div className="text-[9px] font-sans font-extrabold text-pink-500 uppercase tracking-widest text-center mb-2 animate-pulse">
                    ✍️ Admin Edit Mode (Auto-saves)
                  </div>
                  <textarea
                    value={letterContent}
                    onChange={(e) => {
                      const val = e.target.value;
                      setLetterContent(val);
                      localStorage.setItem('nadindra_custom_letter_content_v2', val);
                    }}
                    className="w-full min-h-[300px] bg-pink-50/20 border border-dashed border-pink-200 focus:outline-none focus:ring-1 focus:ring-pink-300 rounded-xl p-3 font-handy text-slate-800 text-sm md:text-base leading-relaxed text-left resize-y"
                    placeholder="Custom Letter Content..."
                  />
                </div>
              ) : (
                <div className="whitespace-pre-line font-handy text-slate-800 text-sm md:text-base leading-relaxed text-left select-none">
                  {letterContent}
                </div>
              )}

              <div className="mt-4 flex justify-center text-[9px] font-sans uppercase tracking-[0.16em] font-bold text-balance-gold border-t border-balance-border/40 pt-3 select-none">
                🌸 June 27, 2026 • Blooming into Seventeen
              </div>
            </div>

            {/* Interactive Candle Blowing Cake Section with nested double dashed structure */}
            <div className="w-full bg-white rounded-[28px] shadow-xl border border-balance-border p-1 max-w-sm mx-auto" id="cake-interactive-box">
              <div className="rounded-[24px] border-2 border-dashed border-balance-border p-4 flex flex-col items-center">
                <span className="text-[9px] font-sans tracking-[0.2em] uppercase text-balance-gold font-bold block mb-0.5">
                  Lilin Sweet Seventeen
                </span>
                <h3 className="text-lg font-serif text-balance-dark font-extrabold mb-1">
                  Make Your 17 Wishes!
                </h3>
                <p className="text-[11px] text-balance-muddy/80 max-w-xs mb-4 text-center font-sans leading-relaxed">
                  {allBlownOut 
                    ? "✨ All candles are blown out! Your sweet wishes are safely carried to the stars."
                    : "Tap individual candles to blow them out, or use your Microphone to blow them out with a real huff!"
                  }
                </p>

                {/* Mic Controller Panel */}
                {!allBlownOut && (
                  <div className="flex items-center gap-2.5 mb-4 bg-balance-bg border border-balance-border px-3 py-1 rounded-full">
                    <button
                      onClick={toggleMic}
                      className={`p-1.5 rounded-full cursor-pointer transition-colors ${
                        micActive ? 'bg-balance-rose text-white animate-pulse' : 'bg-balance-border/30 text-balance-gold hover:bg-balance-border/60'
                      }`}
                      title={micActive ? "Stop Listening" : "Use Real Breath Audio (Blowing Node)"}
                      id="mic-toggle-btn"
                    >
                      {micActive ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
                    </button>
                    <div className="flex flex-col text-left">
                      <span className="text-[8px] font-sans uppercase text-balance-gold font-extrabold tracking-wider">Audio Blow Sensor</span>
                      <span className="text-xs font-serif font-bold text-balance-dark">
                        {micActive ? `Active (${audioLevel}%)` : "Mic is Off"}
                      </span>
                    </div>
                    {micActive && (
                      <div className="w-16 bg-balance-border h-1.5 rounded-full overflow-hidden">
                        <div className="bg-balance-rose h-full animate-pulse" style={{ width: `${audioLevel}%` }} />
                      </div>
                    )}
                  </div>
                )}

                {/* The Birthday Cake Container */}
                <div className="relative h-40 w-[240px] flex items-center justify-center overflow-visible select-none animate-fade-in" id="cake-canvas-box">
                  {/* SVG Cake Base */}
                  <svg width="240" height="150" viewBox="0 0 300 220" className="overflow-visible absolute top-0">
                    {/* Stand */}
                    <ellipse cx="150" cy="180" rx="90" ry="14" fill="#faedcd" />
                    <rect x="140" y="150" width="20" height="30" fill="#e9edc6" />
                    <ellipse cx="150" cy="150" rx="60" ry="10" fill="#ccd5ae" />

                    {/* Cake Lower Layer */}
                    <rect x="65" y="100" width="170" height="50" fill="#d48c8c" />
                    <ellipse cx="150" cy="100" rx="85" ry="15" fill="#fcf1f1" />
                    <ellipse cx="150" cy="150" rx="85" ry="15" fill="#d48c8c" />

                    {/* Cute frosting flow on lower layer */}
                    <path d="M65 100 C 65 110, 80 115, 90 100 C 100 115, 120 115, 130 100 C 140 115, 160 115, 170 100 C 180 115, 200 115, 210 100 C 220 115, 235 110, 235 100" fill="#ffffff" opacity="0.85" />

                    {/* Cake Upper Layer */}
                    <rect x="80" y="50" width="140" height="50" fill="#faedcd" />
                    <ellipse cx="150" cy="50" rx="70" ry="12" fill="#fffcf0" />
                    <ellipse cx="150" cy="100" rx="70" ry="12" fill="#faedcd" />

                    {/* Cute upper white frosting drips */}
                    <path d="M80 50 C 80 58, 95 62, 105 50 C 115 62, 130 62, 140 50 C 150 62, 165 62, 175 50 C 185 62, 200 62, 210 50 C 215 58, 220 54, 220 50" fill="#ffffff" opacity="0.9" />

                    {/* Candles Overlay Placement */}
                    {candles.map((candle) => (
                      <g
                        key={candle.id}
                        className="cursor-pointer group"
                        onClick={() => blowCandleManually(candle.id)}
                        id={`g-candle-${candle.id}`}
                      >
                        {/* Wax Candle Stick */}
                        <rect
                          x={candle.x - 2}
                          y={candle.y - 15}
                          width="4"
                          height="15"
                          rx="1"
                          fill={candle.id % 2 === 0 ? '#d48c8c' : '#8c7851'}
                          className="transition-all group-hover:scale-y-110 origin-bottom"
                        />
                        {/* Wick */}
                        <line x1={candle.x} y1={candle.y - 15} x2={candle.x} y2={candle.y - 18} stroke="#4a3a3a" strokeWidth="1" />
                        
                        {/* Burning Flame */}
                        <AnimatePresence>
                          {candle.isLit && (
                            <motion.path
                              initial={{ scale: 0 }}
                              animate={{ scale: [1, 1.2, 0.9, 1.1, 1] }}
                              exit={{ scale: 0, opacity: 0, y: -10 }}
                              transition={{ repeat: Infinity, duration: 0.6, ease: "easeInOut" }}
                              d={`M${candle.x} ${candle.y - 25} C${candle.x - 3} ${candle.y - 20}, ${candle.x - 3} ${candle.y - 18}, ${candle.x} ${candle.y - 18} C${candle.x + 3} ${candle.y - 18}, ${candle.x + 3} ${candle.y - 20}, ${candle.x} ${candle.y - 25} Z`}
                              fill="#FF8C00"
                              stroke="#FFD700"
                              strokeWidth="0.5"
                              className="origin-bottom"
                            />
                          )}
                        </AnimatePresence>
                      </g>
                    ))}
                  </svg>

                  {/* Floating Sweet Words after blowing candles */}
                  <AnimatePresence>
                    {allBlownOut && (
                      <motion.div
                        initial={{ scale: 0.7, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="absolute inset-0 flex flex-col items-center justify-center bg-balance-bg/40 backdrop-blur-[2px] rounded-[30px]"
                        id="blown-wishes-overlay"
                      >
                        <motion.div 
                          initial={{ y: 20 }}
                          animate={{ y: 0 }}
                          className="bg-white rounded-2xl p-6 shadow-xl border border-balance-border flex flex-col items-center"
                        >
                          <Heart className="w-8 h-8 text-balance-rose fill-balance-rose mb-2 animate-bounce" />
                          <span className="text-sm font-serif font-bold text-balance-dark">Your Wishes are Granted!</span>
                          <span className="text-[10px] text-balance-muddy font-sans mt-0.5">May your 17th year overflow with magic, Nadindra.</span>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Manual Blow All trigger */}
                {!allBlownOut && (
                  <button
                    onClick={blowAllManually}
                    className="mt-6 text-[10px] font-sans uppercase tracking-[0.2em] text-balance-gold hover:text-balance-dark font-extrabold px-4.5 py-2 rounded-full border border-balance-border bg-balance-bg/55 hover:bg-balance-bg transition-colors cursor-pointer"
                    id="blow-all-candles-btn"
                  >
                    💨 Blow All Candles Instantly
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
