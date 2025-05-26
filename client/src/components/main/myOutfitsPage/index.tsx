import { Box } from '@mui/system';
import { Typography } from '@mui/material';
import OutfitCard from './outfitCard';
import useMyOutfitsPage from '../../../hooks/useMyOutfitsPage';

const MyOutfitsPage = () => {
  const { userPartialOutfits, handleClickOutfit } = useMyOutfitsPage();

  return (
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
        ))}
      </Box>
    </Box>
  );
};

export default MyOutfitsPage;
