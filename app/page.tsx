'use client';

import React, { useState, useCallback } from 'react';
import { motion } from 'motion/react';
import { Zap, Cpu, Monitor, HardDrive, Gamepad2 } from 'lucide-react';
import { TIER_ICONS } from '@/lib/tier-icons';

// Hooks
import { useFpsResult }  from '@/hooks/useFpsResult';
import { useBuilds }     from '@/hooks/useBuilds';
import { useToast }      from '@/hooks/useToast';

// Components
import { SearchableSelect } from '@/components/SearchableSelect';
import { Toggle }           from '@/components/Toggle';
import { FpsDisplay }       from '@/components/FpsDisplay';
import { BottleneckCard }   from '@/components/BottleneckCard';
import { OptimizationTips } from '@/components/OptimizationTips';
import { CompareChart }     from '@/components/CompareChart';
import { BuildCard }        from '@/components/BuildCard';
import { CompareModal }     from '@/components/CompareModal';
import { Toast }            from '@/components/Toast';

// Data & Types
import { GAMES, CPUS, GPUS, RAM_CAPACITIES, RAM_TYPES, RESOLUTIONS, PRESETS } from '@/lib/data';
import { buildShareText } from '@/lib/fps-engine';

// ─── Tier icon map ─────────────────────────────────────────────────────────────
// Imported from @/lib/tier-icons — single source of truth.

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function FPSMasterPredictor() {
  // ── Hardware & game selection state ──
  const [cpuId, setCpuId]               = useState(CPUS[0].id);
  const [gpuId, setGpuId]               = useState(GPUS[0].id);
  const [ramCapacityId, setRamCapacityId] = useState(RAM_CAPACITIES[2].id);
  const [ramTypeId, setRamTypeId]       = useState(RAM_TYPES[1].id);
  const [gameId, setGameId]             = useState(GAMES[0].id);
  const [resolutionId, setResolutionId] = useState(RESOLUTIONS[1].id);
  const [presetId, setPresetId]         = useState(PRESETS[3].id);
  const [rayTracingEnabled, setRayTracing] = useState(false);
  const [upscalingEnabled, setUpscaling]  = useState(false);

  // ── Derived results ──
  const {
    expectedFps, bottleneck, systemTier, tips,
    presetCompareData, resolutionCompareData, gpuCompareData,
    selectedCpu, selectedGpu, selectedGame,
    selectedRes, selectedPreset, selectedRamCap, selectedRamType,
  } = useFpsResult({
    cpuId, gpuId, ramCapacityId, ramTypeId,
    gameId, resolutionId, presetId,
    rayTracingEnabled, upscalingEnabled,
  });

  // ── Side-effect hooks ──
  const { savedBuilds, comparingBuilds, saveBuild, deleteBuild, toggleCompare, clearCompare, canAddToCompare } = useBuilds();
  const { toast, showToast } = useToast();

  const TierIcon = TIER_ICONS[systemTier.name];

  // ── Actions ──
  const handleSaveBuild = useCallback(() => {
    saveBuild({
      cpu: selectedCpu.name,
      cpuScore: selectedCpu.score,
      gpu: selectedGpu.name,
      gpuMultiplier: selectedGpu.multiplier,
      ram: `${selectedRamCap.name} ${selectedRamType.name}`,
      ramCapMultiplier: selectedRamCap.multiplier,
      ramTypeMultiplier: selectedRamType.multiplier,
      game: selectedGame.name,
      fps: expectedFps,
      res: selectedRes.name,
      resMultiplier: selectedRes.multiplier,
      preset: selectedPreset.name,
      presetMultiplier: selectedPreset.multiplier,
      rt: rayTracingEnabled,
      upscaling: upscalingEnabled,
      tier: systemTier,
    });
    showToast('Konfiguracija sačuvana!');
  }, [saveBuild, showToast, selectedCpu, selectedGpu, selectedRamCap, selectedRamType, selectedGame, expectedFps, selectedRes, selectedPreset, rayTracingEnabled, upscalingEnabled, systemTier]);

  const handleShare = useCallback(() => {
    const text = buildShareText({
      gameName: selectedGame.name,
      resName: selectedRes.name,
      presetName: selectedPreset.name,
      cpuName: selectedCpu.name,
      gpuName: selectedGpu.name,
      ramCapName: selectedRamCap.name,
      ramTypeName: selectedRamType.name,
      rayTracingEnabled,
      upscalingEnabled,
      fps: expectedFps,
      tierName: systemTier.name,
    });
    navigator.clipboard.writeText(text)
      .then(() => showToast('Kopirano u clipboard!'))
      .catch(() => showToast('Greška — nije moguće kopirati tekst.'));
  }, [showToast, selectedGame, selectedRes, selectedPreset, selectedCpu, selectedGpu, selectedRamCap, selectedRamType, rayTracingEnabled, upscalingEnabled, expectedFps, systemTier]);

  const handleToggleCompare = useCallback(
    (build: (typeof savedBuilds)[0]) => {
      const alreadyIn = comparingBuilds.some((b) => b.id === build.id);
      if (!alreadyIn && !canAddToCompare) {
        showToast('Možeš porediti maksimalno 2 konfiguracije.');
        return;
      }
      toggleCompare(build);
    },
    [comparingBuilds, canAddToCompare, toggleCompare, showToast],
  );

  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-20 font-sans text-gray-200 selection:bg-[#00FF41] selection:text-black">

      {/* ── Header ── */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/50 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <Zap className="h-6 w-6 text-[#00FF41]" aria-hidden="true" />
            <h1 className="text-xl font-bold tracking-tight text-white">
              FPS <span className="text-[#00FF41]">Master</span> Predictor
            </h1>
          </div>
          <div className="hidden font-mono text-xs text-gray-500 sm:block" aria-hidden="true">
            v2.0.0 // HEURISTIC ENGINE ACTIVE
          </div>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">

          {/* ────────── Left: Inputs ────────── */}
          <section className="space-y-6 lg:col-span-5" aria-label="Odabir komponenti računara">

            {/* PC Configuration */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-white/5 bg-[#141414] p-6 shadow-xl"
            >
              <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold text-white">
                <Monitor className="h-5 w-5 text-[#00D1FF]" aria-hidden="true" />
                Konfiguracija Sistema
              </h2>

              <div className="space-y-5">
                <SearchableSelect options={CPUS}  value={cpuId}  onChange={setCpuId}  label="Procesor (CPU)" icon={Cpu} />
                <SearchableSelect options={GPUS}  value={gpuId}  onChange={setGpuId}  label="Grafička (GPU)" icon={Monitor} />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {/* RAM Type */}
                  <div>
                    <label htmlFor="ram-type" className="mb-1.5 flex items-center gap-2 text-sm font-medium text-gray-400">
                      <HardDrive className="h-4 w-4" aria-hidden="true" /> RAM Tip
                    </label>
                    <select
                      id="ram-type"
                      value={ramTypeId}
                      onChange={(e) => setRamTypeId(e.target.value)}
                      className="w-full appearance-none rounded-lg border border-white/10 bg-black px-4 py-2.5 text-white transition-colors focus:border-[#00FF41] focus:outline-none focus:ring-1 focus:ring-[#00FF41]"
                    >
                      {RAM_TYPES.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
                    </select>
                  </div>

                  {/* RAM Capacity */}
                  <div>
                    <label htmlFor="ram-cap" className="mb-1.5 block text-sm font-medium text-gray-400">
                      Kapacitet
                    </label>
                    <select
                      id="ram-cap"
                      value={ramCapacityId}
                      onChange={(e) => setRamCapacityId(e.target.value)}
                      className="w-full appearance-none rounded-lg border border-white/10 bg-black px-4 py-2.5 text-white transition-colors focus:border-[#00FF41] focus:outline-none focus:ring-1 focus:ring-[#00FF41]"
                    >
                      {RAM_CAPACITIES.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Game Settings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-2xl border border-white/5 bg-[#141414] p-6 shadow-xl"
            >
              <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold text-white">
                <Gamepad2 className="h-5 w-5 text-[#00D1FF]" aria-hidden="true" />
                Podešavanja Igre
              </h2>

              <div className="space-y-5">
                <SearchableSelect options={GAMES} value={gameId} onChange={setGameId} label="Igra" />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {/* Resolution */}
                  <div>
                    <label htmlFor="resolution" className="mb-1.5 block text-sm font-medium text-gray-400">Rezolucija</label>
                    <select
                      id="resolution"
                      value={resolutionId}
                      onChange={(e) => setResolutionId(e.target.value)}
                      className="w-full appearance-none rounded-lg border border-white/10 bg-black px-4 py-2.5 text-white transition-colors focus:border-[#00D1FF] focus:outline-none focus:ring-1 focus:ring-[#00D1FF]"
                    >
                      {RESOLUTIONS.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
                    </select>
                  </div>

                  {/* Preset */}
                  <div>
                    <label htmlFor="preset" className="mb-1.5 block text-sm font-medium text-gray-400">Detalji</label>
                    <select
                      id="preset"
                      value={presetId}
                      onChange={(e) => setPresetId(e.target.value)}
                      className="w-full appearance-none rounded-lg border border-white/10 bg-black px-4 py-2.5 text-white transition-colors focus:border-[#00D1FF] focus:outline-none focus:ring-1 focus:ring-[#00D1FF]"
                    >
                      {PRESETS.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                  </div>
                </div>

                {/* Advanced toggles */}
                <div className="mt-4 space-y-3 border-t border-white/10 pt-4">
                  <p className="text-sm font-medium text-gray-400">Napredna Podešavanja</p>
                  <Toggle
                    label="Ray Tracing (RTX/DXR)"
                    checked={rayTracingEnabled}
                    onChange={setRayTracing}
                    accentColor="#00FF41"
                    id="toggle-rt"
                  />
                  <Toggle
                    label="Upscaling (DLSS/FSR/XeSS)"
                    checked={upscalingEnabled}
                    onChange={setUpscaling}
                    accentColor="#00D1FF"
                    id="toggle-upscaling"
                  />
                </div>
              </div>
            </motion.div>
          </section>

          {/* ────────── Right: Results ────────── */}
          <section className="space-y-6 lg:col-span-7" aria-label="Rezultati i predviđanja kompjuterskih performansi">

            <FpsDisplay
              fps={expectedFps}
              gameName={selectedGame.name}
              resName={selectedRes.name}
              presetName={selectedPreset.name}
              systemTier={systemTier}
              TierIcon={TierIcon}
              onSave={handleSaveBuild}
              onShare={handleShare}
            />

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <BottleneckCard  bottleneck={bottleneck} />
              <OptimizationTips tips={tips} />
              <CompareChart
                title={`FPS po Detaljima (${selectedRes.name})`}
                data={presetCompareData}
                accentColor="cyan"
                delay={0.3}
              />
              <CompareChart
                title={`FPS po Rezoluciji (${selectedPreset.name})`}
                data={resolutionCompareData}
                accentColor="green"
                delay={0.35}
              />
              <CompareChart
                title={`FPS po Grafičkoj (${selectedCpu.name})`}
                data={gpuCompareData}
                accentColor="purple"
                delay={0.4}
              />
            </div>
          </section>

          {/* ────────── Saved Builds ────────── */}
          {savedBuilds.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-white/5 bg-[#141414] p-6 shadow-xl lg:col-span-12"
              aria-label="Sačuvane konfiguracije"
            >
              <h3 className="mb-6 flex items-center gap-2 text-lg font-semibold text-white">
                Sačuvane Konfiguracije
                <span className="rounded-full bg-[#00D1FF]/10 px-2 py-0.5 text-sm font-normal text-[#00D1FF]">
                  {savedBuilds.length}
                </span>
              </h3>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {savedBuilds.map((build) => (
                  <BuildCard
                    key={build.id}
                    build={build}
                    isComparing={comparingBuilds.some((b) => b.id === build.id)}
                    canCompare={canAddToCompare}
                    onDelete={deleteBuild}
                    onToggleCompare={handleToggleCompare}
                  />
                ))}
              </div>
            </motion.section>
          )}

        </div>
      </main>

      {/* ── Modals & overlays ── */}
      {comparingBuilds.length === 2 && (
        <CompareModal
          builds={[comparingBuilds[0], comparingBuilds[1]]}
          onClose={clearCompare}
        />
      )}
      <Toast message={toast} />
    </div>
  );
}
