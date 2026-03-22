'use client';

import { Monitor } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import type { CompareDataPoint } from '@/lib/types';


interface CompareChartProps {
  title: string;
  data: CompareDataPoint[];
  accentColor?: 'green' | 'cyan' | 'purple';
  delay?: number;
}

const ACCENT_CLASSES: Record<NonNullable<CompareChartProps['accentColor']>, { active: string; bar: string }> = {
  green:  { active: 'text-[#00FF41] font-bold', bar: 'bg-[#00FF41]' },
  cyan:   { active: 'text-[#00D1FF] font-bold', bar: 'bg-[#00D1FF]' },
  purple: { active: 'text-purple-400 font-bold', bar: 'bg-purple-400' },
};

export function CompareChart({ title, data, accentColor = 'green', delay = 0 }: CompareChartProps) {
  const { active: activeText, bar: activeBar } = ACCENT_CLASSES[accentColor];
  // Dynamic scale: bar widths are relative to the highest FPS in the current dataset
  const maxFps = Math.max(...data.map((d) => d.fps), 1);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className="rounded-2xl border border-white/5 bg-[#141414] p-6 shadow-xl"
    >
      <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-gray-300">
        <Monitor className="h-4 w-4" aria-hidden="true" />
        {title}
      </h3>

      <div className="space-y-3" role="list" aria-label={title}>
        {data.map((point) => {
          const isActive = !!point.isCurrent;
          const barWidth = Math.round((point.fps / maxFps) * 100);

          return (
            <div key={point.name} className="group flex items-center justify-between" role="listitem">
              <span
                className={cn(
                  'text-sm',
                  isActive ? activeText : 'text-gray-400 group-hover:text-gray-200',
                )}
              >
                {point.name}
              </span>

              <div className="flex items-center gap-3">
                <div className="h-1.5 w-24 overflow-hidden rounded-full bg-black">
                  <div
                    className={cn('h-full', isActive ? activeBar : 'bg-gray-600')}
                    style={{ width: `${barWidth}%` }}
                    role="presentation"
                  />
                </div>
                <span
                  className={cn(
                    'w-10 text-right font-mono text-sm',
                    isActive ? activeText : 'text-gray-300',
                  )}
                >
                  {point.fps}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
