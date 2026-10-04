import React, { useRef } from 'react';
import { X, Printer, Download, Sparkles, Check, ExternalLink } from 'lucide-react';
import { ColorSwatch, DesignStyle, ShoppableItem } from '../types/interior';

interface MoodboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomName: string;
  style: DesignStyle;
  palette: ColorSwatch[];
  items: ShoppableItem[];
  savedItemIds: Set<string>;
  makeoverImage: string;
  originalImage: string;
}

export const MoodboardModal: React.FC<MoodboardModalProps> = ({
  isOpen,
  onClose,
  roomName,
  style,
  palette,
  items,
  savedItemIds,
  makeoverImage,
  originalImage,
}) => {
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const savedOrAllItems = savedItemIds.size > 0
    ? items.filter((i) => savedItemIds.has(i.id))
    : items;

  const totalCost = savedOrAllItems.reduce((acc, curr) => acc + curr.estimatedPrice, 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-4xl rounded-2xl bg-[#14171f] border border-white/10 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h3 className="font-serif text-lg font-semibold text-white">
              Room Makeover Moodboard & Shopping Spec
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-semibold text-xs transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Content Area */}
        <div ref={printRef} className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-white/10">
          {/* Spec Header */}
          <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <span className="text-[11px] font-mono text-amber-400 uppercase tracking-widest block">
                AURA INTERIOR DESIGN STUDIO SPECIFICATION
              </span>
              <h2 className="text-2xl font-serif font-bold text-white mt-1">
                {roomName}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Aesthetic Scheme: <span className="text-white font-medium">{style.name}</span> · {style.tagline}
              </p>
            </div>

            <div className="text-right">
              <span className="text-[11px] font-mono text-slate-400 uppercase block">Total Specified Budget</span>
              <span className="font-mono text-xl font-bold text-amber-300">
                ${totalCost.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Visual Showcase (Side by Side Before and After) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="text-[11px] font-mono text-slate-400 uppercase mb-1.5">
                Before: Original Space
              </div>
              <div className="aspect-[16/9] rounded-xl overflow-hidden border border-white/10 bg-black">
                <img
                  src={originalImage}
                  alt="Original room"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div>
              <div className="text-[11px] font-mono text-amber-400 uppercase mb-1.5 flex items-center justify-between">
                <span>After: {style.name}</span>
                <span className="text-emerald-400">AI STYLED</span>
              </div>
              <div className="aspect-[16/9] rounded-xl overflow-hidden border border-amber-400/40 bg-black">
                <img
                  src={makeoverImage}
                  alt="Reimagined room"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Palette Swatches */}
          <div>
            <div className="text-[11px] font-mono text-slate-400 uppercase mb-2">
              Color & Material Palette
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {palette.map((swatch, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg border border-white/10 bg-white/5 flex flex-col items-start"
                >
                  <div
                    className="w-full h-8 rounded-md mb-2 border border-white/15"
                    style={{ backgroundColor: swatch.hex }}
                  />
                  <span className="font-mono text-xs font-semibold text-white">{swatch.hex}</span>
                  <span className="text-[11px] text-slate-400 truncate">{swatch.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Itemized Furniture List */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-mono text-slate-400 uppercase">
                Itemized Spec & Procurement List ({savedOrAllItems.length} items)
              </span>
            </div>

            <div className="border border-white/10 rounded-xl overflow-hidden bg-black/20">
              <table className="w-full text-left text-xs">
                <thead className="bg-white/5 border-b border-white/10 text-slate-400 font-mono uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Item</th>
                    <th className="p-3 hidden sm:table-cell">Category</th>
                    <th className="p-3 hidden md:table-cell">Dimensions & Materials</th>
                    <th className="p-3 text-right">Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-300">
                  {savedOrAllItems.map((item) => (
                    <tr key={item.id} className="hover:bg-white/[0.02]">
                      <td className="p-3 font-medium text-white">
                        <div>{item.name}</div>
                        <div className="sm:hidden text-[10px] text-slate-500 font-mono mt-0.5">
                          {item.category} · {item.dimensions}
                        </div>
                      </td>
                      <td className="p-3 hidden sm:table-cell font-mono text-slate-400 uppercase text-[11px]">
                        {item.category}
                      </td>
                      <td className="p-3 hidden md:table-cell text-slate-400 text-[11px]">
                        {item.dimensions} · {item.materials}
                      </td>
                      <td className="p-3 text-right font-mono font-semibold text-amber-300">
                        {item.priceDisplay}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="p-4 border-t border-white/10 bg-white/[0.02] flex items-center justify-between text-xs text-slate-500">
          <span>Prepared by Aura AI Interior Design Consultant</span>
          <span className="font-mono">Document Date: {new Date().toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};
