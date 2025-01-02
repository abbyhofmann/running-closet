import { ChangeEvent, useState } from 'react';
import createTop from '../services/topService';
import createBottom from '../services/bottomService';
import useUserContext from './useUserContext';
import { Outfit } from '../types';
import useOutfitContext from './useOutfitContext';

/**
 * Custom hook to handle login input and submission.
 *
 * */
const useClothingItemForm = (clothingType: string) => {
  const [brand, setBrand] = useState<string>('');
  const [model, setModel] = useState<string>('');
  const [createClothingItemError, setCreateClothingItemError] = useState<string>('');
  const [showCreateClothingItemError, setShowCreateClothingItemError] = useState<boolean>(false);
  const { user } = useUserContext();
  const { outfit, setOutfit } = useOutfitContext();

  /**
   * Function to handle the brand input change event.
   *
   * @param e - the event object.
   */
  const handleBrandChange = (e: ChangeEvent<HTMLInputElement>) => {
    setBrand(e.target.value);
  };

  /**
   * Function to handle the model input change event.
   *
   * @param e - the event object.
   */
  const handleModelChange = (e: ChangeEvent<HTMLInputElement>) => {
    setModel(e.target.value);
  };

  /**
   * Function to handle the form submission event.
   *
   * @param event - the form event object.
   */
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      setCreateClothingItemError('');
      setShowCreateClothingItemError(false);
      if (clothingType == 'top') {
        const newTop = await createTop(user._id!, brand, model, 'newTopUrl.com');
        setOutfit({
          ...outfit,
          tops: [...outfit.tops, newTop],
        });
      } else if (clothingType == 'bottom') {
        const newBottom = await createBottom(user._id!, brand, model, 'newTopUrl.com');
        setOutfit({
          ...outfit,
          bottoms: [...outfit.bottoms, newBottom],
        });
      } else if (clothingType == 'accessoru') {
        const newAccessory = await createAccessory(user._id!, brand, model, 'newTopUrl.com');
        setOutfit({
          ...outfit,
          accessories: [...outfit.accessories, newAccessory],
        });
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      if (errorMessage === 'Request failed with status code 400') {
        setCreateClothingItemError(`Creating ${clothingType} failed. Please try again.`);
      } else {
        setCreateClothingItemError(`There was an issue creating ${clothingType}. Please try again.`);
      }
      setShowCreateClothingItemError(true);
    }
  };

  return {
    brand,
    model,
    createClothingItemError,
    showCreateClothingItemError,
    handleBrandChange,
    handleModelChange,
    handleSubmit,
  };
};

export default useTopForm;
