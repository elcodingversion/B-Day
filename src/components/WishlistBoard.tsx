/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Plus, Trash2, Heart, Info } from 'lucide-react';

interface Wish {
  id: string;
  text: string;
  colorClass: string;
  rotation: number;
  date: string;
  isPermanent?: boolean;
}

const PASTEL_COLORS = [
  'bg-amber-100/90 text-amber-900 border-amber-200/50 shadow-amber-100/50',
  'bg-rose-100/90 text-rose-900 border-rose-200/50 shadow-rose-100/50',
  'bg-blue-100/90 text-blue-900 border-blue-200/50 shadow-blue-100/50',
  'bg-emerald-100/90 text-emerald-900 border-emerald-200/50 shadow-emerald-100/50',
  'bg-purple-100/90 text-purple-900 border-purple-200/50 shadow-purple-100/50',
  'bg-pink-100/90 text-pink-900 border-pink-200/50 shadow-pink-100/50',
];

const HELMA_WISH: Wish = {
  id: 'helma-wish',
  text: "May you always be surrounded by kind people, have good days, and always stay the Nadin I know. From Helma, whom you once called your \"future sister\" :3 🌸",
  colorClass: 'bg-rose-100/95 text-rose-950 border-rose-200 shadow-rose-100/40',
  rotation: -1.2,
  date: 'June 27, 2026',
  isPermanent: true
};

const DEFAULT_WISHES: Wish[] = [];

const getWishFontSizeClass = (text: string) => {
  const len = text.length;
  if (len > 120) return 'text-[12.5px] md:text-[14.5px] leading-snug';
  if (len > 80) return 'text-[15px] md:text-[17px] leading-snug';
  if (len > 50) return 'text-[18px] md:text-[21px] leading-relaxed';
  return 'text-2xl md:text-3xl leading-relaxed';
};

interface WishlistBoardProps {
  theme?: 'romantic-pink' | 'lavender-dream' | 'peach-blossom';
}

export default function WishlistBoard({ theme = 'romantic-pink' }: WishlistBoardProps) {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [newWishText, setNewWishText] = useState("");

  const getThemeColors = () => {
    switch (theme) {
      case 'lavender-dream':
        return {
          cardBg: 'bg-[#faf8fd]/95',
          border: 'border-purple-200/50',
          shadow: 'shadow-purple-100/10',
          label: 'text-purple-500',
          inputBg: 'bg-purple-50/40',
          inputBorder: 'border-purple-200/60',
          focusRing: 'focus-within:ring-purple-300/45',
          text: 'text-purple-950',
          placeholder: 'placeholder:text-purple-300/85',
          btnBg: 'from-purple-500 to-indigo-400 hover:from-purple-600 hover:to-indigo-500 shadow-purple-500/10',
          subText: 'text-purple-500',
          badgeBg: 'bg-purple-50 border-purple-200 text-purple-700',
          boardBg: 'bg-purple-50/20 border-purple-200/30',
          boardTitle: 'text-purple-700/60'
        };
      case 'peach-blossom':
        return {
          cardBg: 'bg-[#fffdfa]/95',
          border: 'border-amber-200/50',
          shadow: 'shadow-amber-100/10',
          label: 'text-amber-500',
          inputBg: 'bg-amber-50/40',
          inputBorder: 'border-amber-200/60',
          focusRing: 'focus-within:ring-amber-300/41',
          text: 'text-amber-950',
          placeholder: 'placeholder:text-amber-400/85',
          btnBg: 'from-amber-600 to-orange-400 hover:from-amber-700 hover:to-orange-500 shadow-amber-500/10',
          subText: 'text-amber-500',
          badgeBg: 'bg-amber-50 border-amber-200 text-amber-750',
          boardBg: 'bg-amber-50/20 border-amber-200/30',
          boardTitle: 'text-amber-750/60'
        };
      default: // romantic-pink
        return {
          cardBg: 'bg-[#fffcfb]/95',
          border: 'border-pink-200/50',
          shadow: 'shadow-pink-100/10',
          label: 'text-pink-500',
          inputBg: 'bg-pink-50/40',
          inputBorder: 'border-pink-200/60',
          focusRing: 'focus-within:ring-pink-300/45',
          text: 'text-pink-950',
          placeholder: 'placeholder:text-pink-300/85',
          btnBg: 'from-pink-500 to-rose-400 hover:from-pink-600 hover:to-rose-500 shadow-pink-500/10',
          subText: 'text-pink-500',
          badgeBg: 'bg-pink-50 border-pink-200 text-pink-700',
          boardBg: 'bg-pink-50/20 border-pink-200/30',
          boardTitle: 'text-pink-700/60'
        };
    }
  };

  const colors = getThemeColors();

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("nadindra_17_wishes");
    let userWishes: Wish[] = [];
    if (saved) {
      try {
        userWishes = JSON.parse(saved);
      } catch (e) {
        userWishes = [];
      }
    }
    userWishes = userWishes.filter(w => !w.isPermanent);
    setWishes([HELMA_WISH, ...userWishes]);
  }, []);

  const saveWishes = (updated: Wish[]) => {
    const userWishes = updated.filter(w => !w.isPermanent);
    localStorage.setItem("nadindra_17_wishes", JSON.stringify(userWishes));
    setWishes([HELMA_WISH, ...userWishes]);
  };

  const handleAddWish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWishText.trim()) return;
    
    const userWishesCount = wishes.filter(w => !w.isPermanent).length;
    if (userWishesCount >= 17) {
      alert("Maximum of 17 wishes allowed to celebrate Sweet Seventeen! 🌸");
      return;
    }

    const randomColor = PASTEL_COLORS[Math.floor(Math.random() * PASTEL_COLORS.length)];
    const randomRotation = (Math.random() * 4) - 2; // Random rotation between -2 and +2 degrees

    const newWish: Wish = {
      id: Date.now().toString(),
      text: newWishText.trim(),
      colorClass: randomColor,
      rotation: randomRotation,
      date: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
    };

    const updated = [newWish, ...wishes];
    saveWishes(updated);
    setNewWishText("");
  };

  const handleDeleteWish = (id: string) => {
    const updated = wishes.filter(w => w.id !== id);
    saveWishes(updated);
  };

  const userWishesCount = wishes.filter(w => !w.isPermanent).length;

  return (
    <div className="py-8 max-w-4xl mx-auto px-4 select-none" id="wishlist-board-container">
      {/* Dynamic Intro Header */}
      <div className="text-center mb-10 max-w-xl mx-auto">
        <div className={`inline-flex items-center gap-1.5 px-3 py-1 ${colors.badgeBg} border text-[10px] uppercase font-bold tracking-[0.16em] rounded-full mb-3 shadow-xs animate-bounce`}>
          <Sparkles className="w-3 h-3" />
          <span>Sweet 17 Wishes</span>
        </div>
        <h2 className="text-3xl font-serif text-slate-800 font-extrabold mb-2 leading-tight">
          Nadindra's Wishing Jar 🌸
        </h2>
        <p className="text-xs text-slate-500 font-sans leading-relaxed">
          Write down your beautiful wishes and prayers for an extraordinary journey in this 17th year. Fill this board with your top 17 best dreams! ({userWishesCount}/17 wishes)
        </p>
      </div>

      {/* Modern High-End Input Card - styled like a beautiful pink envelope or paper strip */}
      <div className={`${colors.cardBg} backdrop-blur-md rounded-[28px] p-6 mb-12 border ${colors.border} shadow-xl ${colors.shadow} max-w-md mx-auto`} id="wish-input-form-container">
        <div className="text-center mb-3">
          <span className={`text-[10px] font-sans font-bold ${colors.label} tracking-widest uppercase`}>
            Draft Your 17 Wishes
          </span>
        </div>
        <form onSubmit={handleAddWish} className="flex flex-col gap-3">
          <div className={`relative ${colors.inputBg} border border-dashed ${colors.inputBorder} rounded-2xl px-3 py-1.5 ${colors.focusRing} transition-all`}>
            <input
              type="text"
              maxLength={100}
              placeholder={
                userWishesCount >= 17 
                  ? "Your sweet 17 wishboard is fully completed! 💖" 
                  : "Type a beautiful wish in English..."
              }
              disabled={userWishesCount >= 17}
              value={newWishText}
              onChange={(e) => setNewWishText(e.target.value)}
              className={`w-full text-center px-2 py-2 bg-transparent focus:outline-none text-2xl md:text-3xl font-handy ${colors.text} ${colors.placeholder} transition-all font-medium`}
              id="wish-input-text-field"
            />
          </div>
          
          <button
            type="submit"
            disabled={userWishesCount >= 17 || !newWishText.trim()}
            className={`w-full bg-gradient-to-r ${colors.btnBg} disabled:from-slate-200 disabled:to-slate-300 disabled:text-slate-400 text-white rounded-xl py-3 font-sans font-bold text-[11px] uppercase tracking-wider shadow-md disabled:shadow-none transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer disabled:cursor-not-allowed`}
            id="add-wish-submit-btn"
          >
            <Plus className="w-4 h-4" />
            <span>Pin To Wishboard</span>
          </button>
        </form>
        {userWishesCount < 17 && (
          <div className={`mt-3 text-center text-[10px] ${colors.subText} font-sans italic`}>
            You still have <span className="font-bold font-sans not-italic">{17 - userWishesCount}</span> dream spaces left to pin!
          </div>
        )}
      </div>

      {/* Pastel Sticky Note Grid Board */}
      <div 
        className={`relative ${colors.boardBg} border rounded-[32px] p-6 pt-16 md:p-8 md:pt-20 min-h-[480px] shadow-inner-lg overflow-visible`}
        id="sticky-noteslist-wrapper"
        style={{
          boxShadow: 'inset 0 4px 20px 0 rgba(140, 120, 81, 0.04)'
        }}
      >
        <div className={`absolute top-5 left-6 flex items-center gap-1.5 text-[10px] font-mono tracking-[0.18em] ${colors.boardTitle} font-black select-none uppercase`}>
          <Heart className="w-3.5 h-3.5 fill-current opacity-30 text-current" />
          <span>XVII IMPRESSIVE BOARD</span>
        </div>

        {/* Dedicated spaced grid of sticky notes to prevent overlap */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 overflow-visible mt-4">
          <AnimatePresence>
          {wishes.map((wish) => (
            <motion.div
              layout
              key={wish.id}
              initial={{ scale: 0.8, opacity: 0, rotate: wish.rotation - 10 }}
              whileInView={{ scale: 1, opacity: 1, rotate: wish.rotation }}
              viewport={{ once: true, margin: "-20px" }}
              exit={{ scale: 0.8, opacity: 0, rotate: wish.rotation + 10 }}
              whileHover={{ 
                scale: 1.05, 
                rotate: 0,
                zIndex: 40,
                boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)'
              }}
              transition={{ type: "spring", stiffness: 220, damping: 20 }}
              style={{ originX: 0.5, originY: 0 }}
              className={`p-6 pt-9 rounded-sm border-t-[8px] border-b-sm border-x-xs shadow-md relative flex flex-col justify-between aspect-square overflow-hidden group select-none ${wish.colorClass}`}
              id={`sticky-note-${wish.id}`}
            >
              {/* Sticky Tape at the top center */}
              <div 
                className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1.5 w-16 h-5.5 bg-yellow-100/60 backdrop-blur-xs border-x border-b border-yellow-200/50 shadow-xs z-10 rotate-[-1deg]"
                style={{
                  clipPath: 'polygon(0% 0%, 100% 0%, 95% 100%, 5% 100%)'
                }}
              />

              {/* Pin design element */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
                <div className="w-3.5 h-3.5 rounded-full bg-rose-500 border border-white/60 shadow-md transform -translate-y-1" />
                <div className="w-[1.5px] h-2 bg-slate-300 transform -translate-y-1 opacity-70" />
              </div>

              {/* Handwritten content of the wish */}
              <div className="flex-1 flex items-center justify-center text-center mt-3 mb-4 overflow-y-auto custom-scrollbar">
                <p className={`font-handy ${getWishFontSizeClass(wish.text)} font-medium tracking-wide px-1 select-none`}>
                  "{wish.text}"
                </p>
              </div>

              {/* Sticky Note Footer with date and delete */}
              <div className="flex justify-between items-center z-10 pt-2 border-t border-black/5">
                <span className="text-[10px] font-mono opacity-60 tracking-wider font-semibold">
                  {wish.date}
                </span>
                
                {wish.isPermanent ? (
                  <span className="text-[9px] font-sans font-black text-rose-500 uppercase tracking-widest flex items-center gap-1 select-none">
                    <Heart className="w-3 h-3 fill-rose-500 text-rose-500 animate-pulse" />
                    <span>Future Sister 🌸</span>
                  </span>
                ) : (
                  <button
                    onClick={() => handleDeleteWish(wish.id)}
                    className="p-1 rounded-full text-black/40 hover:text-rose-600 hover:bg-black/5 transition-colors cursor-pointer opacity-0 group-hover:opacity-100 focus:opacity-100 text-xs flex items-center justify-center"
                    title="Remove wish"
                    id={`delete-wish-btn-${wish.id}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Empty State placeholder */}
        {wishes.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-20 text-center select-none" id="empty-wishlist-placeholder">
            <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center text-amber-500 mb-4 border border-amber-200 animate-pulse">
              <Plus className="w-7 h-7" />
            </div>
            <p className="font-serif text-lg font-bold text-amber-900/80">No Wishes Pinned Yet</p>
            <p className="text-xs text-amber-700/60 max-w-xs mt-1 font-sans">
              Write down your beautiful dreams or prayers above, then tap "Pin It" to stick them on your Sweet 17 Wishboard! 🌸
            </p>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
