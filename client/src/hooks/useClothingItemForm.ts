import { ChangeEvent, useState } from 'react';
import createTop from '../services/topService';
import createBottom from '../services/bottomService';
import useUserContext from './useUserContext';
import useOutfitContext from './useOutfitContext';
import createAccessory from '../services/accessoryService';
import createOuterwear from '../services/outerwearService';
import createShoe from '../services/shoeService';
import createOutfit from '../services/outfitService';

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
      if (clothingType === 'top') {
        const newTop = await createTop(user._id!, brand, model, 'newTopUrl.com');
        setOutfit({
          ...outfit,
          tops: [...outfit.tops, newTop],
        });
      } else if (clothingType === 'bottom') {
        const newBottom = await createBottom(user._id!, brand, model, 'newTopUrl.com');
        setOutfit({
          ...outfit,
          bottoms: [...outfit.bottoms, newBottom],
        });
      } else if (clothingType === 'accessory') {
        const newAccessory = await createAccessory(user._id!, brand, model, 'newTopUrl.com');
        setOutfit({
          ...outfit,
          accessories: [...outfit.accessories, newAccessory],
        });
      } else if (clothingType === 'outerwear') {
        const newOuterwear = await createOuterwear(user._id!, brand, model, 'newTopUrl.com');
        setOutfit({
          ...outfit,
          outerwear: [...outfit.outerwear, newOuterwear],
        });
      } else if (clothingType === 'shoe') {
        const newShoe = await createShoe(user._id!, brand, model, 'newTopUrl.com');
        setOutfit({
          ...outfit,
          shoe: newShoe,
        });
        // only send the ids when creating the outfit in the db
        const newOutfit = await createOutfit(
          outfit.wearer?._id!,
          outfit.workout?._id!,
          outfit.tops.map(t => t._id!),
          outfit.bottoms.map(b => b._id!),
          outfit.outerwear.map(o => o._id!),
          outfit.accessories.map(a => a._id!),
          outfit.shoe?._id!,
        ); // TODO - is this null check valid? !
        setOutfit({...outfit, _id: newOutfit._id});
      }
      // TODO - error message here for string not equal to one of the above clothing items?
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      if (errorMessage === 'Request failed with status code 400') {
        setCreateClothingItemError(`Creating ${clothingType} failed. Please try again.`);
      } else {
        setCreateClothingItemError(
          `There was an issue creating ${clothingType}. Please try again.`,
        );
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

export default useClothingItemForm;
