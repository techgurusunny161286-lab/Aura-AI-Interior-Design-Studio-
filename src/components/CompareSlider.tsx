import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Maximize2, Minimize2, Sparkles, SlidersHorizontal, Sun, Sunset, Moon, Copy, Check } from 'lucide-react';
import { ColorSwatch, DesignStyle } from '../types/interior';

interface CompareSliderProps {
  originalImage: string;
  makeoverImage: string;
  style: DesignStyle;
  palette: ColorSwatch[];
  isLoading?: boolean;
  timeOfDay: 'daylight' | 'golden' | 'evening';
  setTimeOfDay: (time: 'daylight' | 'golden' | 'evening') => void;
  roomName: string;
}

export const CompareSlider: React.FC<CompareSliderProps> = ({
  originalImage,
  makeoverImage,
  style,
  palette,
  isLoading = false,
  timeOfDay,
  setTimeOfDay,
  roomName,
}) => {
  const [sliderPosition, setSliderPosition] = useState<number>(50); // percentage 0 - 100
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const clampedX = Math.max(0, Math.min(x, rect.width));
    const percentage = (clampedX / rect.width) * 100;
    setSliderPosition(percentage);
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    handleMove(e.clientX);
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isDragging) {
      handleMove(e.clientX);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
  };

  // Keyboard navigation for accessibility
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      setSliderPosition((prev) => Math.max(0, prev - 5));
    } else if (e.key === 'ArrowRight') {
      setSliderPosition((prev) => Math.min(100, prev + 5));
    }
  };

  const copyHex = (hex: string) => {
    navigator.clipboard?.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  return (
    <div
      id="visualizer"
      className={`relative w-full rounded-2xl border border-white/10 bg-[#14171f] shadow-2xl transition-all duration-300 ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none bg-black p-4 md:p-8' : 'p-4 sm:p-6'
      }`}
    >
      {/* Top Header of Visualizer */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
            <span>{roomName}</span>
            <span aria-hidden="true">/</span>
            <span className="text-amber-400 font-sans font-medium">{style.name} Makeover</span>
          </div>
          <h2 className="text-lg sm:text-xl font-serif font-semibold text-white tracking-tight">
            Before & After Transformation
          </h2>
        </div>

        {/* Quick Position Snap & Controls */}
        <div className="flex items-center gap-2">
          {/* Lighting Mode Selector */}
          <div className="flex items-center bg-white/5 border border-white/10 rounded-lg p-0.5">
            <button
              onClick={() => setTimeOfDay('daylight')}
              className={`p-1.5 rounded-md text-xs transition-colors ${
                timeOfDay === 'daylight'
                  ? 'bg-amber-400/20 text-amber-300'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Daylight illumination"
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setTimeOfDay('golden')}
              className={`p-1.5 rounded-md text-xs transition-colors ${
                timeOfDay === 'golden'
                  ? 'bg-amber-400/20 text-amber-300'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Golden hour sunset"
            >
              <Sunset className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setTimeOfDay('evening')}
              className={`p-1.5 rounded-md text-xs transition-colors ${
                timeOfDay === 'evening'
                  ? 'bg-amber-400/20 text-amber-300'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Moody evening ambient"
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Preset comparison split buttons */}
          <div className="hidden sm:flex items-center bg-white/5 border border-white/10 rounded-lg p-0.5 text-xs text-slate-300">
            <button
              onClick={() => setSliderPosition(0)}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                sliderPosition === 0 ? 'bg-white/10 text-white font-medium' : 'hover:text-white'
              }`}
            >
              Original
            </button>
            <button
              onClick={() => setSliderPosition(50)}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                sliderPosition === 50 ? 'bg-white/10 text-white font-medium' : 'hover:text-white'
              }`}
            >
              50 / 50
            </button>
            <button
              onClick={() => setSliderPosition(100)}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                sliderPosition === 100 ? 'bg-white/10 text-white font-medium' : 'hover:text-white'
              }`}
            >
              Reimagined
            </button>
          </div>

          {/* Fullscreen Toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'View Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Compare Canvas Container */}
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="slider"
        aria-valuenow={Math.round(sliderPosition)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Before and after comparison slider"
        className={`relative aspect-[16/9] w-full overflow-hidden rounded-xl select-none cursor-ew-resize bg-black touch-none focus:outline-none focus:ring-2 focus:ring-amber-400/50 ${
          isFullscreen ? 'h-[78vh] aspect-auto' : ''
        }`}
      >
        {/* Layer 1: Reimagined Makeover Image (Full Background) */}
        <img
          src={makeoverImage}
          alt={`Reimagined in ${style.name}`}
          referrerPolicy="no-referrer"
          className="absolute inset-0 h-full w-full object-cover pointer-events-none"
        />

        {/* Layer 2: Original Image (Clipped to sliderPosition width) */}
        <div
          className="absolute inset-0 h-full overflow-hidden pointer-events-none"
          style={{ width: `${sliderPosition}%` }}
        >
          <img
            src={originalImage}
            alt="Original Space Before"
            referrerPolicy="no-referrer"
            className="absolute inset-0 h-full w-full object-cover max-w-none"
            style={{
              width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100%',
            }}
          />
        </div>

        {/* Visual Slider Divider Line */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)] pointer-events-none"
          style={{ left: `${sliderPosition}%` }}
        >
          {/* Circular Drag Handle */}
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white text-slate-900 shadow-xl border-2 border-slate-900 flex items-center justify-center transition-transform hover:scale-110 active:scale-95">
            <SlidersHorizontal className="w-4 h-4 rotate-90" />
          </div>
        </div>

        {/* Left Floating Badge: Original Space */}
        <div
          className={`absolute top-4 left-4 transition-opacity duration-200 pointer-events-none ${
            sliderPosition < 15 ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/70 backdrop-blur-md border border-white/10 text-white text-xs font-semibold shadow-lg">
            <span className="w-2 h-2 rounded-full bg-orange-500" />
            <span>ORIGINAL SPACE</span>
          </div>
        </div>

        {/* Right Floating Badge: Reimagined Style */}
        <div
          className={`absolute top-4 right-4 transition-opacity duration-200 pointer-events-none ${
            sliderPosition > 85 ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/70 backdrop-blur-md border border-amber-400/30 text-amber-300 text-xs font-semibold shadow-lg">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="uppercase">{style.name}</span>
          </div>
        </div>

        {/* Slider Position Indicator Tooltip at bottom */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[11px] font-mono text-slate-300 pointer-events-none">
          {Math.round(sliderPosition)}% Original · {Math.round(100 - sliderPosition)}% AI
        </div>

        {/* Loading Overlay when generating */}
        {isLoading && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center text-white z-20">
            <div className="w-12 h-12 rounded-full border-2 border-amber-400/30 border-t-amber-400 animate-spin mb-3" />
            <p className="text-sm font-medium tracking-wide">Rendering Interior Transformation...</p>
            <p className="text-xs text-slate-400 mt-1">Applying {style.name} materials, lighting, and textures</p>
          </div>
        )}
      </div>

      {/* Extracted Color Palette Swatch Bar */}
      <div className="mt-4 pt-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
          <span>Coordinated Room Palette:</span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {palette.map((swatch, idx) => (
            <button
              key={`${swatch.hex}-${idx}`}
              onClick={() => copyHex(swatch.hex)}
              className="group relative flex items-center gap-2 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all text-xs text-slate-300"
              title={`Click to copy ${swatch.name} (${swatch.hex})`}
            >
              <span
                className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-sm shrink-0"
                style={{ backgroundColor: swatch.hex }}
              />
              <span className="font-mono text-[11px]">{swatch.hex}</span>
              <span className="hidden sm:inline text-slate-400 text-[11px] font-sans">
                {swatch.name}
              </span>

              {copiedHex === swatch.hex ? (
                <Check className="w-3 h-3 text-emerald-400 ml-1" />
              ) : (
                <Copy className="w-3 h-3 text-slate-500 group-hover:text-slate-300 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
