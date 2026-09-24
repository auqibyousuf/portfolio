import React, { useState } from "react";
import { Sparkles, Video, Grid, Volume2, VolumeX } from "lucide-react";
import type { BackgroundMode } from "./CinematicBackground";

interface ModeSwitcherProps {
  currentMode: BackgroundMode;
  onModeChange: (mode: BackgroundMode) => void;
}

export const ModeSwitcher: React.FC<ModeSwitcherProps> = ({ currentMode, onModeChange }) => {
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [audioCtx, setAudioCtx] = useState<AudioContext | null>(null);

  const toggleSound = () => {
    if (!soundEnabled) {
      const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      setAudioCtx(ctx);
      setSoundEnabled(true);
      playHapticTone(ctx, 440, 0.08);
    } else {
      audioCtx?.close();
      setAudioCtx(null);
      setSoundEnabled(false);
    }
  };

  const playHapticTone = (ctx: AudioContext, freq: number, duration: number) => {
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.015, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Audio fallback
    }
  };

  const handleSelectMode = (mode: BackgroundMode) => {
    onModeChange(mode);
    if (soundEnabled && audioCtx) {
      playHapticTone(audioCtx, mode === "cinematic-video" ? 520 : mode === "interactive-mesh" ? 640 : 760, 0.09);
    }
  };

  return (
    <aside aria-label="Experience controls" className="fixed bottom-6 right-6 z-50 flex items-center gap-1.5 p-1.5 rounded-full bg-[hsl(var(--surface))]/90 backdrop-blur-xl border border-[hsl(var(--stroke))] shadow-2xl select-none font-mono">
      <div className="flex items-center gap-1 pl-1">
        <button
          onClick={() => handleSelectMode("cinematic-video")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-medium transition-all ${
            currentMode === "cinematic-video"
              ? "bg-[hsl(var(--bg))] text-[hsl(var(--text))] shadow-sm border border-[hsl(var(--stroke))]"
              : "text-[hsl(var(--muted))] hover:text-[hsl(var(--text))]"
          }`}
          title="Switch to Cinematic Ambient Video"
        >
          <Video className="w-3 h-3 text-blue-500" />
          <span className="hidden sm:inline">Cinematic</span>
        </button>

        <button
          onClick={() => handleSelectMode("interactive-mesh")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-medium transition-all ${
            currentMode === "interactive-mesh"
              ? "bg-[hsl(var(--bg))] text-[hsl(var(--text))] shadow-sm border border-[hsl(var(--stroke))]"
              : "text-[hsl(var(--muted))] hover:text-[hsl(var(--text))]"
          }`}
          title="Switch to Interactive Lattice Mesh"
        >
          <Grid className="w-3 h-3 text-sky-500" />
          <span className="hidden sm:inline">Mesh</span>
        </button>

        <button
          onClick={() => handleSelectMode("aurora-particles")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-medium transition-all ${
            currentMode === "aurora-particles"
              ? "bg-[hsl(var(--bg))] text-[hsl(var(--text))] shadow-sm border border-[hsl(var(--stroke))]"
              : "text-[hsl(var(--muted))] hover:text-[hsl(var(--text))]"
          }`}
          title="Switch to Aurora Particle Physics"
        >
          <Sparkles className="w-3 h-3 text-indigo-500" />
          <span className="hidden sm:inline">Aurora</span>
        </button>
      </div>

      <div className="w-px h-3.5 bg-[hsl(var(--stroke))] mx-1" />

      <button
        onClick={toggleSound}
        className={`p-1.5 rounded-full transition-colors cursor-pointer ${
          soundEnabled ? "text-emerald-500 bg-emerald-500/10" : "text-[hsl(var(--muted))] hover:text-[hsl(var(--text))]"
        }`}
        title={soundEnabled ? "Mute interactive audio feedback" : "Enable ambient UI haptics"}
      >
        {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
      </button>
    </aside>
  );
};
