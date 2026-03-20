'use client';

import { motion } from 'motion/react';
import { CheckCircle2 } from 'lucide-react';

interface ToastProps {
  message: string;
}

export function Toast({ message }: ToastProps) {
  if (!message) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-[#00FF41] px-5 py-3 font-bold text-black shadow-[0_0_30px_rgba(0,255,65,0.3)]"
      role="status"
      aria-live="polite"
    >
      <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
      {message}
    </motion.div>
  );
}
