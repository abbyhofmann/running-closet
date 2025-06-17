import { useEffect, useState } from 'react';
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
      {/* <Paper
        elevation={3}
        sx={{
          margin: 'auto',
          width: 'fit-content', // shrink-wrap to content
          maxWidth: '100%', // cap it on very large screens
          p: 2,
          bgcolor: '#fafafa',
        }}> */}
      <FeedScroller outfits={outfitFeed} />
      {/* </Paper> */}
    </Box>
  );
};

export default FeedPage;
