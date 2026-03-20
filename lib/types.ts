// ─── Core Data Types ──────────────────────────────────────────────────────────

export interface Game {
  id: string;
  name: string;
  baseFps: number;
}

export interface Cpu {
  id: string;
  name: string;
  score: number;
}

export interface Gpu {
  id: string;
  name: string;
  multiplier: number;
  score: number;
}

export interface RamCapacity {
  id: string;
  name: string;
  multiplier: number;
}

export interface RamType {
  id: string;
  name: string;
  multiplier: number;
}

export interface Resolution {
  id: string;
  name: string;
  multiplier: number;
}

export interface Preset {
  id: string;
  name: string;
  multiplier: number;
}

// ─── Derived / Computed Types ──────────────────────────────────────────────────

export type BottleneckType = 'CPU' | 'GPU' | 'Balanced';
export type BottleneckSeverity = 'High' | 'Slight' | 'None';

export interface BottleneckResult {
  type: BottleneckType;
  severity: BottleneckSeverity;
  colorClass: string;
  barClass: string;
  percent: number;
}

export type TierName = 'God Tier' | 'Enthusiast' | 'High-End' | 'Mid-Range' | 'Entry-Level' | 'Potato';

export interface SystemTier {
  name: TierName;
  colorClass: string;
}

export interface CompareDataPoint {
  name: string;
  fps: number;
  isCurrent?: boolean;
}

// ─── Build Types ───────────────────────────────────────────────────────────────

export interface SavedBuild {
  id: number;
  cpu: string;
  cpuScore: number;
  gpu: string;
  gpuMultiplier: number;
  ram: string;
  ramCapMultiplier: number;
  ramTypeMultiplier: number;
  game: string;
  fps: number;
  res: string;
  resMultiplier: number;
  preset: string;
  presetMultiplier: number;
  rt: boolean;
  upscaling: boolean;
  tier: SystemTier;
}

// ─── FPS Calculation Input ─────────────────────────────────────────────────────

export interface FpsCalculationParams {
  gameBaseFps: number;
  gpuMultiplier: number;
  cpuScore: number;
  ramCapMultiplier: number;
  ramTypeMultiplier: number;
  resMultiplier: number;
  presetMultiplier: number;
  rayTracingEnabled: boolean;
  upscalingEnabled: boolean;
  gpuName: string;
}
