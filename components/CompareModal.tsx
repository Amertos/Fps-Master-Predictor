'use client';

import React from 'react';
import { motion } from 'motion/react';
import { X, ArrowRightLeft, Cpu, Monitor, HardDrive } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SavedBuild, TierName } from '@/lib/types';
import { Crown, Trophy, Rocket, Swords, Star, Snail } from 'lucide-react';

const TIER_ICONS: Record<TierName, React.ElementType> = {
  'God Tier':    Crown,
  'Enthusiast':  Trophy,
  'High-End':    Rocket,
  'Mid-Range':   Swords,
  'Entry-Level': Star,
  'Potato':      Snail,
};

interface CompareModalProps {
  builds: [SavedBuild, SavedBuild];
  onClose: () => void;
}

const SLOT_COLORS = ['#00FF41', '#00D1FF'] as const;
const SLOT_GRADIENT = [
  'from-[#00FF41] to-emerald-600',
  'from-[#00D1FF] to-blue-600',
] as const;

function PerformanceDiff({ a, b }: { a: number; b: number }) {
  const diff = a - b;
  if (diff === 0) {
    return <div className="text-lg text-gray-300">Konfiguracije daju identičan FPS.</div>;
  }

  const absDiff = Math.abs(diff);
  const percent = Math.round((absDiff / Math.min(a, b)) * 100);
  const betterIdx = diff > 0 ? 1 : 2;
  const colorClass = diff > 0 ? 'text-[#00FF41]' : 'text-[#00D1FF]';

  return (
    <div>
      <div className="mb-2 text-lg text-white">
        Konfiguracija {betterIdx} je brža za{' '}
        <span className={cn('font-bold', colorClass)}>{percent}%</span>{' '}
        ({absDiff} FPS)
      </div>
      <div className="text-sm text-gray-400">u odnosu na drugu konfiguraciju</div>
    </div>
  );
}

export function CompareModal({ builds, onClose }: CompareModalProps) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Poređenje konfiguracija"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="custom-scrollbar relative w-full max-w-4xl overflow-y-auto rounded-2xl border border-white/10 bg-[#141414] shadow-2xl"
        style={{ maxHeight: '90vh' }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full bg-black/50 p-2 text-gray-400 transition-colors hover:text-white"
          aria-label="Zatvori poređenje"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="sticky top-0 z-[5] border-b border-white/10 bg-[#141414]/90 p-6 backdrop-blur-md">
          <h2 className="flex items-center gap-2 text-2xl font-bold text-white">
            <ArrowRightLeft className="h-6 w-6 text-[#00D1FF]" aria-hidden="true" />
            Upoređivanje Konfiguracija
          </h2>
        </div>

        {/* Build columns */}
        <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">
          {builds.map((build, idx) => {
            const TierIcon = TIER_ICONS[build.tier.name];
            const accentColor = SLOT_COLORS[idx];
            const gradient = SLOT_GRADIENT[idx];

            return (
              <div key={build.id} className="relative overflow-hidden rounded-xl border border-white/5 bg-black/40 p-6">
                {/* top accent bar */}
                <div className="absolute left-0 top-0 h-1 w-full" style={{ backgroundColor: accentColor }} />

                <div className="mb-6 text-center">
                  <div className="mb-1 text-sm text-gray-400">Konfiguracija {idx + 1}</div>
                  <div className={cn('bg-gradient-to-r bg-clip-text text-5xl font-black text-transparent', gradient)}>
                    {build.fps}{' '}
                    <span className="text-xl text-gray-500">FPS</span>
                  </div>
                  <div className="mt-1 text-sm font-medium text-white">{build.game}</div>
                  <div className="text-xs text-gray-500">{build.res} • {build.preset}</div>
                </div>

                <dl className="space-y-4">
                  {([
                    { icon: Cpu,       term: 'CPU', value: build.cpu },
                    { icon: Monitor,   term: 'GPU', value: build.gpu },
                    { icon: HardDrive, term: 'RAM', value: build.ram },
                  ] as const).map(({ icon: Icon, term, value }) => (
                    <div key={term} className="flex items-center justify-between border-b border-white/5 pb-2">
                      <dt className="flex items-center gap-2 text-sm text-gray-400">
                        <Icon className="h-4 w-4" aria-hidden="true" /> {term}
                      </dt>
                      <dd className="text-right text-sm font-medium text-white">{value}</dd>
                    </div>
                  ))}

                  <div className="flex items-center justify-between border-b border-white/5 pb-2">
                    <dt className="text-sm text-gray-400">Klasa</dt>
                    <dd className={cn('flex items-center gap-1 rounded border border-white/5 bg-black/50 px-2 py-1 text-xs', build.tier.colorClass)}>
                      <TierIcon className="h-3 w-3" aria-hidden="true" />
                      {build.tier.name}
                    </dd>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <dt className="text-sm text-gray-400">Dodaci</dt>
                    <dd className="flex gap-2">
                      {build.rt ? (
                        <span className="rounded border border-[#00FF41]/20 bg-[#00FF41]/10 px-2 py-0.5 text-[10px] text-[#00FF41]">RTX</span>
                      ) : (
                        <span className="rounded border border-gray-700 bg-gray-800 px-2 py-0.5 text-[10px] text-gray-500">RTX Off</span>
                      )}
                      {build.upscaling ? (
                        <span className="rounded border border-[#00D1FF]/20 bg-[#00D1FF]/10 px-2 py-0.5 text-[10px] text-[#00D1FF]">Upscaling</span>
                      ) : (
                        <span className="rounded border border-gray-700 bg-gray-800 px-2 py-0.5 text-[10px] text-gray-500">Native</span>
                      )}
                    </dd>
                  </div>
                </dl>
              </div>
            );
          })}
        </div>

        {/* Diff footer */}
        <div className="border-t border-white/10 bg-black/60 p-6 text-center">
          <PerformanceDiff a={builds[0].fps} b={builds[1].fps} />
        </div>
      </motion.div>
    </div>
  );
}
