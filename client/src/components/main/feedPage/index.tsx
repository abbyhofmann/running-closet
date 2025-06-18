import { useEffect, useState } from 'react';
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
    <div>
      <FeedScroller outfits={outfitFeed} />
    </div>
  );
};

export default FeedPage;
