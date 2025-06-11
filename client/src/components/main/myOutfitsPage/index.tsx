import { Box, Stack } from '@mui/system';
import { Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import OutfitCard from './outfitCard';
import useMyOutfitsPage from '../../../hooks/useMyOutfitsPage';

const MyOutfitsPage = () => {
  const { userPartialOutfits, handleClickOutfit } = useMyOutfitsPage();
  const navigate = useNavigate();

  return (
    <Stack>
      <Box sx={{ paddingRight: 3 }}>
        {/* general info (date/time and location) */}
        <Stack alignItems='center' direction='column' sx={{ m: '20px', color: '#32292F' }}>
          <Typography variant='h3'>
            <strong>My Outfits</strong>
          </Typography>
          <Typography variant='h4'>
            <strong>{userPartialOutfits.length} Outfits</strong>
          </Typography>
        </Stack>
        <Box className='tag_list right_padding'>
          {userPartialOutfits.map(outfit => (
            <OutfitCard key={outfit.oid} o={outfit} clickOutfit={handleClickOutfit} />
          ))}
        </Box>
      </Box>
      <Button
        variant='contained'
        size='large'
        sx={{
          textTransform: 'none',
          alignSelf: 'center',
          mt: 2,
          bgcolor: '#473BF0',
          color: '#f5f3f5',
        }}
        onClick={() => navigate('/createOutfit')}>
        Add New Outfit
      </Button>
    </Stack>
  );
};

export default MyOutfitsPage;
