import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, Plus, Check } from 'lucide-react';
import { BudgetTier, Currency, DesignStyle } from '../types/interior';

interface StyleCarouselProps {
  styles: DesignStyle[];
  activeStyleId: string;
  onSelectStyle: (style: DesignStyle) => void;
  budgetTier: BudgetTier;
  setBudgetTier: (tier: BudgetTier) => void;
  onCustomStyleSubmit: (customName: string, customDetails: string) => void;
  isLoading?: boolean;
  currency: Currency;
}

export const StyleCarousel: React.FC<StyleCarouselProps> = ({
  styles,
  activeStyleId,
  onSelectStyle,
  budgetTier,
  setBudgetTier,
  onCustomStyleSubmit,
  isLoading = false,
  currency,
}) => {
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customStyleName, setCustomStyleName] = useState('');
  const [customStyleDetails, setCustomStyleDetails] = useState('');

  const scrollRef = React.useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -340 : 340;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customStyleName.trim()) return;
    onCustomStyleSubmit(customStyleName.trim(), customStyleDetails.trim());
    setShowCustomModal(false);
    setCustomStyleName('');
    setCustomStyleDetails('');
  };

  return (
    <section id="styles" className="w-full my-8">
      {/* Section Header with Budget Filters */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI STYLE REIMAGINING</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-semibold text-white tracking-tight">
            Curated Architectural Aesthetics
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
            Choose an aesthetic to instantly render materials, lighting, and iconic furnishings calibrated to your space.
          </p>
        </div>

        {/* Budget Tier Selector & Carousel Navigation */}
        <div className="flex items-center gap-3">
          {/* Budget Tier Pills (Interactive Segmented Control) */}
          <div className="flex items-center bg-white/5 border border-white/10 rounded-lg p-1 text-xs">
            <button
              onClick={() => setBudgetTier('budget')}
              className={`px-3 py-1 rounded-md font-medium transition-colors ${
                budgetTier === 'budget'
                  ? 'bg-amber-400 text-slate-950 font-semibold'
                  : 'text-slate-300 hover:text-white'
              }`}
              title={currency === 'INR' ? "Accessible pieces under ₹40,000" : "Accessible pieces under $500"}
            >
              {currency === 'INR' ? '₹ Budget' : '$ Budget'}
            </button>
            <button
              onClick={() => setBudgetTier('mid')}
              className={`px-3 py-1 rounded-md font-medium transition-colors ${
                budgetTier === 'mid'
                  ? 'bg-amber-400 text-slate-950 font-semibold'
                  : 'text-slate-300 hover:text-white'
              }`}
              title={currency === 'INR' ? "Designer furniture ₹40,000 - ₹1,50,000" : "Designer furniture $500 - $2,000"}
            >
              {currency === 'INR' ? '₹₹ Mid-Range' : '$$ Mid-Range'}
            </button>
            <button
              onClick={() => setBudgetTier('luxury')}
              className={`px-3 py-1 rounded-md font-medium transition-colors ${
                budgetTier === 'luxury'
                  ? 'bg-amber-400 text-slate-950 font-semibold'
                  : 'text-slate-300 hover:text-white'
              }`}
              title={currency === 'INR' ? "High-end luxury > ₹1,50,000" : "High-end luxury & bespoke pieces"}
            >
              {currency === 'INR' ? '₹₹₹ Luxury' : '$$$ Luxury'}
            </button>
          </div>

          {/* Carousel Arrows */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => scroll('left')}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-colors"
              aria-label="Previous styles"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-colors"
              aria-label="Next styles"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal Carousel Track */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-4 pt-1 snap-x scrollbar-thin scrollbar-thumb-white/15"
      >
        {styles.map((style) => {
          const isActive = activeStyleId === style.id;
          return (
            <div
              key={style.id}
              onClick={() => onSelectStyle(style)}
              role="button"
              tabIndex={0}
              className={`group relative flex-none w-[280px] sm:w-[320px] snap-start rounded-xl p-5 border text-left cursor-pointer transition-all duration-200 select-none ${
                isActive
                  ? 'bg-[#181d26] border-amber-400/80 shadow-[0_0_20px_rgba(251,191,36,0.15)] ring-1 ring-amber-400/50'
                  : 'bg-[#13161c] border-white/10 hover:border-white/20 hover:bg-[#161a22]'
              }`}
            >
              {/* Active Indicator Checkmark */}
              {isActive && (
                <div className="absolute top-4 right-4 flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] font-mono font-semibold">
                  <Check className="w-3 h-3" />
                  <span>ACTIVE</span>
                </div>
              )}

              {/* Color Swatch Dots */}
              <div className="flex items-center gap-1.5 mb-3">
                {style.palette.slice(0, 5).map((color, cIdx) => (
                  <span
                    key={cIdx}
                    className="w-3.5 h-3.5 rounded-full border border-white/20"
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  />
                ))}
              </div>

              {/* Style Title & Tagline */}
              <h3 className="font-serif text-lg font-bold text-white group-hover:text-amber-200 transition-colors">
                {style.name}
              </h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                {style.tagline}
              </p>

              {/* Key Materials Tag List (Unboxed clean text discipline) */}
              <div className="mt-4 pt-3 border-t border-white/5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-slate-400">
                {style.keyMaterials.slice(0, 3).map((mat, mIdx) => (
                  <React.Fragment key={mIdx}>
                    <span>{mat}</span>
                    {mIdx < 2 && <span className="text-slate-600">·</span>}
                  </React.Fragment>
                ))}
              </div>

              {/* Action Button */}
              <button
                disabled={isLoading}
                className={`mt-4 w-full py-2 px-3 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                  isActive
                    ? 'bg-amber-400 text-slate-950 shadow-sm'
                    : 'bg-white/5 group-hover:bg-white/10 text-slate-200 group-hover:text-white border border-white/10'
                }`}
              >
                {isActive ? 'Current Aesthetic' : 'Apply Aesthetic'}
              </button>
            </div>
          );
        })}

        {/* Custom Style Card Creator */}
        <div
          onClick={() => setShowCustomModal(true)}
          role="button"
          tabIndex={0}
          className="group flex-none w-[240px] snap-start rounded-xl p-5 border border-dashed border-white/20 hover:border-amber-400/60 bg-white/[0.02] hover:bg-white/[0.04] text-center flex flex-col items-center justify-center cursor-pointer transition-all"
        >
          <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform mb-3">
            <Plus className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-base font-semibold text-white">
            Custom Aesthetic
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-[180px]">
            Prompt your dream moodboard (e.g. Wes Anderson Pastel, Dark Academia)
          </p>
        </div>
      </div>

      {/* Custom Style Prompt Modal */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-[#181d26] border border-white/10 p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-xl font-semibold text-white">
                Create Custom Room Style
              </h3>
              <button
                onClick={() => setShowCustomModal(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCustomSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Style Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Moody Dark Academia with Velvet & Brass"
                  value={customStyleName}
                  onChange={(e) => setCustomStyleName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-black/40 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Key Features & Desired Materials (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Dark espresso bookshelves, leather wingback chair, antique brass library lamps, rich mahogany floor..."
                  value={customStyleDetails}
                  onChange={(e) => setCustomStyleDetails(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg bg-black/40 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCustomModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-xs font-semibold bg-amber-400 hover:bg-amber-300 text-slate-950 transition-colors"
                >
                  Generate Makeover
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
