/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { CompareSlider } from './components/CompareSlider';
import { StyleCarousel } from './components/StyleCarousel';
import { ConsultantChat } from './components/ConsultantChat';
import { ShoppableGallery } from './components/ShoppableGallery';
import { RoomUploader } from './components/RoomUploader';
import { MoodboardModal } from './components/MoodboardModal';

import { DESIGN_STYLES, PRESET_ROOMS } from './data/roomPresets';
import { BudgetTier, ChatMessage, ColorSwatch, DesignStyle, PresetRoom, RoomType, ShoppableItem } from './types/interior';
import { createRoomSvgDataUrl, getRetailerSearchUrl } from './utils/imageGenerators';
import { Sparkles, SlidersHorizontal, RefreshCw } from 'lucide-react';

export default function App() {
  // State: Current Room
  const [currentRoom, setCurrentRoom] = useState<PresetRoom>(PRESET_ROOMS[0]);
  const [roomName, setRoomName] = useState<string>(PRESET_ROOMS[0].name);
  const [roomType, setRoomType] = useState<RoomType>('living');
  const [originalImage, setOriginalImage] = useState<string>(PRESET_ROOMS[0].originalImage);

  // State: Current Style & Visuals
  const [activeStyle, setActiveStyle] = useState<DesignStyle>(DESIGN_STYLES[0]);
  const [activePalette, setActivePalette] = useState<ColorSwatch[]>(DESIGN_STYLES[0].palette);
  const [makeoverImage, setMakeoverImage] = useState<string>(
    PRESET_ROOMS[0].makeovers['mid-century'] || createRoomSvgDataUrl('mid-century', 'living')
  );
  const [timeOfDay, setTimeOfDay] = useState<'daylight' | 'golden' | 'evening'>('daylight');
  const [budgetTier, setBudgetTier] = useState<BudgetTier>('mid');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // Visual Refinements State (e.g. customized rug or wall color applied from chat)
  const [customVisualOptions, setCustomVisualOptions] = useState<{
    rugColor?: string;
    wallColor?: string;
    timeOfDay?: 'daylight' | 'golden' | 'evening';
  }>({ timeOfDay: 'daylight' });

  // State: Shoppable Items & Wishlist
  const [shoppableItems, setShoppableItems] = useState<ShoppableItem[]>(
    PRESET_ROOMS[0].defaultShoppableItems['mid-century'] || []
  );
  const [savedItemIds, setSavedItemIds] = useState<Set<string>>(new Set());

  // State: Modals
  const [isUploadOpen, setIsUploadOpen] = useState<boolean>(false);
  const [isMoodboardOpen, setIsMoodboardOpen] = useState<boolean>(false);

  // State: Consultant Chat
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      role: 'assistant',
      content: `Welcome to your makeover session for the "${PRESET_ROOMS[0].name}". I've initialized the space in **${DESIGN_STYLES[0].name}**—balancing rich American walnut slats, tactile caramel leather, and brass lighting to anchor the natural window sunlight.\n\nTry dragging the comparison slider above, or ask me for refinements like *"Keep this layout but make the rug navy blue"* or *"Find budget seating alternatives"*!`,
      timestamp: Date.now(),
    },
  ]);
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);
  const [pendingRefinement, setPendingRefinement] = useState<{
    rugColor?: string;
    wallColor?: string;
    summary?: string;
  } | null>(null);

  // Update makeover image whenever active style, time of day, or custom refinements change
  useEffect(() => {
    // If current room is a preset and has a precomputed visual for this style with default options
    const isCustomized = customVisualOptions.rugColor || customVisualOptions.wallColor;

    if (!isCustomized && currentRoom.makeovers[activeStyle.id]) {
      setMakeoverImage(
        createRoomSvgDataUrl(
          activeStyle.id as any,
          roomType,
          { ...customVisualOptions, timeOfDay }
        )
      );
    } else {
      setMakeoverImage(
        createRoomSvgDataUrl(
          activeStyle.id as any,
          roomType,
          { ...customVisualOptions, timeOfDay }
        )
      );
    }
  }, [activeStyle, timeOfDay, customVisualOptions, currentRoom, roomType]);

  // Handle Style Selection from Carousel
  const handleSelectStyle = async (newStyle: DesignStyle) => {
    setActiveStyle(newStyle);
    setActivePalette(newStyle.palette);
    setCustomVisualOptions((prev) => ({ ...prev, timeOfDay })); // reset specific overrides

    // Check if preset has shoppable items for this style
    if (currentRoom.defaultShoppableItems[newStyle.id]) {
      setShoppableItems(currentRoom.defaultShoppableItems[newStyle.id]);
    } else {
      // Request AI server to generate tailored shoppable pieces
      fetchAIShoppableItems(newStyle.name, newStyle.id);
    }

    // Add consultant contextual note
    setChatMessages((prev) => [
      ...prev,
      {
        id: `style-switch-${Date.now()}`,
        role: 'assistant',
        content: `I've transitioned the space into **${newStyle.name}**. Notice how the visual weight shifts toward ${newStyle.keyMaterials.slice(0, 2).join(' and ')}, calibrated with ${newStyle.recommendedLighting}. What elements would you like to refine?`,
        timestamp: Date.now(),
      },
    ]);
  };

  // Fetch AI generated items via backend API
  const fetchAIShoppableItems = async (styleName: string, styleId: string, customInstruction?: string) => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/reimagine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          styleName,
          styleId,
          roomType,
          customInstruction,
          image: originalImage,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.palette && Array.isArray(data.palette) && data.palette.length > 0) {
          setActivePalette(data.palette);
        }
        if (data.shoppableItems && Array.isArray(data.shoppableItems) && data.shoppableItems.length > 0) {
          const formattedItems: ShoppableItem[] = data.shoppableItems.map((item: any, idx: number) => ({
            id: `ai-${styleId}-${idx}-${Date.now()}`,
            name: item.name || 'Designer Accent Piece',
            category: item.category || 'decor',
            estimatedPrice: item.estimatedPrice || 450,
            priceDisplay: `$${(item.estimatedPrice || 450).toLocaleString()}`,
            styleMatchScore: item.styleMatchScore || 95,
            materials: item.materials || 'Natural Material Blend',
            dimensions: item.dimensions || 'Standard Living Dimensions',
            description: item.description || 'Curated to anchor this aesthetic.',
            searchQueries: [
              { retailer: 'West Elm', url: getRetailerSearchUrl('West Elm', item.searchKeyword || item.name) },
              { retailer: 'CB2', url: getRetailerSearchUrl('CB2', item.searchKeyword || item.name) },
              { retailer: 'Wayfair', url: getRetailerSearchUrl('Wayfair', item.searchKeyword || item.name) },
              { retailer: 'IKEA', url: getRetailerSearchUrl('IKEA', item.searchKeyword || item.name) },
              { retailer: 'Amazon Home', url: getRetailerSearchUrl('Amazon Home', item.searchKeyword || item.name) },
              { retailer: 'Pottery Barn', url: getRetailerSearchUrl('Pottery Barn', item.searchKeyword || item.name) },
            ],
          }));
          setShoppableItems(formattedItems);
        }
      }
    } catch (err) {
      console.warn('Could not fetch AI shoppable pieces, retaining current collection:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle Preset Room Selection
  const handleSelectPreset = (preset: PresetRoom) => {
    setCurrentRoom(preset);
    setRoomName(preset.name);
    setRoomType(preset.roomType);
    setOriginalImage(preset.originalImage);
    setCustomVisualOptions({ timeOfDay });

    // Update makeover image and shoppable items for the current active style
    if (preset.defaultShoppableItems[activeStyle.id]) {
      setShoppableItems(preset.defaultShoppableItems[activeStyle.id]);
    }

    setChatMessages((prev) => [
      ...prev,
      {
        id: `preset-${Date.now()}`,
        role: 'assistant',
        content: `Loaded the **${preset.name}** (${preset.dimensions}). Let's curate this floorplan in **${activeStyle.name}**!`,
        timestamp: Date.now(),
      },
    ]);
  };

  // Handle Custom User Room Upload
  const handleCustomImageUploaded = (base64Image: string, uploadedRoomType: RoomType, uploadedName: string) => {
    setOriginalImage(base64Image);
    setRoomName(uploadedName);
    setRoomType(uploadedRoomType);
    setCustomVisualOptions({ timeOfDay });

    // Inform consultant
    setChatMessages((prev) => [
      ...prev,
      {
        id: `upload-${Date.now()}`,
        role: 'assistant',
        content: `I've analyzed your uploaded photo of "${uploadedName}". Applying our **${activeStyle.name}** aesthetic over your room's natural architectural boundaries!`,
        timestamp: Date.now(),
      },
    ]);

    // Request AI re-imagination for the uploaded photo
    fetchAIShoppableItems(activeStyle.name, activeStyle.id);
  };

  // Handle Consultant Chat Message
  const handleSendMessage = async (text: string) => {
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setIsChatLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...chatMessages, userMsg].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          roomContext: {
            roomName,
            roomType,
            currentStyle: activeStyle.name,
            items: shoppableItems.map((i) => i.name),
            userEdits: Object.keys(customVisualOptions),
          },
          currentImage: originalImage,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const assistantReply = data.reply || data.fallbackReply || 'I have noted your design adjustment!';
        const suggestedChanges = data.suggestedChanges;

        const newAssistantMsg: ChatMessage = {
          id: `asst-${Date.now()}`,
          role: 'assistant',
          content: assistantReply,
          timestamp: Date.now(),
          suggestedChanges,
        };

        setChatMessages((prev) => [...prev, newAssistantMsg]);

        // If the consultant recommended a visual refinement, store it as pending or auto-apply if explicitly requested
        if (suggestedChanges) {
          setPendingRefinement(suggestedChanges);
          // If user specifically said "make the rug..." or "change wall...", apply right away
          const lowerText = text.toLowerCase();
          if (lowerText.includes('rug') || lowerText.includes('wall') || lowerText.includes('color') || lowerText.includes('light')) {
            applyVisualRefinement(suggestedChanges);
          }
        }
      } else {
        throw new Error('API response was not ok');
      }
    } catch (error) {
      console.error('Chat error:', error);
      // Fallback response so user is never stranded
      setChatMessages((prev) => [
        ...prev,
        {
          id: `asst-err-${Date.now()}`,
          role: 'assistant',
          content: `To execute that refinement for this ${activeStyle.name} scheme: prioritize high-contrast textures (like matte wool or brushed brass) and balance the room's color temperature at 2700K. I've staged your styling prompt!`,
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Apply Visual Refinement to Visualizer (e.g. "make rug blue")
  const applyVisualRefinement = (refinement: { rugColor?: string; wallColor?: string; summary?: string }) => {
    setCustomVisualOptions((prev) => ({
      ...prev,
      rugColor: refinement.rugColor || prev.rugColor,
      wallColor: refinement.wallColor || prev.wallColor,
    }));
    setPendingRefinement(null);

    // If rugColor changed, update palette swatch
    if (refinement.rugColor) {
      setActivePalette((prev) => {
        const updated = [...prev];
        const accentIdx = updated.findIndex((s) => s.role === 'accent');
        if (accentIdx !== -1) {
          updated[accentIdx] = {
            hex: refinement.rugColor!,
            name: 'Refined Accent',
            role: 'accent',
          };
        }
        return updated;
      });
    }
  };

  // Handle Custom Style from Carousel
  const handleCustomStyleSubmit = (customName: string, customDetails: string) => {
    const customStyle: DesignStyle = {
      id: 'custom-' + Date.now(),
      name: customName,
      tagline: customDetails || 'Custom AI-generated architectural moodboard',
      description: customDetails || 'Bespoke aesthetic created specifically for your room footprint.',
      keyMaterials: ['Custom Millwork', 'Bespoke Textiles', 'Architectural Glass', 'Sculptural Metals'],
      recommendedLighting: 'Layered ambient and directional accent lighting',
      palette: [
        { hex: '#1e293b', name: 'Anchor Slate', role: 'primary' },
        { hex: '#d97706', name: 'Warm Ochre', role: 'accent' },
        { hex: '#f8fafc', name: 'Studio White', role: 'neutral' },
        { hex: '#64748b', name: 'Soft Charcoal', role: 'secondary' },
      ],
      suggestedPrompts: [
        `Keep this ${customName} layout but adjust the lighting to moody evening`,
        `Find budget-friendly alternatives under $400 for ${customName}`,
        `Suggest the optimal rug dimension for this floorplan`,
      ],
    };

    handleSelectStyle(customStyle);
    fetchAIShoppableItems(customName, customStyle.id, customDetails);
  };

  // Toggle Save / Wishlist item
  const handleToggleSaveItem = (item: ShoppableItem) => {
    setSavedItemIds((prev) => {
      const next = new Set(prev);
      if (next.has(item.id)) {
        next.delete(item.id);
      } else {
        next.add(item.id);
      }
      return next;
    });
  };

  // Ask Consultant about a specific item
  const handleAskAboutItem = (item: ShoppableItem) => {
    const prompt = `Where would you position the "${item.name}" in this room, and what budget alternatives or styling rules would you recommend?`;
    handleSendMessage(prompt);
    // Smooth scroll down to consultant chat
    document.getElementById('consultant')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#0f1115] text-slate-100 flex flex-col font-sans selection:bg-amber-400 selection:text-slate-950">
      {/* Top Bar Navigation */}
      <Navbar
        onOpenUpload={() => setIsUploadOpen(true)}
        onOpenMoodboard={() => setIsMoodboardOpen(true)}
        savedItemCount={savedItemIds.size}
      />

      {/* Main Workspace Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        {/* Intro Hero Section */}
        <section className="text-center sm:text-left py-2 border-b border-white/5 pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300 text-xs font-mono mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI INTERIOR DESIGN CONSULTANT & MAKEOVER STUDIO</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white tracking-tight">
            Reimagine Your Living Space in Real Time
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-400 max-w-2xl leading-relaxed">
            Drag the before/after slider to contrast your original space with AI architectural makeovers. Refine materials, lighting, and colors directly in chat with shoppable furniture links.
          </p>
        </section>

        {/* 1. Core Feature: Compare Slider */}
        <CompareSlider
          originalImage={originalImage}
          makeoverImage={makeoverImage}
          style={activeStyle}
          palette={activePalette}
          isLoading={isGenerating}
          timeOfDay={timeOfDay}
          setTimeOfDay={setTimeOfDay}
          roomName={roomName}
        />

        {/* 2. Core Feature: Reimagined Styles Carousel */}
        <StyleCarousel
          styles={DESIGN_STYLES}
          activeStyleId={activeStyle.id}
          onSelectStyle={handleSelectStyle}
          budgetTier={budgetTier}
          setBudgetTier={setBudgetTier}
          onCustomStyleSubmit={handleCustomStyleSubmit}
          isLoading={isGenerating}
        />

        {/* 3. Core Feature: Context-Aware Consultant Chat Interface */}
        <ConsultantChat
          messages={chatMessages}
          onSendMessage={handleSendMessage}
          isLoading={isChatLoading}
          style={activeStyle}
          onApplyVisualRefinement={applyVisualRefinement}
          pendingRefinement={pendingRefinement}
        />

        {/* 4. Core Feature: Shoppable Gallery & Procurement Breakdown */}
        <ShoppableGallery
          items={shoppableItems}
          savedItemIds={savedItemIds}
          onToggleSaveItem={handleToggleSaveItem}
          onAskAboutItem={handleAskAboutItem}
          styleName={activeStyle.name}
        />
      </main>

      {/* Quiet Footer */}
      <footer className="w-full border-t border-white/10 bg-[#0c0e12] py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-serif text-base text-white font-semibold">Aura</span>
            <span>· Architectural Interior Design Studio</span>
          </div>
          <div>
            <span>Powered by Gemini Multimodal Interior Intelligence</span>
          </div>
        </div>
      </footer>

      {/* Upload Space Modal */}
      <RoomUploader
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        presetRooms={PRESET_ROOMS}
        selectedPresetId={currentRoom.id}
        onSelectPreset={handleSelectPreset}
        onCustomImageUploaded={handleCustomImageUploaded}
      />

      {/* Export Moodboard / Spec Modal */}
      <MoodboardModal
        isOpen={isMoodboardOpen}
        onClose={() => setIsMoodboardOpen(false)}
        roomName={roomName}
        style={activeStyle}
        palette={activePalette}
        items={shoppableItems}
        savedItemIds={savedItemIds}
        makeoverImage={makeoverImage}
        originalImage={originalImage}
      />
    </div>
  );
}
