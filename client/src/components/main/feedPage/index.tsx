import React, { useEffect, useState } from 'react';
import { Box } from '@mui/system';
import { Typography } from '@mui/material';
import { Outfit } from '../../../types';
import useUserContext from '../../../hooks/useUserContext';
import { getOutfitById } from '../../../services/outfitService';

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
        console.log('user outfits: ', user.following[0].outfits);

        // user.following.forEach(async followingUser => {
        //   const userOutfits = followingUser.outfits;
        //   await Promise.all(
        //     userOutfits.map(async (outfit: Outfit) => {
        //       if (outfit._id) {
        //         const fetchedOutfit = await getOutfitById(outfit._id);
        //         followingOutfits.push(fetchedOutfit);
        //       }
        //     }),
        //   );
        // });
        // const outfitPromises = user.following.flatMap(followingUser =>
        //   followingUser.outfits
        //     .filter(o => o._id) // keep only outfits with an ID
        //     .map(o => getOutfitById(o._id)),
        // );

        // const fetchedOutfits = await Promise.all(outfitPromises);

        // console.log('outfits:', fetchedOutfits);
        // setOutfitFeed(fetchedOutfits);
        console.log('outfits: ', followingOutfits);
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
