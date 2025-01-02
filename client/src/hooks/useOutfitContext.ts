import { useContext } from 'react';
import OutfitContext, { OutfitContextType } from '../contexts/OutfitContext';

/**
 * Custom hook to access the OutfitContext.
 *
 * @throws It will throw an error if the `OutfitContext` is null.
 *
 * @returns context - the context value for managing outfit state, including the `setOutfit` function.
 */
const useOutfitContext = (): OutfitContextType => {
  const context = useContext(OutfitContext);

  if (context === null) {
    throw new Error('Outfit context is null.');
  }

  return context;
};

export default useOutfitContext;
