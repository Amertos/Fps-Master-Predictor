'use client';

import { motion } from 'motion/react';
import { Settings } from 'lucide-react';
import type { BottleneckResult } from '@/lib/types';

interface BottleneckCardProps {
  bottleneck: BottleneckResult;
}

const DESCRIPTION: Record<BottleneckResult['type'], string> = {
  CPU: 'Procesor ne može dovoljno brzo da isprati grafičku kartu.',
  GPU: 'Grafička karta radi na 100% i ograničava procesor.',
  Balanced: 'Sistem je dobro balansiran, komponente rade usklađeno.',
};

export function BottleneckCard({ bottleneck }: BottleneckCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
      className="rounded-2xl border border-white/5 bg-[#141414] p-6 shadow-xl"
    >
      <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-gray-300">
        <Settings className="h-4 w-4" aria-hidden="true" /> Bottleneck Analiza
      </h3>

      <div className="space-y-4">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-2xl font-bold text-white">{bottleneck.type}</p>
            <p className="mt-1 text-xs text-gray-500">Glavno ograničenje</p>
          </div>
          <div className={`rounded-md border border-white/5 bg-black/50 px-2.5 py-1 text-sm font-bold ${bottleneck.colorClass}`}>
            {bottleneck.severity}
          </div>
        </div>

        <div className="relative h-2 overflow-hidden rounded-full bg-black">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${bottleneck.percent}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className={`absolute left-0 top-0 h-full ${bottleneck.barClass}`}
            role="progressbar"
            aria-label="Procenat uskog grla"
            aria-valuenow={bottleneck.percent}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>

        <p className="text-xs leading-relaxed text-gray-500">
          {DESCRIPTION[bottleneck.type]}
        </p>
      </div>
    </motion.div>
  );
}
