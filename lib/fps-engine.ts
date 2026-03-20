/**
 * FPS Engine — Pure stateless calculation functions.
 * No React, no side effects. Fully testable in isolation.
 */

import type {
  FpsCalculationParams,
  BottleneckResult,
  SystemTier,
  SavedBuild,
  Cpu,
  Gpu,
  RamCapacity,
  RamType,
  Resolution,
  Preset,
} from './types';

// ─── Constants ─────────────────────────────────────────────────────────────────

const RT_PENALTY_NVIDIA = 0.75;
const RT_PENALTY_AMD = 0.60;
const RT_PENALTY_OTHER = 0.50;

const UPSCALING_BOOST = 1.35;

const BOTTLENECK_CPU_HIGH_THRESHOLD = 0.7;
const BOTTLENECK_CPU_SLIGHT_THRESHOLD = 0.9;
const BOTTLENECK_GPU_HIGH_THRESHOLD = 1.5;
const BOTTLENECK_GPU_SLIGHT_THRESHOLD = 1.2;
const BOTTLENECK_MAX_CPU_PENALTY = 0.4;

const TIER_GOD_SCORE = 6.0;
const TIER_ENTHUSIAST_SCORE = 4.0;
const TIER_HIGH_END_SCORE = 2.0;
const TIER_MID_RANGE_SCORE = 1.0;
const TIER_ENTRY_LEVEL_SCORE = 0.5;

const MIN_FPS = 10;
const STORAGE_KEY = 'fps_saved_builds';

// ─── FPS Calculation ───────────────────────────────────────────────────────────

/**
 * Calculates predicted FPS given hardware and game settings.
 * Applies ray tracing penalties, upscaling boosts, and CPU bottleneck penalties.
 */
export function calculateFps(params: FpsCalculationParams): number {
  const {
    gameBaseFps,
    gpuMultiplier,
    cpuScore,
    ramCapMultiplier,
    ramTypeMultiplier,
    resMultiplier,
    presetMultiplier,
    rayTracingEnabled,
    upscalingEnabled,
    gpuName,
  } = params;

  let fps =
    gameBaseFps *
    gpuMultiplier *
    resMultiplier *
    presetMultiplier *
    ramCapMultiplier *
    ramTypeMultiplier;

  if (rayTracingEnabled) {
    if (gpuName.includes('RTX')) {
      fps *= RT_PENALTY_NVIDIA;
    } else if (gpuName.includes('RX')) {
      fps *= RT_PENALTY_AMD;
    } else {
      fps *= RT_PENALTY_OTHER;
    }
  }

  if (upscalingEnabled) {
    fps *= UPSCALING_BOOST;
  }

  // CPU bottleneck: penalise when CPU score is noticeably less than GPU multiplier
  const bottleneckRatio = cpuScore / gpuMultiplier;
  if (bottleneckRatio < BOTTLENECK_CPU_HIGH_THRESHOLD) {
    const penalty = 1 - bottleneckRatio;
    fps *= 1 - Math.min(penalty, BOTTLENECK_MAX_CPU_PENALTY);
  }

  return Math.max(MIN_FPS, Math.round(fps));
}

// ─── Bottleneck Analysis ───────────────────────────────────────────────────────

/** Returns a structured bottleneck analysis for the given CPU and GPU pair. */
export function getBottleneck(cpuScore: number, gpuScore: number): BottleneckResult {
  const ratio = cpuScore / gpuScore;

  if (ratio < BOTTLENECK_CPU_HIGH_THRESHOLD) {
    return { type: 'CPU', severity: 'High', colorClass: 'text-red-500', barClass: 'bg-red-500', percent: 85 };
  }
  if (ratio < BOTTLENECK_CPU_SLIGHT_THRESHOLD) {
    return { type: 'CPU', severity: 'Slight', colorClass: 'text-yellow-500', barClass: 'bg-yellow-500', percent: 65 };
  }
  if (ratio > BOTTLENECK_GPU_HIGH_THRESHOLD) {
    return { type: 'GPU', severity: 'High', colorClass: 'text-red-500', barClass: 'bg-red-500', percent: 85 };
  }
  if (ratio > BOTTLENECK_GPU_SLIGHT_THRESHOLD) {
    return { type: 'GPU', severity: 'Slight', colorClass: 'text-yellow-500', barClass: 'bg-yellow-500', percent: 65 };
  }

  return { type: 'Balanced', severity: 'None', colorClass: 'text-[#00FF41]', barClass: 'bg-[#00FF41]', percent: 50 };
}

// ─── System Tier ───────────────────────────────────────────────────────────────

/** Returns the system performance tier based on a combined hardware score. */
export function getSystemTier(cpu: Cpu, gpu: Gpu, ramCap: RamCapacity, ramType: RamType): SystemTier {
  const score = cpu.score * gpu.score * ramCap.multiplier * ramType.multiplier;

  if (score > TIER_GOD_SCORE)       return { name: 'God Tier',    colorClass: 'text-yellow-300' };
  if (score > TIER_ENTHUSIAST_SCORE) return { name: 'Enthusiast', colorClass: 'text-purple-400' };
  if (score > TIER_HIGH_END_SCORE)   return { name: 'High-End',   colorClass: 'text-blue-400' };
  if (score > TIER_MID_RANGE_SCORE)  return { name: 'Mid-Range',  colorClass: 'text-[#00FF41]' };
  if (score > TIER_ENTRY_LEVEL_SCORE) return { name: 'Entry-Level', colorClass: 'text-yellow-500' };

  return { name: 'Potato', colorClass: 'text-gray-500' };
}

// ─── Optimization Tips ─────────────────────────────────────────────────────────

interface TipsParams {
  ramCapId: string;
  ramTypeId: string;
  bottleneck: BottleneckResult;
  cpuName: string;
  gpuName: string;
  resId: string;
  presetId: string;
  expectedFps: number;
}

/** Returns up to 3 contextual optimization tips for the current configuration. */
export function getOptimizationTips(params: TipsParams): string[] {
  const { ramCapId, ramTypeId, bottleneck, cpuName, gpuName, resId, presetId, expectedFps } = params;
  const tips: string[] = [];

  if (ramCapId === '4gb' || ramCapId === '8gb') {
    tips.push('Dodaj još RAM-a (preporučeno 16GB) za stabilniji FPS i manje "stutteringa".');
  }
  if (ramTypeId === 'ddr3') {
    tips.push('DDR3 memorija je zastarela i može kočiti procesor. Razmisli o novijoj platformi.');
  }
  if (bottleneck.type === 'CPU' && bottleneck.severity === 'High') {
    tips.push(`Procesor ${cpuName} ozbiljno koči ${gpuName}. Razmisli o nadogradnji procesora.`);
  }
  if (bottleneck.type === 'GPU' && bottleneck.severity === 'High') {
    tips.push(`Grafička (${gpuName}) je slaba za ovaj procesor. Smanji rezoluciju ili detalje.`);
  }
  if (resId === '4k' && expectedFps < 60) {
    tips.push('4K je zahtevno. Prebaci na 1440p za drastičan skok u performansama.');
  }
  if (presetId === 'ultra' && expectedFps < 60) {
    tips.push('Smanji detalje sa Ultra na High ili Medium — vizuelna razlika je mala, FPS skok je veliki.');
  }

  if (tips.length === 0) {
    return [
      'Sistem je odlično balansiran za ova podešavanja!',
      'Uključi DLSS/FSR ako igra podržava za još više FPS-a.',
      'Redovno ažuriraj drajvere za grafičku kartu.',
    ];
  }

  return tips.slice(0, 3);
}

// ─── Share Text ────────────────────────────────────────────────────────────────

interface ShareTextParams {
  gameName: string;
  resName: string;
  presetName: string;
  cpuName: string;
  gpuName: string;
  ramCapName: string;
  ramTypeName: string;
  rayTracingEnabled: boolean;
  upscalingEnabled: boolean;
  fps: number;
  tierName: string;
}

/** Generates the clipboard text for the share button. */
export function buildShareText(params: ShareTextParams): string {
  const extras = [
    params.rayTracingEnabled ? 'Ray Tracing' : '',
    params.upscalingEnabled ? 'DLSS/FSR' : '',
  ]
    .filter(Boolean)
    .join(' + ');

  const extrasLine = extras ? `\n✨ Dodaci: ${extras}` : '';

  return (
    `Moja konfiguracija za ${params.gameName} (${params.resName} ${params.presetName}):\n` +
    `💻 CPU: ${params.cpuName}\n` +
    `🎮 GPU: ${params.gpuName}\n` +
    `🧠 RAM: ${params.ramCapName} ${params.ramTypeName}` +
    extrasLine +
    `\n⚡ Očekivani FPS: ${params.fps}\n` +
    `🏆 Klasa: ${params.tierName}\n\n` +
    `Proveri i ti na FPS Master Predictor!`
  );
}

// ─── localStorage Helpers ──────────────────────────────────────────────────────

export function loadBuildsFromStorage(): SavedBuild[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SavedBuild[]) : [];
  } catch {
    return [];
  }
}

export function saveBuildsToStorage(builds: SavedBuild[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(builds));
}
