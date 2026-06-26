/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { Camera, Calendar, Sparkles, Upload, FileImage, Heart, X } from 'lucide-react';
import { ChapterMemory } from '../types';

const DEFAULT_CHAPTERS: ChapterMemory[] = [
  {
    id: 'chapter1',
    title: "1. The Gentle Spark",
    subtitle: "Grateful for Your Bright Presence",
    description: "It honestly feels like 2024 was just yesterday. Time flies, but I’m so incredibly happy and grateful that I got to know you. Hanging out with you is always such a blast, and to be honest, having you around really makes me feel like I’ve gained a younger sister.",
    date: "The First Glimmer",
    image: "/pict/01.jpg",
    caption: "The beautiful spark of finding a kindred soul"
  },
  {
    id: 'chapter2',
    title: "2. Echo of Laughters",
    subtitle: "Inside Jokes & Silly Times",
    description: "One of my favorite things about you is just how fun, vibrant, and enthusiastic you are. You have this amazing energy where we can literally talk about anything and everything—from the deepest conversations to the most random topics—and never run out of things to say.",
    date: "The Golden Hours",
    image: "/pict/02.png",
    caption: "Every chuckle is a star in our universe"
  },
  {
    id: 'chapter3',
    title: "3. Woven Dreams",
    subtitle: "Being Each Other's Anchor",
    description: "I genuinely feel so proud of you whenever I see how big and high your dreams are. It’s so inspiring to watch how hard you work and how much effort you put into making those dreams a reality. Keep chasing them, I'm always rooting for you.",
    date: "Midnight Whispers",
    image: "/pict/03.jpg",
    caption: "Anchored strongly in pure, quiet trust"
  },
  {
    id: 'chapter4',
    title: "4. Admiring Your Sincerity",
    subtitle: "Your Bright Soul",
    description: "Looking back at when we first met, I’m so amazed by how much you’ve grown. You’ve changed a lot and you're so much more mature now. It’s bittersweet, though—a part of me feels a bit sad realizing 'wow, you’re all grown up now,' even though we’re literally only one year apart.",
    date: "A Constant Light",
    image: "/pict/04.jpg",
    caption: "Shining bright with gentle grace"
  },
  {
    id: 'chapter5',
    title: "5. Welcome to Your XVII Blossom",
    subtitle: "Stepping into Sweet 17",
    description: "Happy Sweet 17th, Nadindra! I hope your 17th year treats you as sweetly as you are. May you achieve everything your heart desires, always be surrounded by happiness, and be continuously blessed by Allah. Here's to becoming the absolute best version of yourself! But please promise me one thing—no matter how grown up you get, never change into a Nadin I don't recognize :D",
    date: "June 27, 2026",
    image: "/pict/05.jpeg",
    caption: "Happy 17th Sweet Birthday on June 27th!"
  }
];

interface ChapterRowProps {
  key?: string;
  ch: ChapterMemory;
  idx: number;
  isAdmin: boolean;
  isMobile: boolean;
  updateChapterField: (id: string, field: keyof ChapterMemory, value: string) => void;
  setZoomedPhoto: (photo: { src: string; caption: string } | null) => void;
  dragActiveStates: Record<string, boolean>;
  handleDragOver: (e: React.DragEvent, id: string) => void;
  handleDragLeave: (e: React.DragEvent, id: string) => void;
  handleDrop: (e: React.DragEvent, id: string) => void;
  triggerFileInput: (id: string) => void;
  clearPhoto: (e: React.MouseEvent, id: string) => void;
  renderChapterFallbackSVG: (id: string) => React.ReactNode;
  fileInputRefs: React.MutableRefObject<Record<string, HTMLInputElement | null>>;
  processFile: (file: File, chapterId: string) => void;
}

function ChapterRow({
  ch,
  idx,
  isAdmin,
  isMobile,
  updateChapterField,
  setZoomedPhoto,
  dragActiveStates,
  handleDragOver,
  handleDragLeave,
  handleDrop,
  triggerFileInput,
  clearPhoto,
  renderChapterFallbackSVG,
  fileInputRefs,
  processFile
}: ChapterRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: rowRef,
    offset: ["start end", "end start"]
  });

  const isEven = idx % 2 === 0;
  
  // Parallax offsets (smoothly moves elements relative to scroll)
  const yPhoto = useTransform(scrollYProgress, [0, 1], isMobile ? [-10, 10] : [-35, 35]);
  const yText = useTransform(scrollYProgress, [0, 1], isMobile ? [5, -5] : [15, -15]);

  return (
    <div
      ref={rowRef}
      className={`flex flex-col md:flex-row gap-8 items-center md:items-stretch relative ${
        isEven ? '' : 'md:flex-row-reverse'
      }`}
      id={`chapter-row-${ch.id}`}
    >
      {/* Timeline Center Badge */}
      <div className="absolute left-1/2 -translate-x-1/2 top-4 w-7 h-7 bg-white border-2 border-balance-gold rounded-full flex items-center justify-center z-20 pointer-events-none shadow-sm hidden md:flex">
        <Heart className="w-3.5 h-3.5 fill-balance-rose text-balance-rose" />
      </div>

      {/* Chapter Description Column */}
      <motion.div
        style={{ y: yText }}
        initial={{ opacity: 0, x: isEven ? -45 : 45 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: isMobile ? "-20px" : "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full md:w-1/2 flex flex-col justify-center text-left relative overflow-visible"
        id={`chapter-desc-col-${ch.id}`}
      >
        <div className="relative p-2 md:p-6 select-none max-w-md">
          {/* Elegant Large Backdrop Index */}
          <div className={`absolute -top-12 md:-top-16 opacity-[0.06] text-balance-gold font-serif font-black text-8xl md:text-9xl pointer-events-none select-none z-0 ${
            isEven ? '-left-4' : 'right-4 md:right-auto md:-left-4'
          }`}>
            0{idx + 1}
          </div>

          <div className="relative z-10 space-y-3.5">
            {isAdmin ? (
              <div className="space-y-3" id={`admin-edit-chapter-fields-${ch.id}`}>
                <div className="text-[9px] font-sans font-extrabold text-pink-500 uppercase tracking-widest animate-pulse">
                  ✍️ Editing Chapter {idx + 1} (Auto-saved)
                </div>
                {/* Date field */}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={ch.date}
                    onChange={(e) => updateChapterField(ch.id, 'date', e.target.value)}
                    className="text-[10px] font-sans tracking-[0.2em] font-extrabold text-balance-rose uppercase bg-pink-50/40 border border-dashed border-pink-200 rounded px-1.5 py-0.5 outline-none max-w-[140px]"
                    placeholder="Date/Phase"
                  />
                  <Sparkles className="w-3 h-3 text-balance-rose animate-spin-slow" />
                </div>

                {/* Title field */}
                <div className="flex gap-1 items-center">
                  <span className="font-serif text-lg text-balance-dark font-black">0{idx + 1}.</span>
                  <input
                    type="text"
                    value={ch.title.includes('.') ? ch.title.substring(ch.title.indexOf('.') + 1).trim() : ch.title}
                    onChange={(e) => {
                      const newTitleText = e.target.value;
                      updateChapterField(ch.id, 'title', `${idx + 1}. ${newTitleText}`);
                    }}
                    className="text-lg md:text-xl font-serif text-balance-dark font-black tracking-tight leading-none bg-pink-50/40 border border-dashed border-pink-200 rounded px-2 py-1 outline-none w-full"
                    placeholder="Chapter Title"
                  />
                </div>

                {/* Subtitle field */}
                <input
                  type="text"
                  value={ch.subtitle}
                  onChange={(e) => updateChapterField(ch.id, 'subtitle', e.target.value)}
                  className="font-handy text-balance-gold font-medium italic text-xl md:text-2xl tracking-wide bg-pink-50/40 border border-dashed border-pink-200 rounded px-2 py-1 outline-none w-full"
                  placeholder="Chapter Subtitle"
                />

                {/* Description field */}
                <textarea
                  value={ch.description}
                  onChange={(e) => updateChapterField(ch.id, 'description', e.target.value)}
                  className="text-xs md:text-[13px] text-balance-muddy font-sans leading-relaxed bg-pink-50/40 border border-dashed border-pink-200 rounded px-2 py-1.5 outline-none w-full min-h-[90px] resize-y"
                  placeholder="Chapter Description"
                />
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-sans tracking-[0.2em] font-extrabold text-balance-rose uppercase">
                    {ch.date}
                  </span>
                  <div className="h-[1px] w-8 bg-balance-rose/30"></div>
                  <Sparkles className="w-3 h-3 text-balance-rose animate-spin-slow" />
                </div>

                <h3 className="text-2xl md:text-3xl font-serif text-balance-dark font-black tracking-tight leading-none">
                  {ch.title.substring(ch.title.indexOf('.') + 1).trim()}
                </h3>

                <h4 className="font-handy text-balance-gold font-medium italic text-2xl md:text-3xl tracking-wide select-none">
                  {ch.subtitle}
                </h4>

                <p className="text-xs md:text-[13px] text-balance-muddy font-sans leading-relaxed select-none">
                  {ch.description}
                </p>
              </>
            )}
          </div>
        </div>
      </motion.div>

      {/* Customized Polaroid Photo Frame Column */}
      <motion.div
        style={{ y: yPhoto }}
        initial={{ opacity: 0, scale: 0.9, rotate: isEven ? 4 : -4 }}
        whileInView={{ opacity: 1, scale: 1, rotate: isEven ? 2 : -2 }}
        viewport={{ once: true, margin: isMobile ? "-20px" : "-100px" }}
        transition={{ duration: 0.8, type: "spring" }}
        className="w-full md:w-1/2 flex items-center justify-center"
        id={`chapter-photo-col-${ch.id}`}
      >
        {/* Polaroid Frame */}
        <div
          onDragOver={(e) => isAdmin ? handleDragOver(e, ch.id) : undefined}
          onDragLeave={(e) => isAdmin ? handleDragLeave(e, ch.id) : undefined}
          onDrop={(e) => isAdmin ? handleDrop(e, ch.id) : undefined}
          onClick={() => {
            if (isAdmin) {
              triggerFileInput(ch.id);
            } else if (ch.image) {
              setZoomedPhoto({ src: ch.image, caption: ch.caption });
            }
          }}
          className={`bg-white border border-balance-border p-4 pb-6 shadow-xl w-64 rounded-sm hover:shadow-2xl transition-all duration-300 relative select-none group origin-center ${
            isAdmin || ch.image ? 'cursor-pointer' : 'cursor-default'
          } ${
            isAdmin && dragActiveStates[ch.id] ? 'ring-2 ring-balance-rose bg-balance-bg' : ''
          }`}
          id={`polaroid-frame-${ch.id}`}
        >
          {/* Photo area */}
          <div className="bg-slate-50 w-full h-[180px] rounded-xs border border-slate-100 overflow-hidden relative flex items-center justify-center mb-4">
            {ch.image ? (
              <div className="w-full h-full relative">
                <img
                  src={ch.image}
                  alt={ch.caption}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                {/* Hover Overlay hints only for Admin */}
                {isAdmin && (
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-4">
                    <Camera className="w-8 h-8 mb-2 animate-bounce" />
                    <span className="text-[10px] font-bold font-sans uppercase tracking-wider">Change Photo</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center relative">
                {renderChapterFallbackSVG(ch.id)}
                
                {/* Hover Overlay hints only for Admin */}
                {isAdmin && (
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-4">
                    <Camera className="w-8 h-8 mb-2 animate-bounce" />
                    <span className="text-[10px] font-bold font-sans uppercase tracking-wider">Drag & Drop Photo</span>
                    <span className="text-[9px] text-white/70 mt-1">Or click to browse</span>
                  </div>
                )}
              </div>
            )}

            {/* Clear Photo Option - Admin Only */}
            {isAdmin && ch.image && (
              <button
                onClick={(e) => clearPhoto(e, ch.id)}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 hover:bg-black text-white transition-colors z-30 animate-fade-in"
                title="Remove custom photo"
                id={`clear-photo-btn-${ch.id}`}
              >
                <span className="text-[9px] font-mono leading-none">✕</span>
              </button>
            )}
          </div>

          {/* Caption line */}
          <div className="text-center" onClick={(e) => isAdmin ? e.stopPropagation() : undefined}>
            {isAdmin ? (
              <input
                type="text"
                value={ch.caption}
                onChange={(e) => updateChapterField(ch.id, 'caption', e.target.value)}
                className="font-serif text-[11px] text-slate-700 font-semibold italic text-center bg-pink-50/40 border border-dashed border-pink-200 rounded px-1 py-0.5 outline-none w-full"
                placeholder="Caption..."
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <p className="font-serif text-[11px] text-slate-700 font-semibold italic truncate">
                {ch.caption}
              </p>
            )}
            <span className="text-[9px] font-mono text-slate-400 mt-1 block">
              {ch.image ? "✨ Active Photo" : "🌸 Fallback Art"}
            </span>
          </div>

          {/* Input Ref for file dialogs - Admin Only */}
          {isAdmin && (
            <input
              ref={(el) => { fileInputRefs.current[ch.id] = el; }}
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) processFile(file, ch.id);
              }}
              className="hidden"
            />
          )}
        </div>
      </motion.div>
    </div>
  );
}

interface MemoryBookProps {
  isAdmin?: boolean;
}

export default function MemoryBook({ isAdmin = false }: MemoryBookProps) {
  const [chapters, setChapters] = useState<ChapterMemory[]>(DEFAULT_CHAPTERS);
  const [dragActiveStates, setDragActiveStates] = useState<Record<string, boolean>>({});
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const [isMobile, setIsMobile] = useState(false);
  const [zoomedPhoto, setZoomedPhoto] = useState<{ src: string; caption: string } | null>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Load custom chapters metadata and photos from localStorage on mount
  useEffect(() => {
    const savedMeta = localStorage.getItem('nadindra_chapters_metadata_v2');
    let baseChapters = DEFAULT_CHAPTERS;
    if (savedMeta) {
      try {
        baseChapters = JSON.parse(savedMeta);
      } catch (e) {
        console.error("Error parsing saved chapters metadata:", e);
      }
    }
    const loadedChapters = baseChapters.map(ch => {
      const savedPhoto = localStorage.getItem(`nadindra_photo_${ch.id}`);
      if (savedPhoto) {
        return { ...ch, image: savedPhoto };
      }
      return ch;
    });
    setChapters(loadedChapters);
  }, []);

  // Handle escape key to close zoom modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setZoomedPhoto(null);
      }
    };
    if (zoomedPhoto) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [zoomedPhoto]);

  const updateChapterField = (id: string, field: keyof ChapterMemory, value: string) => {
    setChapters(prev => {
      const next = prev.map(ch => ch.id === id ? { ...ch, [field]: value } : ch);
      const metaToSave = next.map(({ id, title, subtitle, description, date, caption }) => ({
        id, title, subtitle, description, date, caption
      }));
      localStorage.setItem('nadindra_chapters_metadata_v2', JSON.stringify(metaToSave));
      return next;
    });
  };

  const handlePhotoUpload = (chapterId: string, base64: string) => {
    localStorage.setItem(`nadindra_photo_${chapterId}`, base64);
    setChapters(prev => prev.map(ch => ch.id === chapterId ? { ...ch, image: base64 } : ch));
  };

  const processFile = (file: File, chapterId: string) => {
    if (!file.type.startsWith('image/')) {
      alert("Please select a romantic image file! 🌸");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        handlePhotoUpload(chapterId, e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActiveStates(prev => ({ ...prev, [id]: true }));
  };

  const handleDragLeave = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActiveStates(prev => ({ ...prev, [id]: false }));
  };

  const handleDrop = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActiveStates(prev => ({ ...prev, [id]: false }));
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      processFile(files[0], id);
    }
  };

  const triggerFileInput = (id: string) => {
    fileInputRefs.current[id]?.click();
  };

  const clearPhoto = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    localStorage.removeItem(`nadindra_photo_${id}`);
    setChapters(prev => prev.map(ch => ch.id === id ? { ...ch, image: "" } : ch));
  };

  // Beautiful visual SVGs as fallbacks for memory photos
  const renderChapterFallbackSVG = (id: string) => {
    switch (id) {
      case 'chapter1':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full fill-none p-12">
            <circle cx="50" cy="50" r="32" fill="#FFE5EC" opacity="0.6" />
            {/* Cocoa mug with steam hearts */}
            <path d="M35 45 H65 V65 C65 72, 59 78, 50 78 H50 C41 78, 35 72, 35 65 Z" fill="#FFA3B1" />
            <path d="M65 52 H73 C76 52, 78 54, 78 57 C78 60, 76 62, 73 62 H65" stroke="#FFA3B1" strokeWidth="4.5" />
            {/* Heart steam */}
            <path d="M46 38 C46 32, 50 30, 50 34 C50 30, 54 32, 54 38 C54 44, 50 46, 50 46 C50 46, 46 44, 46 38 Z" fill="#F48FB1 animate-pulse" />
            <circle cx="38" cy="30" r="1.5" fill="#FFB6C1" />
            <circle cx="62" cy="28" r="2" fill="#FFB6C1" />
          </svg>
        );
      case 'chapter2':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full fill-none p-12">
            <circle cx="50" cy="50" r="32" fill="#F0F4FF" opacity="0.7" />
            {/* Retro Vinyl Record of music/giggle */}
            <circle cx="50" cy="50" r="28" fill="#1E293B" />
            <circle cx="50" cy="50" r="24" stroke="#475569" strokeWidth="1" />
            <circle cx="50" cy="50" r="18" stroke="#475569" strokeWidth="1" />
            <circle cx="50" cy="50" r="10" fill="#F48FB1" />
            <circle cx="50" cy="50" r="3" fill="#FFFFFF" />
            {/* Music Notes */}
            <path d="M72 32 C72 26, 78 28, 78 28" stroke="#F48FB1" strokeWidth="3" strokeLinecap="round" />
            <circle cx="72" cy="32" r="3" fill="#F48FB1" />
          </svg>
        );
      case 'chapter3':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full fill-none p-12">
            <circle cx="50" cy="50" r="32" fill="#FFF0F5" opacity="0.7" />
            {/* Cozy starry night lamp anchor */}
            <path d="M50 20 L50 75" stroke="#B39DDB" strokeWidth="4.5" strokeLinecap="round" />
            <path d="M32 50 C32 64, 68 64, 68 50" stroke="#B39DDB" strokeWidth="4.5" strokeLinecap="round" />
            <circle cx="50" cy="20" r="6" fill="#D1C4E9" />
            <path d="M50 15 C45 10, 55 10, 50 15 Z" fill="#FFD700" className="animate-pulse" />
          </svg>
        );
      case 'chapter4':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full fill-none p-12">
            <circle cx="50" cy="50" r="32" fill="#E6FFFA" opacity="0.7" />
            {/* Floating flower / crystal soul */}
            <path d="M50 16 L60 38 L84 42 L66 58 L72 82 L50 68 L28 82 L34 58 L16 42 L40 38 Z" fill="#4FD1C5" opacity="0.8" />
            <path d="M50 24 L57 41 L75 44 L61 56 L66 74 L50 64 L34 74 L39 56 L25 44 L43 41 Z" fill="#E6FFFA" />
            <circle cx="50" cy="50" r="4" fill="#2D3748" />
          </svg>
        );
      default:
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full fill-none p-10">
            {/* Blooming Bouquet */}
            <circle cx="50" cy="50" r="32" fill="#FFF5F5" opacity="0.8" />
            {/* Stems */}
            <line x1="38" y1="75" x2="52" y2="40" stroke="#81C784" strokeWidth="3" />
            <line x1="50" y1="75" x2="50" y2="40" stroke="#81C784" strokeWidth="3" />
            <line x1="62" y1="75" x2="48" y2="40" stroke="#81C784" strokeWidth="3" />
            {/* Bouquet Ribbon Wrap */}
            <path d="M42 64 C46 62, 54 62, 58 64 L50 69 Z" fill="#EE768A" />
            {/* Flowers */}
            <circle cx="50" cy="34" r="10" fill="#FF8D9E" />
            <circle cx="36" cy="42" r="8" fill="#F48FB1" />
            <circle cx="64" cy="42" r="8" fill="#B39DDB" />
            {/* Flower center */}
            <circle cx="50" cy="34" r="3" fill="#FFF5F5" />
            <circle cx="36" cy="42" r="2.5" fill="#FFF5F5" />
            <circle cx="64" cy="42" r="2.5" fill="#FFF5F5" />
          </svg>
        );
    }
  };

  return (
    <div className="relative py-12 max-w-4xl mx-auto px-4" id="memory-book-section">
      
      {/* Scroll indicator line */}
      <div className="absolute left-1/2 -translate-x-1/2 top-10 bottom-10 w-[2px] bg-gradient-to-b from-balance-border via-balance-gold/30 to-balance-border pointer-events-none hidden md:block" />

      <div className="space-y-16 md:space-y-24">
        {chapters.map((ch, idx) => (
          <ChapterRow
            key={ch.id}
            ch={ch}
            idx={idx}
            isAdmin={isAdmin}
            isMobile={isMobile}
            updateChapterField={updateChapterField}
            setZoomedPhoto={setZoomedPhoto}
            dragActiveStates={dragActiveStates}
            handleDragOver={handleDragOver}
            handleDragLeave={handleDragLeave}
            handleDrop={handleDrop}
            triggerFileInput={triggerFileInput}
            clearPhoto={clearPhoto}
            renderChapterFallbackSVG={renderChapterFallbackSVG}
            fileInputRefs={fileInputRefs}
            processFile={processFile}
          />
        ))}
      </div>

      {/* Lightbox Zoom Modal */}
      <AnimatePresence>
        {zoomedPhoto && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setZoomedPhoto(null)}
              className="absolute inset-0 bg-slate-900/85 backdrop-blur-md"
            />

            {/* Polaroid Zoomed Content */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white border border-balance-border p-4 pb-8 shadow-2xl rounded-sm w-full max-w-[90vw] md:max-w-md relative z-10 select-none origin-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setZoomedPhoto(null)}
                className="absolute -top-12 right-0 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                title="Close Zoom"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Zoomed Photo Area */}
              <div className="bg-slate-50 w-full h-[320px] md:h-[400px] rounded-xs border border-slate-100 overflow-hidden relative flex items-center justify-center mb-6">
                <img
                  src={zoomedPhoto.src}
                  alt={zoomedPhoto.caption}
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Zoomed Caption */}
              <div className="text-center">
                <p className="font-serif text-sm md:text-base text-slate-800 font-bold italic leading-relaxed">
                  {zoomedPhoto.caption || "🌸 Beautiful Memory 🌸"}
                </p>
                <span className="text-[10px] font-mono text-slate-400 mt-2 block">
                  Nadindra's XVII Chapter
                </span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
