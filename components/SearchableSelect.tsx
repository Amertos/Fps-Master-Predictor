'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Option {
  id: string;
  name: string;
}

interface SearchableSelectProps<T extends Option> {
  options: T[];
  value: string;
  onChange: (id: string) => void;
  label: string;
  icon?: React.ElementType;
  id?: string;
}

export function SearchableSelect<T extends Option>({
  options,
  value,
  onChange,
  label,
  icon: Icon,
  id,
}: SearchableSelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filtered = options.filter((o) => o.name.toLowerCase().includes(search.toLowerCase()));
  const selected = options.find((o) => o.id === value);

  const selectId = id ?? `select-${label.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className="relative" ref={dropdownRef}>
      <label htmlFor={selectId} className="mb-1.5 flex items-center gap-2 text-sm font-medium text-gray-400">
        {Icon && <Icon className="h-4 w-4" aria-hidden="true" />}
        {label}
      </label>

      <button
        id={selectId}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-full cursor-pointer items-center justify-between rounded-lg border border-white/10 bg-black px-4 py-2.5 text-white transition-colors hover:border-[#00FF41]/50 focus:outline-none focus:ring-1 focus:ring-[#00FF41]"
      >
        <span className="truncate">{selected?.name ?? 'Izaberi...'}</span>
        <ChevronDown
          className={cn('h-4 w-4 text-gray-400 transition-transform', isOpen && 'rotate-180')}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <div
          role="listbox"
          aria-label={label}
          className="absolute z-50 mt-2 w-full overflow-hidden rounded-lg border border-white/10 bg-[#1a1a1a] shadow-2xl"
        >
          <div className="flex items-center gap-2 border-b border-white/10 bg-black/50 p-2">
            <Search className="h-4 w-4 text-gray-400" aria-hidden="true" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Pretraži..."
              aria-label={`Pretraži ${label}`}
              className="w-full bg-transparent text-sm text-white focus:outline-none"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          <div className="custom-scrollbar max-h-60 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="p-3 text-center text-sm text-gray-500">Nema rezultata</div>
            ) : (
              filtered.map((option) => (
                <div
                  key={option.id}
                  role="option"
                  aria-selected={value === option.id}
                  onClick={() => {
                    onChange(option.id);
                    setIsOpen(false);
                    setSearch('');
                  }}
                  className={cn(
                    'flex cursor-pointer items-center justify-between px-4 py-2.5 text-sm transition-colors hover:bg-white/5',
                    value === option.id ? 'bg-[#00FF41]/10 text-[#00FF41]' : 'text-gray-300',
                  )}
                >
                  <span className="truncate">{option.name}</span>
                  {value === option.id && <Check className="h-4 w-4 shrink-0" aria-hidden="true" />}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
