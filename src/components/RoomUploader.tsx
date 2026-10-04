import React, { useState, useRef } from 'react';
import { UploadCloud, Camera, Image as ImageIcon, Check, X, Sparkles, Sliders } from 'lucide-react';
import { PresetRoom, RoomType } from '../types/interior';

interface RoomUploaderProps {
  isOpen: boolean;
  onClose: () => void;
  presetRooms: PresetRoom[];
  selectedPresetId: string;
  onSelectPreset: (preset: PresetRoom) => void;
  onCustomImageUploaded: (base64Image: string, roomType: RoomType, roomName: string) => void;
}

export const RoomUploader: React.FC<RoomUploaderProps> = ({
  isOpen,
  onClose,
  presetRooms,
  selectedPresetId,
  onSelectPreset,
  onCustomImageUploaded,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedRoomType, setSelectedRoomType] = useState<RoomType>('living');
  const [customRoomName, setCustomRoomName] = useState<string>('My Space');
  const [isProcessing, setIsProcessing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, or WebP).');
      return;
    }

    setIsProcessing(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPreviewImage(result);
      setIsProcessing(false);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleConfirmUpload = () => {
    if (!previewImage) return;
    onCustomImageUploaded(previewImage, selectedRoomType, customRoomName);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-2xl rounded-2xl bg-[#14171f] border border-white/10 shadow-2xl p-6 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div>
            <h3 className="font-serif text-xl font-semibold text-white">
              Choose or Upload Your Space
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Upload a snapshot of your room or choose a curated floorplan preset.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto py-4 space-y-6 scrollbar-thin scrollbar-thumb-white/10 pr-1">
          {/* Section A: Upload Custom Room Photo */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-amber-400 mb-2">
              Option 1: Upload Your Real Space
            </h4>

            {previewImage ? (
              <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden border border-amber-400/40 bg-black">
                <img
                  src={previewImage}
                  alt="Uploaded space preview"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setPreviewImage(null)}
                  className="absolute top-3 right-3 px-3 py-1 rounded-lg bg-black/70 hover:bg-black text-white text-xs border border-white/20 transition-all"
                >
                  Change Photo
                </button>
              </div>
            ) : (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragActive(true);
                }}
                onDragLeave={() => setDragActive(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`flex flex-col items-center justify-center p-8 rounded-xl border-2 border-dashed cursor-pointer transition-all ${
                  dragActive
                    ? 'border-amber-400 bg-amber-400/5'
                    : 'border-white/15 hover:border-white/30 bg-white/[0.02] hover:bg-white/[0.04]'
                }`}
              >
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-amber-400 mb-3">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <p className="text-sm font-medium text-white text-center">
                  Drag and drop your room photo here, or <span className="text-amber-400 underline">browse files</span>
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Supports JPG, PNG, WebP up to 25MB
                </p>

                <div className="flex items-center gap-3 mt-4">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      cameraInputRef.current?.click();
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-300 transition-colors"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Use Camera</span>
                  </button>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                  className="hidden"
                />
                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                  className="hidden"
                />
              </div>
            )}

            {/* Room Metadata Inputs for Custom Photo */}
            {previewImage && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                <div>
                  <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
                    Room Name / Label
                  </label>
                  <input
                    type="text"
                    value={customRoomName}
                    onChange={(e) => setCustomRoomName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:ring-1 focus:ring-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
                    Room Type
                  </label>
                  <select
                    value={selectedRoomType}
                    onChange={(e) => setSelectedRoomType(e.target.value as RoomType)}
                    className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:ring-1 focus:ring-amber-400"
                  >
                    <option value="living">Living Room</option>
                    <option value="bedroom">Bedroom</option>
                    <option value="dining">Dining Room</option>
                    <option value="office">Home Office</option>
                    <option value="studio">Studio Apartment</option>
                    <option value="patio">Patio / Balcony</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Section B: Preset Sample Spaces */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
              Option 2: Or Start with a Curated Space Preset
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {presetRooms.map((preset) => {
                const isSelected = selectedPresetId === preset.id;
                return (
                  <div
                    key={preset.id}
                    onClick={() => {
                      onSelectPreset(preset);
                      onClose();
                    }}
                    role="button"
                    tabIndex={0}
                    className={`group relative rounded-xl border p-3 flex gap-3 cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-amber-400/10 border-amber-400/80 shadow-md'
                        : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/[0.08]'
                    }`}
                  >
                    <div className="w-20 h-16 rounded-lg overflow-hidden shrink-0 bg-black/50 border border-white/10">
                      <img
                        src={preset.originalImage}
                        alt={preset.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h5 className="font-serif text-sm font-semibold text-white truncate group-hover:text-amber-200">
                          {preset.name}
                        </h5>
                        {isSelected && <Check className="w-3.5 h-3.5 text-amber-400 shrink-0 ml-1" />}
                      </div>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">
                        {preset.dimensions}
                      </p>
                      <span className="inline-block text-[10px] font-mono text-slate-500 uppercase mt-1">
                        {preset.roomType}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-medium text-slate-300 hover:text-white"
          >
            Cancel
          </button>
          {previewImage && (
            <button
              onClick={handleConfirmUpload}
              className="px-5 py-2 rounded-lg text-xs font-semibold bg-amber-400 hover:bg-amber-300 text-slate-950 transition-colors shadow-sm"
            >
              Transform My Room
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
