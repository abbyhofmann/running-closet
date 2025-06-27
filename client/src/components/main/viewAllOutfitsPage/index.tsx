import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import OutfitCard from '../myOutfitsPage/outfitCard';
import useViewAllOutfitsPage from '../../../hooks/useViewAllOutfitsPage';

const ViewAllOutfitsPage = () => {
  const { titleText, outfits, handleClickOutfit } = useViewAllOutfitsPage();

  return (
    <Box>
      <Typography>{titleText}</Typography>
      <Box id='outfit_list' className='outfit_list'>
        {outfits.map((o, idx) =>
          o._id && o.dateWorn && o.location && o.workout && o.rating && o.wearer ? ( // TODO - maybe clean this up and not have ternary operation return null...
            <OutfitCard
              key={o._id}
              o={{
                oid: o._id,
                wearer: o.wearer?.username,
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
