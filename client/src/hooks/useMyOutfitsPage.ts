import { useEffect, useState } from 'react';
import { OutfitData } from '../types';
import useUserContext from './useUserContext';
import { getPartialOutfitsByUser } from '../services/outfitService';

/**
 * Custom hook to handle my outfits page.
 */
const useMyOutfitsPage = () => {
  const { user } = useUserContext();
  const [userPartialOutfits, setPartialUserOutfits] = useState<OutfitData[]>([]);

  useEffect(() => {
    async function fetchData() {
      if (user && user._id) {
        const fetchedPartialOutfits = await getPartialOutfitsByUser(user._id);
        setPartialUserOutfits(fetchedPartialOutfits);
      }
    }
    fetchData();
  }, [user]);

  const handleClickOutfit = (outfitId: string) => {
    // TODO
    console.log('need to implement navigation to view outfit page');
  };

  return {
    userPartialOutfits,
    handleClickOutfit,
  };
};

export default useMyOutfitsPage;
