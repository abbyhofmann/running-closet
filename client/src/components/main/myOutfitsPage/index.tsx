import { useEffect, useState } from 'react';
import { Box } from '@mui/system';
import { Typography } from '@mui/material';
import { Outfit, OutfitData } from '../../../types';
import { getOutfitsByUser, getPartialOutfitsByUser } from '../../../services/outfitService';
import useUserContext from '../../../hooks/useUserContext';

const MyOutfitsPage = () => {
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

  return (
    // <div>
    //   {userOutfits.map(outfit => (
    //     <Typography key={outfit._id}>
    //       {outfit.location} and {outfit.tops[0].model}
    //     </Typography>
    //   ))}
    // </div>
    <Box sx={{ paddingRight: 3 }}>
      <Box className='space_between right_padding'>
        <Typography variant='h5'>
          <strong>{userPartialOutfits.length} Tags</strong>
        </Typography>
        <Typography variant='h5'>
          <strong>All Tags</strong>
        </Typography>
      </Box>
      <Box className='tag_list right_padding'>
        {userPartialOutfits.map(outfit => (
          // <TagView key={idx} t={t} clickTag={clickTag} />
          <Typography key={outfit._id}>
            {outfit.location} and {outfit.tops[0].model}
          </Typography>
        ))}
      </Box>
    </Box>
  );
};

export default MyOutfitsPage;
