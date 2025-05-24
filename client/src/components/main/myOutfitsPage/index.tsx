import { useEffect, useState } from 'react';
import { Typography } from '@mui/material';
import { Outfit } from '../../../types';
import { getOutfitsByUser } from '../../../services/outfitService';
import useUserContext from '../../../hooks/useUserContext';

const MyOutfitsPage = () => {
  const { user } = useUserContext();
  const [userOutfits, setUserOutfits] = useState<Outfit[]>([]);

  useEffect(() => {
    async function fetchData() {
      if (user && user._id) {
        const fetchedOutfits = await getOutfitsByUser(user._id);
        setUserOutfits(fetchedOutfits);
      }
    }
    fetchData();
  }, [user]);

  return (
    <div>
      {userOutfits.map(outfit => (
        <Typography key={outfit._id}>
          {outfit.location} and {outfit.tops[0].model}
        </Typography>
      ))}
    </div>
  );
};

export default MyOutfitsPage;
