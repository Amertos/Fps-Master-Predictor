'use client';

import React from 'react';
import { Cpu, Monitor, HardDrive, Trash2, ArrowRightLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SavedBuild } from '@/lib/types';
import { TIER_ICONS } from '@/lib/tier-icons';


interface BuildCardProps {
  build: SavedBuild;
  isComparing: boolean;
  canCompare: boolean;
  onDelete: (id: number) => void;
  onToggleCompare: (build: SavedBuild) => void;
}

export function BuildCard({ build, isComparing, canCompare, onDelete, onToggleCompare }: BuildCardProps) {
  const TierIcon = TIER_ICONS[build.tier.name];
  const compareDisabled = !isComparing && !canCompare;

  return (
    <article
      className={cn(
        'group relative rounded-xl border bg-black/40 p-5 transition-colors',
        isComparing ? 'border-[#00D1FF]' : 'border-white/5 hover:border-white/10',
      )}
      aria-label={`Konfiguracija: ${build.cpu}, ${build.gpu}, ${build.fps} FPS`}
    >
      {/* Compare toggle */}
      <button
        onClick={() => onToggleCompare(build)}
        disabled={compareDisabled}
        title={compareDisabled ? 'Možeš porediti samo 2 konfiguracije' : 'Uporedi'}
        className={cn(
          'absolute right-12 top-4 transition-opacity disabled:cursor-not-allowed',
          isComparing
            ? 'text-[#00D1FF] opacity-100'
            : 'text-gray-500 opacity-0 hover:text-[#00D1FF] group-hover:opacity-100',
        )}
        aria-pressed={isComparing}
        aria-label="Dugme za upoređivanje"
      >
        <ArrowRightLeft className="h-4 w-4" />
      </button>

      {/* Delete */}
      <button
        onClick={() => onDelete(build.id)}
        title="Obriši konfiguraciju"
        className="absolute right-4 top-4 text-gray-500 opacity-0 transition-opacity hover:text-red-500 group-hover:opacity-100"
        aria-label="Obriši konfiguraciju"
      >
        <Trash2 className="h-4 w-4" />
      </button>

      {/* FPS header */}
      <div className="mb-4 flex items-start justify-between">
        <div>
          <div className="text-3xl font-black tracking-tighter text-[#00FF41]">
            {build.fps} <span className="text-sm font-bold text-gray-500">FPS</span>
          </div>
          <div className="mt-1 text-xs text-gray-400">
            {build.game} ({build.res} {build.preset})
          </div>
        </div>
        <div className={cn('flex items-center gap-1 rounded bg-black/50 border border-white/5 px-2 py-1 text-[10px]', build.tier.colorClass)}>
          <TierIcon className="h-3 w-3" aria-hidden="true" />
          {build.tier.name}
        </div>
      </div>

      {/* Specs */}
      <dl className="space-y-2 rounded-lg bg-black/20 p-3 text-xs text-gray-300">
        <div className="flex items-center gap-2">
          <Cpu className="h-3.5 w-3.5 text-gray-500" aria-hidden="true" />
          <dt className="sr-only">CPU</dt>
          <dd className="truncate">{build.cpu}</dd>
        </div>
        <div className="flex items-center gap-2">
          <Monitor className="h-3.5 w-3.5 text-gray-500" aria-hidden="true" />
          <dt className="sr-only">GPU</dt>
          <dd className="truncate">{build.gpu}</dd>
        </div>
        <div className="flex items-center gap-2">
          <HardDrive className="h-3.5 w-3.5 text-gray-500" aria-hidden="true" />
          <dt className="sr-only">RAM</dt>
          <dd>{build.ram}</dd>
        </div>

        {(build.rt || build.upscaling) && (
          <div className="mt-2 flex flex-wrap gap-2 border-t border-white/5 pt-2">
            {build.rt && (
              <span className="rounded border border-[#00FF41]/20 bg-[#00FF41]/10 px-2 py-0.5 text-[10px] text-[#00FF41]">
                Ray Tracing
              </span>
            )}
            {build.upscaling && (
              <span className="rounded border border-[#00D1FF]/20 bg-[#00D1FF]/10 px-2 py-0.5 text-[10px] text-[#00D1FF]">
                DLSS/FSR
              </span>
            )}
          </div>
        )}
      </dl>
    </article>
  );
}
