import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import OutfitsSearchBar from './outfitsSearchBar';
import OutfitCard from '../myOutfitsPage/outfitCard';
import useViewAllOutfitsPage from '../../../hooks/useViewAllOutfitsPage';

// TODO - hook for this
const ViewAllOutfitsPage = () => {
  const { titleText, outfits, handleClickOutfit } = useViewAllOutfitsPage();

  return (
    <Box>
      {/* <OutfitsSearchBar /> */}
      <Typography>{titleText}</Typography>
      <Box id='outfit_list' className='outfit_list'>
        {outfits.map((o, idx) =>
          o._id && o.dateWorn && o.location && o.workout && o.rating ? ( // TODO - maybe clean this up and not have ternary operation return null...
            <OutfitCard
              key={o._id}
              o={{
                oid: o._id,
                dateWorn: o.dateWorn,
                location: o.location.toString(),
                runType: o.workout.runType,
                stars: o.rating.stars,
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
