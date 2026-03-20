'use client';

import { useMemo } from 'react';
import { calculateFps, getBottleneck, getSystemTier, getOptimizationTips } from '@/lib/fps-engine';
import { GAMES, CPUS, GPUS, RAM_CAPACITIES, RAM_TYPES, RESOLUTIONS, PRESETS } from '@/lib/data';
import type { BottleneckResult, SystemTier, CompareDataPoint } from '@/lib/types';

interface FpsResultParams {
  cpuId: string;
  gpuId: string;
  ramCapacityId: string;
  ramTypeId: string;
  gameId: string;
  resolutionId: string;
  presetId: string;
  rayTracingEnabled: boolean;
  upscalingEnabled: boolean;
}

interface FpsResultReturn {
  expectedFps: number;
  bottleneck: BottleneckResult;
  systemTier: SystemTier;
  tips: string[];
  presetCompareData: CompareDataPoint[];
  resolutionCompareData: CompareDataPoint[];
  gpuCompareData: (CompareDataPoint & { isCurrent: boolean })[];
  selectedCpu: (typeof CPUS)[number];
  selectedGpu: (typeof GPUS)[number];
  selectedGame: (typeof GAMES)[number];
  selectedRes: (typeof RESOLUTIONS)[number];
  selectedPreset: (typeof PRESETS)[number];
  selectedRamCap: (typeof RAM_CAPACITIES)[number];
  selectedRamType: (typeof RAM_TYPES)[number];
}

export function useFpsResult(params: FpsResultParams): FpsResultReturn {
  const { cpuId, gpuId, ramCapacityId, ramTypeId, gameId, resolutionId, presetId, rayTracingEnabled, upscalingEnabled } =
    params;

  // Selected entities — resolves IDs to full objects (fallback to first item)
  const selectedCpu   = useMemo(() => CPUS.find((c) => c.id === cpuId)               ?? CPUS[0],          [cpuId]);
  const selectedGpu   = useMemo(() => GPUS.find((g) => g.id === gpuId)               ?? GPUS[0],          [gpuId]);
  const selectedRamCap = useMemo(() => RAM_CAPACITIES.find((r) => r.id === ramCapacityId) ?? RAM_CAPACITIES[2], [ramCapacityId]);
  const selectedRamType = useMemo(() => RAM_TYPES.find((r) => r.id === ramTypeId)     ?? RAM_TYPES[1],     [ramTypeId]);
  const selectedGame  = useMemo(() => GAMES.find((g) => g.id === gameId)             ?? GAMES[0],         [gameId]);
  const selectedRes   = useMemo(() => RESOLUTIONS.find((r) => r.id === resolutionId) ?? RESOLUTIONS[1],   [resolutionId]);
  const selectedPreset = useMemo(() => PRESETS.find((p) => p.id === presetId)        ?? PRESETS[3],        [presetId]);

  // Core FPS
  const expectedFps = useMemo(
    () =>
      calculateFps({
        gameBaseFps: selectedGame.baseFps,
        gpuMultiplier: selectedGpu.multiplier,
        cpuScore: selectedCpu.score,
        ramCapMultiplier: selectedRamCap.multiplier,
        ramTypeMultiplier: selectedRamType.multiplier,
        resMultiplier: selectedRes.multiplier,
        presetMultiplier: selectedPreset.multiplier,
        rayTracingEnabled,
        upscalingEnabled,
        gpuName: selectedGpu.name,
      }),
    [selectedGame, selectedGpu, selectedCpu, selectedRamCap, selectedRamType, selectedRes, selectedPreset, rayTracingEnabled, upscalingEnabled],
  );

  // Derived analysis
  const bottleneck = useMemo(() => getBottleneck(selectedCpu.score, selectedGpu.score), [selectedCpu, selectedGpu]);
  const systemTier = useMemo(
    () => getSystemTier(selectedCpu, selectedGpu, selectedRamCap, selectedRamType),
    [selectedCpu, selectedGpu, selectedRamCap, selectedRamType],
  );
  const tips = useMemo(
    () =>
      getOptimizationTips({
        ramCapId: selectedRamCap.id,
        ramTypeId: selectedRamType.id,
        bottleneck,
        cpuName: selectedCpu.name,
        gpuName: selectedGpu.name,
        resId: selectedRes.id,
        presetId: selectedPreset.id,
        expectedFps,
      }),
    [selectedRamCap, selectedRamType, bottleneck, selectedCpu, selectedGpu, selectedRes, selectedPreset, expectedFps],
  );

  // Comparison datasets
  const sharedParams = useMemo(
    () => ({
      gameBaseFps: selectedGame.baseFps,
      cpuScore: selectedCpu.score,
      ramCapMultiplier: selectedRamCap.multiplier,
      ramTypeMultiplier: selectedRamType.multiplier,
      rayTracingEnabled,
      upscalingEnabled,
      gpuName: selectedGpu.name,
    }),
    [selectedGame, selectedCpu, selectedRamCap, selectedRamType, rayTracingEnabled, upscalingEnabled, selectedGpu.name],
  );

  const presetCompareData = useMemo<CompareDataPoint[]>(
    () =>
      PRESETS.map((p) => ({
        name: p.name,
        fps: calculateFps({ ...sharedParams, gpuMultiplier: selectedGpu.multiplier, resMultiplier: selectedRes.multiplier, presetMultiplier: p.multiplier }),
      })),
    [sharedParams, selectedGpu.multiplier, selectedRes.multiplier],
  );

  const resolutionCompareData = useMemo<CompareDataPoint[]>(
    () =>
      RESOLUTIONS.map((r) => ({
        name: r.name,
        fps: calculateFps({ ...sharedParams, gpuMultiplier: selectedGpu.multiplier, resMultiplier: r.multiplier, presetMultiplier: selectedPreset.multiplier }),
      })),
    [sharedParams, selectedGpu.multiplier, selectedPreset.multiplier],
  );

  const gpuCompareData = useMemo(
    () =>
      GPUS.map((g) => ({
        name: g.name,
        fps: calculateFps({ ...sharedParams, gpuMultiplier: g.multiplier, gpuName: g.name, resMultiplier: selectedRes.multiplier, presetMultiplier: selectedPreset.multiplier }),
        isCurrent: g.id === selectedGpu.id,
      }))
        .sort((a, b) => b.fps - a.fps)
        .slice(0, 8),
    [sharedParams, selectedRes.multiplier, selectedPreset.multiplier, selectedGpu.id],
  );

  return {
    expectedFps,
    bottleneck,
    systemTier,
    tips,
    presetCompareData,
    resolutionCompareData,
    gpuCompareData,
    selectedCpu,
    selectedGpu,
    selectedGame,
    selectedRes,
    selectedPreset,
    selectedRamCap,
    selectedRamType,
  };
}
