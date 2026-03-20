'use client';

import { motion } from 'motion/react';
import { Save, Share2 } from 'lucide-react';
import type { SystemTier } from '@/lib/types';

interface FpsDisplayProps {
  fps: number;
  gameName: string;
  resName: string;
  presetName: string;
  systemTier: SystemTier;
  onSave: () => void;
  onShare: () => void;
  TierIcon: React.ElementType;
}

export function FpsDisplay({
  fps,
  gameName,
  resName,
  presetName,
  systemTier,
  onSave,
  onShare,
  TierIcon,
}: FpsDisplayProps) {
  const fpsLow = Math.max(0, fps - 5);
  const fpsHigh = fps + 8;

  return (
    <motion.div
      key={`${fps}-${gameName}`}
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#1a1a1a] to-black p-8 shadow-2xl"
      aria-live="polite"
      aria-label={`Očekivane performanse: ${fpsLow} do ${fpsHigh} FPS`}
    >
      {/* decorative blob */}
      <div className="pointer-events-none absolute -mr-20 -mt-20 right-0 top-0 h-64 w-64 rounded-full bg-[#00FF41]/5 blur-3xl" />

      <div className="relative z-10 text-center">
        <div className="mb-2 flex items-start justify-between">
          <p className="text-sm font-medium uppercase tracking-wide text-gray-400">Očekivane Performanse</p>
          <div className={`flex items-center gap-1.5 rounded-full border border-white/10 bg-black/50 px-3 py-1 text-xs font-bold ${systemTier.colorClass}`}>
            <TierIcon className="h-3.5 w-3.5" aria-hidden="true" />
            {systemTier.name}
          </div>
        </div>

        <div className="mt-4 flex items-baseline justify-center gap-2">
          <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-5xl font-black tracking-tighter text-transparent md:text-7xl">
            {fpsLow}
          </span>
          <span className="text-3xl font-bold text-gray-500 md:text-4xl">-</span>
          <span className="bg-gradient-to-r from-[#00FF41] to-[#00D1FF] bg-clip-text text-5xl font-black tracking-tighter text-transparent md:text-7xl">
            {fpsHigh}
          </span>
          <span className="ml-2 text-xl font-bold text-gray-500 md:text-2xl">FPS</span>
        </div>

        <p className="mt-4 text-sm text-gray-500">
          Prosek za{' '}
          <span className="font-medium text-white">{gameName}</span>
          {' '}na{' '}
          <span className="font-medium text-white">{resName} {presetName}</span>
        </p>

        <div className="mt-8 flex justify-center gap-3">
          <button
            onClick={onSave}
            type="button"
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium transition-all hover:scale-105 hover:bg-white/10 active:scale-95"
          >
            <Save className="h-4 w-4" aria-hidden="true" /> Sačuvaj
          </button>
          <button
            onClick={onShare}
            type="button"
            className="flex items-center gap-2 rounded-xl border border-[#00FF41]/30 bg-[#00FF41]/10 px-5 py-2.5 text-sm font-medium text-[#00FF41] transition-all hover:scale-105 hover:bg-[#00FF41]/20 active:scale-95"
          >
            <Share2 className="h-4 w-4" aria-hidden="true" /> Podeli
          </button>
        </div>
      </div>
    </motion.div>
  );
}
