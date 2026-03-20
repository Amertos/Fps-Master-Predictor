'use client';

import { useState, useCallback, useEffect } from 'react';
import type { SavedBuild } from '@/lib/types';
import { loadBuildsFromStorage, saveBuildsToStorage } from '@/lib/fps-engine';

interface UseBuildReturn {
  savedBuilds: SavedBuild[];
  comparingBuilds: SavedBuild[];
  saveBuild: (build: Omit<SavedBuild, 'id'>) => void;
  deleteBuild: (id: number) => void;
  toggleCompare: (build: SavedBuild) => void;
  clearCompare: () => void;
  canAddToCompare: boolean;
}

export function useBuilds(): UseBuildReturn {
  const [savedBuilds, setSavedBuilds] = useState<SavedBuild[]>([]);
  const [comparingBuilds, setComparingBuilds] = useState<SavedBuild[]>([]);

  useEffect(() => {
    setSavedBuilds(loadBuildsFromStorage());
  }, []);

  const saveBuild = useCallback((buildData: Omit<SavedBuild, 'id'>) => {
    const newBuild: SavedBuild = { id: Date.now(), ...buildData };
    setSavedBuilds((prev) => {
      const updated = [newBuild, ...prev];
      saveBuildsToStorage(updated);
      return updated;
    });
  }, []);

  const deleteBuild = useCallback((id: number) => {
    setSavedBuilds((prev) => {
      const updated = prev.filter((b) => b.id !== id);
      saveBuildsToStorage(updated);
      return updated;
    });
    setComparingBuilds((prev) => prev.filter((b) => b.id !== id));
  }, []);

  const toggleCompare = useCallback((build: SavedBuild) => {
    setComparingBuilds((prev) => {
      const isAlreadyIn = prev.some((b) => b.id === build.id);
      if (isAlreadyIn) return prev.filter((b) => b.id !== build.id);
      if (prev.length >= 2) return prev; // silently ignore — caller should check canAddToCompare
      return [...prev, build];
    });
  }, []);

  const clearCompare = useCallback(() => {
    setComparingBuilds([]);
  }, []);

  const canAddToCompare = comparingBuilds.length < 2;

  return { savedBuilds, comparingBuilds, saveBuild, deleteBuild, toggleCompare, clearCompare, canAddToCompare };
}
