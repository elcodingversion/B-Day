/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles } from 'lucide-react';

interface WateringGameProps {
  onUnlock: () => void;
}

export default function WateringGame({ onUnlock }: WateringGameProps) {
  const [progress, setProgress] = useState(0);
  const [isWatering, setIsWatering] = useState(false);
  const [drops, setDrops] = useState<{ id: number; left: number }[]>([]);
  const [plantReaction, setPlantReaction] = useState("Sleeping peacefully...");

  const reactions = [
    "Hmm, standard soil is cozy...",
    "Ooh! That was refreshing!",
    "Sip sip... drinking deeply!",
    "I can feel the June warmth already!",
    "Almost there... dreaming of sweet 17!",
    "Wait, is that June 27th approaching?!",
    "Yes! Let's bloom in style!",
  ];

  const handleWater = () => {
    if (progress >= 100) return;

    setIsWatering(true);

    // Spawn 4 cascading water drop particles
    const newDrops = Array.from({ length: 4 }).map((_, i) => ({
      id: Date.now() + i,
      left: 35 + Math.random() * 30, // center span
    }));
    setDrops((prev) => [...prev, ...newDrops]);

    // Update progress
    setProgress((prev) => {
      const next = Math.min(100, prev + 15);
      if (next === 100) {
        setPlantReaction("✨ PERFECT BLOOM! ✨");
      } else {
        const index = Math.floor((next / 100) * reactions.length);
        setPlantReaction(reactions[index] || "Sip sip...");
      }
      return next;
    });

    // Reset watering animation trigger
    setTimeout(() => {
      setIsWatering(false);
      setDrops([]);
    }, 700);
  };

  // Determine stage based on progress
  const getStageCode = () => {
    if (progress === 0) return 'seed';
    if (progress < 30) return 'sprout';
    if (progress < 60) return 'stem';
    if (progress < 90) return 'bud';
    return 'bloom';
  };

  const currentStage = getStageCode();

  return (
    <div className="min-h-screen bg-balance-bg flex flex-col items-center justify-center p-6 text-center select-none overflow-hidden relative" id="garden-gate-container">
      
      {/* Background Floral Elements */}
      <div className="absolute top-[-50px] right-[-50px] opacity-15 pointer-events-none z-0">
        <svg width="400" height="400" viewBox="0 0 100 100">
          <path d="M50 50 Q70 10 90 50 T50 90 Q30 90 10 50 T50 10" fill="#d4a373" />
          <circle cx="50" cy="50" r="10" fill="#faedcd" />
        </svg>
      </div>
      <div className="absolute bottom-[-80px] left-[-80px] opacity-10 rotate-45 pointer-events-none z-0">
        <svg width="500" height="500" viewBox="0 0 100 100">
          <path d="M50 50 Q70 10 90 50 T50 90 Q30 90 10 50 T50 10" fill="#e9edc6" />
          <circle cx="50" cy="50" r="15" fill="#ccd5ae" />
        </svg>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-md w-full bg-white rounded-[36px] shadow-2xl border border-balance-border p-1.5 relative z-10"
        id="watering-card"
      >
        <div className="rounded-[32px] border-2 border-dashed border-balance-border/85 p-8 flex flex-col items-center justify-center">
          <span className="text-[10px] font-sans tracking-[0.25em] uppercase text-balance-gold font-bold block mb-2">
            Enchanted Garden Gates
          </span>
          <h1 className="text-3xl font-serif text-balance-dark font-extrabold leading-tight mb-2">
            Grow Nadindra's Bloom
          </h1>
          <p className="text-xs text-balance-muddy/80 font-sans max-w-sm mx-auto mb-8 leading-relaxed">
            The path forward is locked by an ancient seed. Gently tilt the brass can to water the pot and witness her 17th birthday bloom!
          </p>

          {/* The Garden Stage */}
          <div className="relative h-64 w-full flex items-center justify-center mb-6">
            
            {/* Watering Can Container */}
            <motion.div
              className="absolute top-2 right-12 cursor-pointer z-20 origin-bottom-left"
              animate={isWatering ? { rotate: -35, x: -10, y: 10 } : { rotate: 0, x: 0, y: 0 }}
              transition={{ type: "spring", stiffness: 100 }}
              onClick={handleWater}
            >
              {/* Hand-styled SVG Watering Can */}
              <svg width="70" height="42" viewBox="0 0 70 42" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-md">
                <path d="M50 32C50 37.5 42.5 40 32 40C21.5 40 14 37.5 14 32V18C14 12.5 21.5 10 32 10C42.5 10 50 12.5 50 18V32Z" fill="#8c7851" />
                <path d="M50 20H58C62 20 64 22 64 25C64 28 62 30 58 30H50" stroke="#705e3a" strokeWidth="4" />
                <path d="M14 26L3 18" stroke="#8c7851" strokeWidth="4" strokeLinecap="round" />
                <circle cx="3" cy="18" r="1.5" fill="#705e3a" />
              </svg>
            </motion.div>

            {/* Falling Water Drops */}
            <div className="absolute inset-x-0 top-18 bottom-12 pointer-events-none z-10">
              <AnimatePresence>
                {drops.map((drop) => (
                  <motion.span
                    key={drop.id}
                    initial={{ y: 0, opacity: 1, scale: 0.6 }}
                    animate={{ y: 140, opacity: 0, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, ease: "easeIn" }}
                    className="absolute w-2 h-3.5 bg-blue-300 rounded-full"
                    style={{ left: `${drop.left}%`, borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%' }}
                  />
                ))}
              </AnimatePresence>
            </div>

            {/* Plant Pots & Soil Visual */}
            <div className="absolute bottom-4 inset-x-0 flex flex-col items-center">
              
              {/* The Plant Stage Visualizer */}
              <div className="h-44 w-full flex items-end justify-center relative pb-3 overflow-visible">
                
                {/* STAGE 0: Seed */}
                {currentStage === 'seed' && (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex flex-col items-center relative mb-1"
                  >
                    <div className="w-4 h-5 bg-amber-800 rounded-full transform rotate-12 relative animate-bounce" style={{ borderBottomLeftRadius: '10%' }}>
                      <div className="absolute top-1 left-1.5 w-1 h-2 bg-yellow-400 rounded-full" />
                    </div>
                    <span className="text-[10px] text-amber-900/60 font-mono mt-2">Dormant Seed</span>
                  </motion.div>
                )}

                {/* STAGE 1: Sprout */}
                {currentStage === 'sprout' && (
                  <motion.div 
                    key="sprout"
                    initial={{ scale: 0.4, y: 10 }}
                    animate={{ scale: 1, y: 0 }}
                    className="flex flex-col items-center mb-1"
                  >
                    <svg width="24" height="40" viewBox="0 0 24 40" fill="none">
                      <path d="M12 40C12 40 12 30 15 24C18 18 19 12 19 12" stroke="#8c7851" strokeWidth="3" strokeLinecap="round" />
                      <path d="M10 24C4 21 2 15 2 15C2 15 9 14 13 18" stroke="#d48c8c" strokeWidth="2.5" strokeLinecap="round" />
                    </svg>
                  </motion.div>
                )}

                {/* STAGE 2: Stem & Leaves */}
                {currentStage === 'stem' && (
                  <motion.div 
                    key="stem"
                    initial={{ scale: 0.6, y: 10 }}
                    animate={{ scale: 1, y: 0 }}
                    className="flex flex-col items-center mb-1 animate-pulse"
                  >
                    <svg width="40" height="70" viewBox="0 0 40 70" fill="none">
                      <path d="M20 70C20 70 17 45 22 30C27 15 20 5 20 5" stroke="#8c7851" strokeWidth="4.5" />
                      <path d="M18 35C10 32 6 20 6 20C6 20 15 20 20 28" stroke="#d48c8c" strokeWidth="3" />
                      <path d="M22 25C30 22 34 10 34 10C34 10 27 12 22 20" stroke="#d48c8c" strokeWidth="3" />
                    </svg>
                  </motion.div>
                )}

                {/* STAGE 3: Growing Bud */}
                {currentStage === 'bud' && (
                  <motion.div 
                    key="bud"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className="flex flex-col items-center mb-1"
                  >
                    <svg width="50" height="90" viewBox="0 0 50 90" fill="none">
                      <path d="M25 90C25 90 22 55 24 35" stroke="#8c7851" strokeWidth="4.5" />
                      {/* Glowing Bud */}
                      <path d="M15 35C15 20 25 10 25 10C25 10 35 20 35 35C35 45 25 50 25 50C25 50 15 45 15 35Z" fill="#d48c8c" stroke="#8c7851" strokeWidth="2" />
                      <path d="M20 28C20 20 25 15 25 15C25 15 30 20 30 28" fill="#d48c8c" />
                      {/* Side Leaves */}
                      <path d="M24 55C14 52 10 40 10 40C10 40 19 40 24 48" stroke="#8c7851" strokeWidth="3" />
                    </svg>
                  </motion.div>
                )}

                {/* STAGE 4: Majestic Bloomed Rose */}
                {currentStage === 'bloom' && (
                  <motion.div 
                    key="bloom"
                    initial={{ scale: 0.4, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 120, damping: 10 }}
                    className="flex flex-col items-center mb-1 relative"
                  >
                    <div className="absolute -top-12 z-20">
                      <motion.div 
                        animate={{ scale: [0.95, 1.05, 0.95] }}
                        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                      >
                        {/* Fully bloomed decorative rose SVG layout */}
                        <svg width="90" height="90" viewBox="0 0 100 100" fill="none" className="filter drop-shadow-md">
                          {/* Outer petals */}
                          <circle cx="50" cy="50" r="38" fill="#e9cbd1" />
                          <path d="M50 10C42 10 34 16 34 26C34 37 50 48 50 48C50 48 66 37 66 26C66 16 58 10 50 10Z" fill="#d48c8c" />
                          <path d="M16 44C16 36 22 28 32 28C43 28 54 44 54 44C54 44 43 60 32 60C22 60 16 52 16 44Z" fill="#d48c8c" />
                          <path d="M84 44C84 36 78 28 68 28C57 28 46 44 46 44C46 44 57 60 68 60C78 60 84 52 84 44Z" fill="#d48c8c" />
                          <path d="M50 90C42 90 34 84 34 74C34 63 50 52 50 52C50 52 66 63 66 74C66 84 58 90 50 90Z" fill="#8c7851" />
                          {/* Center rose Swirl */}
                          <circle cx="50" cy="46" r="22" fill="#d48c8c" />
                          <circle cx="50" cy="46" r="14" fill="#a46b6b" />
                          <circle cx="50" cy="46" r="6" fill="#8c7851" />
                          <circle cx="48" cy="44" r="2" fill="#FFFFFF" opacity="0.6" />
                        </svg>
                      </motion.div>
                    </div>
                    {/* Stem and big romantic leaves */}
                    <svg width="60" height="96" viewBox="0 0 60 96" fill="none" className="z-10">
                      <path d="M30 96C30 96 28 55 30 35" stroke="#8c7851" strokeWidth="5" />
                      <path d="M29 55C16 52 11 38 11 38C11 38 22 38 29 47" fill="#8c7851" />
                      <path d="M31 45C44 42 49 28 49 28C49 28 38 28 31 37" fill="#8c7851" />
                    </svg>
                  </motion.div>
                )}

              </div>

              {/* Clay Pot */}
              <svg width="80" height="34" viewBox="0 0 80 34" fill="none" className="drop-shadow-sm">
                <path d="M4 2C4 1 5 0 6 0H74C75 0 76 1 76 2V6H4V2Z" fill="#a29074" />
                <path d="M8 6L14 30C14.5 32 16.5 34 18.5 34H61.5C63.5 34 65.5 32 66 30L72 6H8Z" fill="#8c7851" />
                <ellipse cx="40" cy="2" rx="34" ry="2" fill="#4a3a3a" />
              </svg>
            </div>

          </div>

          {/* Reaction Quote Display */}
          <div className="h-10 mb-6 flex items-center justify-center">
            <p className="text-xs font-serif italic text-balance-rose tracking-wide font-semibold">
              "{plantReaction}"
            </p>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-balance-bg rounded-full h-3.5 mb-8 p-0.5 overflow-hidden border border-balance-border">
            <motion.div 
              className="bg-gradient-to-r from-balance-gold to-balance-rose h-full rounded-full" 
              animate={{ width: `${progress}%` }}
              transition={{ ease: "easeOut", duration: 0.5 }}
            />
          </div>

          {/* Action button */}
          <AnimatePresence mode="wait">
            {progress < 100 ? (
              <motion.button
                key="water-btn"
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={handleWater}
                disabled={isWatering}
                whileTap={{ scale: 0.96 }}
                className="w-full py-4.5 bg-balance-dark hover:bg-balance-rose text-white text-[11px] font-sans font-bold uppercase tracking-[0.2em] rounded-full shadow-lg transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                id="water-game-pour-btn"
              >
                Water the Plant
              </motion.button>
            ) : (
              <motion.button
                key="unlock-btn"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={onUnlock}
                className="w-full py-4.5 bg-balance-dark hover:bg-balance-rose text-white text-[11px] font-sans font-extrabold uppercase tracking-[0.2em] rounded-full shadow-2xl ring-2 ring-balance-border transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer animate-pulse"
                id="water-game-unlock-btn"
              >
                <Sparkles className="w-4 h-4" />
                Enter Nadindra's World
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
