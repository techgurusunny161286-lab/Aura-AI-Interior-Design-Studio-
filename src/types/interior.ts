export type RoomType = 'living' | 'bedroom' | 'dining' | 'office' | 'studio' | 'patio';

export type BudgetTier = 'budget' | 'mid' | 'luxury';

export type Currency = 'INR' | 'USD';

export interface ColorSwatch {
  hex: string;
  name: string;
  role: 'primary' | 'secondary' | 'accent' | 'neutral' | 'trim';
}

export interface ShoppableItem {
  id: string;
  name: string;
  category: 'seating' | 'lighting' | 'rugs' | 'tables' | 'decor' | 'storage' | 'plants';
  estimatedPrice: number; // in USD base
  estimatedPriceUSD: number;
  estimatedPriceINR: number;
  priceDisplay: string;
  styleMatchScore: number;
  materials: string;
  dimensions: string;
  description: string;
  searchQueries: {
    retailer: string;
    url: string;
  }[];
}

export interface DesignStyle {
  id: string;
  name: string;
  tagline: string;
  description: string;
  keyMaterials: string[];
  recommendedLighting: string;
  palette: ColorSwatch[];
  suggestedPrompts: string[];
}

export interface PresetRoom {
  id: string;
  name: string;
  roomType: RoomType;
  dimensions: string;
  description: string;
  originalImage: string;
  makeovers: Record<string, string>; // styleId -> makeoverImage
  defaultShoppableItems: Record<string, ShoppableItem[]>;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  suggestedChanges?: {
    rugColor?: string;
    wallColor?: string;
    lightingStyle?: string;
    newItems?: string[];
  };
  shoppableItems?: ShoppableItem[];
}
