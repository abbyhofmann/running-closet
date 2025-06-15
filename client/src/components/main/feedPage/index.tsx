import React, { useEffect, useState } from 'react';
import { Box } from '@mui/system';
import { Typography } from '@mui/material';
import { Outfit } from '../../../types';
import useUserContext from '../../../hooks/useUserContext';

/**
 * FeedPage component renders a page displaying a list of outfits of the logged-in user's following list.
 */
const FeedPage = () => {
  const { user } = useUserContext();
  const [outfitFeed, setOutfitFeed] = useState<Outfit[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // go through user.following - for each person, add outfit to list of outfits, then fetch outfits by id to render (map call)
        const followingOutfits: Outfit[] = [];
        user.following.map(followingUser => followingOutfits.concat(followingUser.outfits));
        setOutfitFeed(followingOutfits);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error fetching question:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <Box>
      <Box id='question_list' className='question_list'>
        {outfitFeed.map((feedItem, idx) => (
          <Typography key={idx}>{feedItem._id}</Typography>
          //   <QuestionView q={feedItem} key={idx} />
        ))}
      </Box>
      <Typography>{outfitFeed.length}</Typography>
      {/* {titleText === 'Search Results' && !qlist.length && (
        <Typography className='bold_title right_padding' sx={{ color: '#32292F' }}>
          No Questions Found
        </Typography>
      )} */}
    </Box>
  );
};

export default FeedPage;
