'use client';

import { motion } from 'motion/react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

interface OptimizationTipsProps {
  tips: string[];
}

export function OptimizationTips({ tips }: OptimizationTipsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="rounded-2xl border border-white/5 bg-[#141414] p-6 shadow-xl"
    >
      <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-gray-300">
        <AlertTriangle className="h-4 w-4 text-yellow-500" aria-hidden="true" />
        Saveti za Optimizaciju
      </h3>

      <ul className="space-y-3" aria-label="Preporuke za poboljšanje performansi">
        {tips.map((tip) => (
          <li
            key={tip}
            className="flex items-start gap-3 rounded-lg border border-white/5 bg-black/30 p-3"
          >
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#00FF41]" aria-hidden="true" />
            <span className="text-sm leading-relaxed text-gray-300">{tip}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
