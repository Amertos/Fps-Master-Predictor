/**
 * Centralized tier icon map.
 * Previously duplicated in page.tsx, BuildCard.tsx and CompareModal.tsx — now a single source of truth.
 */

import { Crown, Trophy, Rocket, Swords, Star, Snail } from 'lucide-react';
import type { TierName } from './types';
import type React from 'react';

export const TIER_ICONS: Record<TierName, React.ElementType> = {
  'God Tier':    Crown,
  'Enthusiast':  Trophy,
  'High-End':    Rocket,
  'Mid-Range':   Swords,
  'Entry-Level': Star,
  'Potato':      Snail,
};
