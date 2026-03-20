'use client';

import { cn } from '@/lib/utils';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  accentColor?: string;
  id?: string;
}

export function Toggle({ checked, onChange, label, accentColor = '#00FF41', id }: ToggleProps) {
  const toggleId = id ?? `toggle-${label.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <label
      htmlFor={toggleId}
      className="group flex cursor-pointer items-center justify-between"
    >
      <span className="text-sm text-gray-300 transition-colors group-hover:text-white">{label}</span>

      <div className="relative">
        <input
          id={toggleId}
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          aria-checked={checked}
        />
        <div
          className={cn(
            'block h-6 w-10 rounded-full transition-colors',
            checked ? 'opacity-100' : 'bg-gray-700',
          )}
          style={checked ? { backgroundColor: accentColor } : undefined}
        />
        <div
          className={cn(
            'absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-transform',
            checked && 'translate-x-4',
          )}
        />
      </div>
    </label>
  );
}
