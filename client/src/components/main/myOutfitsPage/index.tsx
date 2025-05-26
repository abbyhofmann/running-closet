import { useEffect, useState } from 'react';
import { Box } from '@mui/system';
import { Typography } from '@mui/material';
import { Outfit, OutfitData } from '../../../types';
import { getOutfitsByUser, getPartialOutfitsByUser } from '../../../services/outfitService';
import useUserContext from '../../../hooks/useUserContext';
import OutfitCard from './outfitCard';
import useMyOutfitsPage from '../../../hooks/useMyOutfitsPage';

const MyOutfitsPage = () => {
  const { userPartialOutfits, handleClickOutfit } = useMyOutfitsPage();

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
          <strong>{userPartialOutfits.length} Outfits</strong>
        </Typography>
        <Typography variant='h5'>
          <strong>My Outfits</strong>
        </Typography>
      </Box>
      <Box className='tag_list right_padding'>
        {userPartialOutfits.map(outfit => (
          <OutfitCard key={outfit.oid} o={outfit} clickOutfit={handleClickOutfit} />
          // <Typography key={outfit.oid}>
          //   {outfit.location} and {outfit.tops[0].model}
          // </Typography>
        ))}
      </Box>
    </Box>
  );
};

export default MyOutfitsPage;
