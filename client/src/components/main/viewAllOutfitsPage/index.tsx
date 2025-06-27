import { Typography } from '@mui/material';
import { Box, Stack } from '@mui/system';
import '../myOutfitsPage/index.css';
import OutfitCard from '../myOutfitsPage/outfitCard';
import useViewAllOutfitsPage from '../../../hooks/useViewAllOutfitsPage';

const ViewAllOutfitsPage = () => {
  const { titleText, outfits, handleClickOutfit } = useViewAllOutfitsPage();

  return (
    <Box sx={{ padding: 3 }}>
      <Stack alignItems='center' direction='column' sx={{ m: '20px', color: '#32292F' }}>
        <Typography variant='h3' sx={{ m: 2 }}>
          <strong>{titleText}</strong>
        </Typography>
      </Stack>
      <Box className='my_outfit_list'>
        {outfits.map((o, idx) =>
          o._id && o.dateWorn && o.location && o.workout && o.rating && o.wearer && o.imageUrl ? ( // TODO - maybe clean this up and not have ternary operation return null...
            <OutfitCard
              key={o._id}
              o={{
                oid: o._id,
                wearerUsername: o.wearer?.username,
                dateWorn: o.dateWorn,
                location: o.location.toString(),
                runType: o.workout.runType,
                stars: o.rating.stars,
                imageUrl: o.imageUrl,
              }}
              clickOutfit={handleClickOutfit}
            />
          ) : null,
        )}
      </Box>
      {titleText === 'Search Results' && !outfits.length && (
        <Typography className='bold_title right_padding' sx={{ color: '#32292F' }}>
          No Outfits Found
        </Typography>
      )}
    </Box>
  );
};

export default ViewAllOutfitsPage;
