import React, { useEffect, useState } from 'react';
import { Box } from '@mui/system';
import { Paper, Typography } from '@mui/material';
import { Outfit } from '../../../types';
import useUserContext from '../../../hooks/useUserContext';
import { getOutfitById } from '../../../services/outfitService';
import FeedScroller from './feedScroller';

/**
 * FeedPage component renders a page displaying a list of outfits of the logged-in user's following list.
 */
const FeedPage = () => {
  const { user } = useUserContext();
  const [outfitFeed, setOutfitFeed] = useState<Outfit[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const outfitPromises: Promise<Outfit>[] = [];

        for (const followingUser of user.following) {
          for (const o of followingUser.outfits) {
            if (o._id) {
              outfitPromises.push(getOutfitById(o._id));
            }
          }
        }

        const fetchedOutfits = await Promise.all(outfitPromises);
        setOutfitFeed(fetchedOutfits);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error fetching outfits:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <Box>
      <Paper elevation={3} sx={{ p: 3, bgcolor: '#fafafa' }}>
        <FeedScroller outfits={outfitFeed} />
      </Paper>
      <Box id='feed_outfit_list' className='feed_outfit_list'>
        {outfitFeed.map(feedItem => (
          <Typography key={feedItem._id?.toString()}>{feedItem._id?.toString()}</Typography>
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
