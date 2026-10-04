import React from 'react';
import { Sparkles, Download, UploadCloud } from 'lucide-react';
import { Currency } from '../types/interior';

interface NavbarProps {
  onOpenUpload: () => void;
  onOpenMoodboard: () => void;
  savedItemCount: number;
  currency: Currency;
  setCurrency: (currency: Currency) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenUpload,
  onOpenMoodboard,
  savedItemCount,
  currency,
  setCurrency,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#0f1115]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Brand Wordmark (Single Text Element) */}
        <a href="/" className="flex items-center gap-2 group">
          <span className="font-serif text-2xl font-semibold tracking-tight text-white transition-colors group-hover:text-amber-200">
            Aura
          </span>
          <span className="text-xs uppercase tracking-widest text-amber-400/80 font-mono">
            STUDIO
          </span>
        </a>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <a href="#visualizer" className="hover:text-white transition-colors">
            Room Makeover
          </a>
          <a href="#styles" className="hover:text-white transition-colors">
            Aesthetic Styles
          </a>
          <a href="#shoppable" className="hover:text-white transition-colors">
            Shoppable Pieces
          </a>
          <a href="#consultant" className="hover:text-white transition-colors">
            Design Consultant
          </a>
        </nav>

        {/* Zone 3: Primary Actions & Currency Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Currency Switcher */}
          <div className="flex items-center bg-white/5 border border-white/10 rounded-lg p-0.5 text-xs font-mono">
            <button
              onClick={() => setCurrency('INR')}
              className={`px-2 py-1 rounded transition-colors ${
                currency === 'INR'
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Show estimated values in INR (₹)"
            >
              ₹ INR
            </button>
            <button
              onClick={() => setCurrency('USD')}
              className={`px-2 py-1 rounded transition-colors ${
                currency === 'USD'
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Show estimated values in USD ($)"
            >
              $ USD
            </button>
          </div>

          <button
            onClick={onOpenUpload}
            className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-200 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all"
            title="Upload your room photo"
          >
            <UploadCloud className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Upload Space</span>
          </button>

          <button
            onClick={onOpenMoodboard}
            className="flex items-center gap-2 px-3.5 sm:px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm transition-all whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export Moodboard</span>
            <span className="sm:hidden">Spec</span>
            {savedItemCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-slate-900 text-amber-300 text-[10px] font-mono">
                {savedItemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

