/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Heart, BookOpen, Gift, Trophy, Lock, Unlock, X, CheckCircle } from 'lucide-react';
import WateringGame from './components/WateringGame';
import MemoryBook from './components/MemoryBook';
import WishlistBoard from './components/WishlistBoard';
import BlossomBox from './components/BlossomBox';
import AudioPlayer from './components/AudioPlayer';
import FallingPetals from './components/FallingPetals';

type ThemeColor = 'romantic-pink' | 'lavender-dream' | 'peach-blossom';

export default function App() {
  const [unlocked, setUnlocked] = useState(false);
  const [activeTab, setActiveTab] = useState<'story' | 'wishlist' | 'gift'>('story');
  const [theme, setTheme] = useState<ThemeColor>('romantic-pink');
  const [isAdmin, setIsAdmin] = useState<boolean>(() => localStorage.getItem("nadindra_is_admin") === "true");
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminCode, setAdminCode] = useState("");
  const [adminError, setAdminError] = useState("");
  const [adminNotification, setAdminNotification] = useState<string | null>(null);

  useEffect(() => {
    if (adminNotification) {
      const timer = setTimeout(() => {
        setAdminNotification(null);
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [adminNotification]);

  const handleAdminLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = adminCode.trim();
    if (cleanCode === '250408') {
      setIsAdmin(true);
      localStorage.setItem('nadindra_is_admin', 'true');
      setShowAdminModal(false);
      setAdminCode("");
      setAdminError("");
      setAdminNotification("✨ Admin Mode active. You can now change story photos! ✨");
    } else {
      setAdminError("Incorrect code. Please try again! 🌸");
    }
  };

  const handleAdminLoginClick = () => {
    setAdminError("");
    setAdminCode("");
    setShowAdminModal(true);
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    localStorage.setItem('nadindra_is_admin', 'false');
    setAdminNotification("🌸 Admin Mode dinonaktifkan. Sekarang halaman kembali ke mode display biasa untuk Nadindra. 🌸");
  };

  // Restore unlocked garden gate state from sessionStorage so she doesn't have to keep watering within the same session
  useEffect(() => {
    const isUnlocked = sessionStorage.getItem("nadindra_unlocked");
    if (isUnlocked === "true") {
      setUnlocked(true);
    }
  }, []);

  const handleUnlock = () => {
    sessionStorage.setItem("nadindra_unlocked", "true");
    setUnlocked(true);
  };

  // Background and styling based on theme choice
  const getThemeBackgroundStyles = () => {
    switch (theme) {
      case 'lavender-dream':
        return 'from-balance-bg via-[#f4eefc] to-balance-bg text-balance-dark';
      case 'peach-blossom':
        return 'from-balance-bg via-[#fdf5f0] to-balance-bg text-balance-dark';
      default: // romantic-pink
        return 'from-balance-bg via-[#fcf1f1] to-balance-bg text-balance-dark';
    }
  };

  const getThemeTabTextStyles = (tab: 'story' | 'wishlist' | 'gift') => {
    const isActive = activeTab === tab;
    if (isActive) {
      switch (theme) {
        case 'lavender-dream':
          return 'bg-purple-700 text-white shadow-xl ring-2 ring-purple-100';
        case 'peach-blossom':
          return 'bg-amber-700 text-white shadow-xl ring-2 ring-amber-100';
        default:
          return 'bg-balance-rose text-white shadow-xl ring-2 ring-pink-100';
      }
    } else {
      return 'text-balance-gold hover:text-balance-dark hover:bg-balance-border/20';
    }
  };

  return (
    <div className="min-h-screen relative font-sans overflow-x-hidden bg-balance-bg transition-colors duration-1000">
      
      {/* Fall-back elements & Background Canvas */}
      <FallingPetals />
      <AudioPlayer isAdmin={isAdmin} />

      <AnimatePresence mode="wait">
        {!unlocked ? (
          <motion.div
            key="watering-initializer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full"
          >
            <WateringGame onUnlock={handleUnlock} />
          </motion.div>
        ) : (
          <motion.div
            key="birthday-core"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className={`min-h-screen bg-gradient-to-b ${getThemeBackgroundStyles()} Transition-colors duration-1000 pb-20 relative`}
            id="birthday-app-core-wrapper"
          >
            
            {/* Background Floral Elements removed as requested */}
            
            {/* Enchanted Header */}
            <header className="pt-24 pb-12 px-4 text-center max-w-2xl mx-auto select-none relative overflow-visible z-10" id="app-main-header">
              <div className="relative inline-block mb-3">
                <span className="text-[130px] md:text-[180px] font-bold leading-none opacity-5 absolute -top-16 left-1/2 -translate-x-1/2 pointer-events-none text-balance-gold">17</span>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-balance-dark leading-[1.1] relative z-10">
                  Happy Birthday,<br/>
                  <span className="italic text-balance-rose">Nadindra.</span>
                </h1>
              </div>
              <p className="text-xs md:text-sm tracking-[0.25em] font-sans uppercase font-bold text-balance-gold opacity-85 mt-4">
                Blooming beautifully into Chapter 17 on June 27th
              </p>

              {/* Decorative horizontal dividers */}
              <div className="mt-6 flex justify-center items-center gap-4">
                <div className="h-[1px] w-12 bg-balance-gold opacity-30"></div>
                <span className="text-xs text-balance-rose">🌸</span>
                <div className="h-[1px] w-12 bg-balance-gold opacity-30"></div>
              </div>
            </header>

            {/* Aesthetic Top Navigation Bar Tabs */}
            <nav className="max-w-md mx-auto px-4 mb-10 select-none relative z-10" id="app-navigation-bar">
              <div className="bg-white rounded-[24px] border border-balance-border p-1.5 shadow-xl flex justify-between gap-1">
                
                {/* Story Tab */}
                <button
                  onClick={() => setActiveTab('story')}
                  className={`flex-1 py-3 text-[10px] md:text-[11.5px] font-sans font-extrabold uppercase tracking-[0.16em] rounded-[18px] cursor-pointer transition-all duration-300 flex items-center justify-center gap-1.5 ${getThemeTabTextStyles('story')}`}
                  id="tab-story-btn"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  Story chapters
                </button>

                {/* 17 Wishes Tab */}
                <button
                  onClick={() => setActiveTab('wishlist')}
                  className={`flex-1 py-3 text-[10px] md:text-[11.5px] font-sans font-extrabold uppercase tracking-[0.16em] rounded-[18px] cursor-pointer transition-all duration-300 flex items-center justify-center gap-1.5 ${getThemeTabTextStyles('wishlist')}`}
                  id="tab-wishlist-btn"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  17 Wishes
                </button>

                {/* Gift Tab */}
                <button
                  onClick={() => setActiveTab('gift')}
                  className={`flex-1 py-3 text-[10px] md:text-[11.5px] font-sans font-extrabold uppercase tracking-[0.16em] rounded-[18px] cursor-pointer transition-all duration-300 flex items-center justify-center gap-1.5 ${getThemeTabTextStyles('gift')}`}
                  id="tab-gift-btn"
                >
                  <Gift className="w-3.5 h-3.5" />
                  Gift Box
                </button>

              </div>
            </nav>

            {/* App Sections Body rendering with slide animations */}
            <main className="relative z-20 min-h-[400px]">
              <AnimatePresence mode="wait">
                {activeTab === 'story' && (
                  <motion.div
                    key="tab-story-content"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.5 }}
                    id="section-story-chapters"
                  >
                    <MemoryBook isAdmin={isAdmin} />
                  </motion.div>
                )}

                {activeTab === 'wishlist' && (
                  <motion.div
                    key="tab-wishlist-content"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.5 }}
                    id="section-wishlist-board"
                  >
                    <WishlistBoard theme={theme} />
                  </motion.div>
                )}

                {activeTab === 'gift' && (
                  <motion.div
                    key="tab-gift-content"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.5 }}
                    id="section-blossom-box"
                  >
                    <BlossomBox isAdmin={isAdmin} />
                  </motion.div>
                )}
              </AnimatePresence>
            </main>

            {/* Custom footer element */}
            <footer className="mt-16 text-center select-none text-[10px] font-mono text-slate-400">
              <p>Designed with meticulous care and pure affection for Nadindra • From Helma</p>
              <p className="mt-1">© 2026 • Chapter XVII • Happiest Birthday on June 27th</p>
              <div className="mt-3 flex justify-center gap-2 items-center">
                {isAdmin ? (
                  <button
                    onClick={handleAdminLogout}
                    className="text-pink-500 hover:underline cursor-pointer flex items-center justify-center gap-1 bg-pink-50/50 px-2 py-0.5 rounded-full border border-pink-100 font-sans font-bold"
                  >
                    <span>🔓 Admin Mode Active (Helma) - Logout</span>
                  </button>
                ) : (
                  <button
                    onClick={handleAdminLoginClick}
                    className="hover:text-amber-500 hover:underline cursor-pointer flex items-center gap-0.5 font-sans"
                  >
                    <span>🔒 Admin Access</span>
                  </button>
                )}
              </div>
            </footer>

          </motion.div>
        )}
      </AnimatePresence>

      {/* Admin success/fail notification toast */}
      <AnimatePresence>
        {adminNotification && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 max-w-sm w-[90%] bg-pink-600/95 backdrop-blur-md text-white rounded-2xl shadow-2xl p-4 border border-pink-400/30 flex items-start gap-3"
            id="admin-toast"
          >
            <CheckCircle className="w-5 h-5 shrink-0 text-amber-200 mt-0.5" />
            <div className="flex-1 text-xs font-sans leading-relaxed">
              {adminNotification}
            </div>
            <button 
              onClick={() => setAdminNotification(null)}
              className="text-white/70 hover:text-white shrink-0 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Admin Login Modal overlay */}
      <AnimatePresence>
        {showAdminModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAdminModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white border border-balance-border z-10 rounded-3xl w-full max-w-sm p-6 shadow-2xl relative select-none overflow-hidden"
              id="admin-login-modal"
            >
              <button
                onClick={() => setShowAdminModal(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                id="close-admin-modal"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex flex-col items-center text-center mt-2 mb-6">
                <div className="w-12 h-12 rounded-full bg-pink-50 flex items-center justify-center text-pink-500 mb-3 border border-pink-100">
                  <Lock className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-lg font-bold text-slate-800">Admin Access Mode</h3>
                <p className="text-xs text-slate-500 mt-1 font-sans">
                  Enter the secret code to enable editing.
                </p>
              </div>

              <form onSubmit={handleAdminLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-mono tracking-wider text-slate-400 uppercase mb-1.5">
                    Secret Code
                  </label>
                  <input
                    type="password"
                    placeholder="Masukkan kode rahasia..."
                    value={adminCode}
                    onChange={(e) => {
                      setAdminCode(e.target.value);
                      if (adminError) setAdminError("");
                    }}
                    autoFocus
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-400 text-sm font-sans text-slate-800 placeholder:text-slate-400 bg-slate-50"
                  />
                </div>

                {adminError && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs text-rose-500 font-sans italic leading-tight"
                  >
                    🌸 {adminError}
                  </motion.p>
                )}

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-2xl py-2.5 font-sans font-bold text-xs uppercase tracking-wider shadow-lg shadow-pink-500/20 hover:shadow-xl hover:shadow-pink-500/30 transition-all duration-300 cursor-pointer"
                >
                  Verify Access
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
