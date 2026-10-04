import React, { useState } from 'react';
import { ShoppingBag, ExternalLink, Heart, MessageSquare, Check, Sparkles, SlidersHorizontal } from 'lucide-react';
import { ShoppableItem } from '../types/interior';

interface ShoppableGalleryProps {
  items: ShoppableItem[];
  savedItemIds: Set<string>;
  onToggleSaveItem: (item: ShoppableItem) => void;
  onAskAboutItem: (item: ShoppableItem) => void;
  styleName: string;
}

export const ShoppableGallery: React.FC<ShoppableGalleryProps> = ({
  items,
  savedItemIds,
  onToggleSaveItem,
  onAskAboutItem,
  styleName,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Pieces' },
    { id: 'seating', label: 'Seating' },
    { id: 'tables', label: 'Tables' },
    { id: 'lighting', label: 'Lighting' },
    { id: 'rugs', label: 'Rugs' },
    { id: 'decor', label: 'Decor' },
    { id: 'plants', label: 'Plants' },
  ];

  const filteredItems = selectedCategory === 'all'
    ? items
    : items.filter((item) => item.category === selectedCategory);

  const totalEstimatedCost = items.reduce((sum, item) => sum + item.estimatedPrice, 0);

  return (
    <section id="shoppable" className="w-full my-8">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>CURATED FURNITURE & DECOR</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-semibold text-white tracking-tight">
            Shop This Look: {styleName}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-world matching furniture, architectural lighting, and textiles with direct retailer search links.
          </p>
        </div>

        {/* Room Budget Total Badge */}
        <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-xl">
          <div className="text-right">
            <span className="text-[10px] uppercase font-mono text-slate-400 block">Total Est. Room Cost</span>
            <span className="font-mono text-base font-bold text-amber-300">
              ${totalEstimatedCost.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Category Filter Tabs (Segmented control button group) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-4 scrollbar-none">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id;
          const count = cat.id === 'all'
            ? items.length
            : items.filter((i) => i.category === cat.id).length;

          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                isActive
                  ? 'bg-amber-400 text-slate-950 font-semibold shadow-sm'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/5'
              }`}
            >
              <span>{cat.label}</span>
              <span className={`text-[10px] font-mono px-1 rounded ${isActive ? 'bg-slate-900/20 text-slate-950' : 'text-slate-400'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Product Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredItems.map((item) => {
          const isSaved = savedItemIds.has(item.id);

          return (
            <div
              key={item.id}
              className="group relative flex flex-col justify-between rounded-xl border border-white/10 bg-[#14171f] hover:border-white/20 p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl"
            >
              <div>
                {/* Top Row: Category & Match Score */}
                <div className="flex items-center justify-between gap-2 mb-2 text-xs">
                  <span className="font-mono text-slate-400 uppercase tracking-wider text-[11px]">
                    {item.category}
                  </span>
                  <div className="flex items-center gap-1 text-emerald-400 font-mono text-[11px]">
                    <Sparkles className="w-3 h-3" />
                    <span>{item.styleMatchScore}% MATCH</span>
                  </div>
                </div>

                {/* Product Name */}
                <h3 className="font-serif text-lg font-semibold text-white group-hover:text-amber-200 transition-colors leading-snug">
                  {item.name}
                </h3>

                {/* Price */}
                <div className="mt-1 font-mono text-base font-bold text-amber-300">
                  {item.priceDisplay}
                </div>

                {/* Description */}
                <p className="text-xs text-slate-400 mt-2.5 leading-relaxed">
                  {item.description}
                </p>

                {/* Specifications: Materials & Dimensions */}
                <div className="mt-3 pt-3 border-t border-white/5 space-y-1 text-[11px] text-slate-400">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-slate-500 font-mono shrink-0">Materials:</span>
                    <span className="truncate">{item.materials}</span>
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-slate-500 font-mono shrink-0">Dimensions:</span>
                    <span className="truncate">{item.dimensions}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons & Direct Retailer Links */}
              <div className="mt-5 pt-3 border-t border-white/5">
                <div className="text-[10px] uppercase font-mono text-slate-400 mb-2">
                  Shop exact / similar at:
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {item.searchQueries.map((query, qIdx) => (
                    <a
                      key={qIdx}
                      href={query.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 hover:text-white border border-white/10 text-[11px] text-slate-300 transition-colors"
                      title={`Search ${item.name} on ${query.retailer}`}
                    >
                      <span>{query.retailer}</span>
                      <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                    </a>
                  ))}
                </div>

                {/* Card Bottom Actions: Wishlist and Ask Consultant */}
                <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-white/5">
                  <button
                    onClick={() => onAskAboutItem(item)}
                    className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-amber-300 transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Ask Consultant</span>
                  </button>

                  <button
                    onClick={() => onToggleSaveItem(item)}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                      isSaved
                        ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                        : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-amber-400 text-amber-400' : ''}`} />
                    <span>{isSaved ? 'Saved' : 'Wishlist'}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
