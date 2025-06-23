import { Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Box } from '@mui/system';
import { OrderType, Outfit } from '../../../types';
import OutfitsSearchBar from './outfitsSearchBar';
import { getOutfitsByFilter } from '../../../services/outfitService';
import OutfitCard from '../myOutfitsPage/outfitCard';

// TODO - hook for this
const ViewAllOutfitsPage = () => {
  const [searchParams] = useSearchParams();
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [titleText, setTitleText] = useState<string>('All Outfits');
  const [search, setSearch] = useState<string>('');
  const [outfitOrder, setOutfitOrder] = useState<OrderType>('newest');

  const navigate = useNavigate();

  const handleClickOutfit = (outfitId: string) => {
    navigate(`/outfit/${outfitId}`);
  };

  useEffect(() => {
    let pageTitle = 'All Outfits';
    let searchString = '';

    const searchQuery = searchParams.get('search');

    if (searchQuery) {
      pageTitle = 'Search Results';
      searchString = searchQuery;
    }

    setTitleText(pageTitle);
    setSearch(searchString);
  }, [searchParams]);

  useEffect(() => {
    /**
     * Function to fetch outfits based on the search.
     */
    const fetchData = async () => {
      try {
        const res = await getOutfitsByFilter(outfitOrder, search);
        setOutfits(res || []);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
      }
    };

    fetchData();
  }, [outfitOrder, search]);

  return (
    <Box>
      <Typography>All Outfits / Search Results</Typography>
      <OutfitsSearchBar />
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
