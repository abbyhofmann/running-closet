import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { OutfitData } from '../types';
import useUserContext from './useUserContext';
import { getPartialOutfitsByUser } from '../services/outfitService';

/**
 * Custom hook to handle my outfits page.
 */
const useMyOutfitsPage = () => {
  const { user } = useUserContext();
  const navigate = useNavigate();
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
    navigate(`/outfit/${outfitId}`);
  };

  return {
    userPartialOutfits,
    handleClickOutfit,
  };
};

export default useMyOutfitsPage;
