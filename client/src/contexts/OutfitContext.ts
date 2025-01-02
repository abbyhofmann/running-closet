import { createContext } from 'react';
import { Outfit } from '../types';

/**
 * Interface representing the context type for outfit management.
 *
 * - outfit: The current outfit state.
 * - setOutfit: A function to update the outfit state.
 */
export interface OutfitContextType {
  outfit: Outfit;
  setOutfit: (outfit: Outfit) => void;
}

const OutfitContext = createContext<OutfitContextType | null>(null);

export default OutfitContext;
