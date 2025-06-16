import './index.css';
import { Card, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import { Box } from '@mui/system';
import { useEffect, useState } from 'react';
import useOutfitCard from '../../../../hooks/useOutfitCard';
import { getUsernameById } from '../../../../services/userService';

/**
 * Props for the feed card component.
 *
 * wearer: the id of the user who created the outfit.
 * dateWorn: the date (date/time) the user wore the outfit.
 * photoUrl: the s3 url of the outfit's photo. - TODO: make this not hard-coded by adding a photo field to
 *      outfit and making it required to upload a photo upon outfit creation! also, should location be added?
 * clickOutfit - Function to handle the outfit click event.
 */
interface FeedCardProps {
  wearer: string;
  dateWorn: Date;
  photoUrl: string;
  clickOutfit: () => void;
}

/**
 * Feed component that displays partial information about a specific outfit.
 * The component displays the outfit's wearer (their username), date/time worn, and a photo of the outfit.
 * It also triggers a click event to navigate to a view outfit page, where the full outfit item details are displayed.
 *
 * @returns The FeedCard component.
 */
const FeedCard = (props: FeedCardProps) => {
  const { wearer, dateWorn, photoUrl, clickOutfit } = props;
  const { formatDateTime } = useOutfitCard();

  const [username, setUsername] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedUsername = await getUsernameById(wearer);
        if (fetchedUsername) {
          setUsername(fetchedUsername);
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error fetching username:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <Box sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
      <Card
        sx={{ bgcolor: grey[300] }}
        className='outfitNode'
        onClick={() => {
          clickOutfit();
        }}>
        <Typography fontSize={19} sx={{ color: '#473BF0', marginY: 'auto' }}>
          <strong>{username}</strong>
        </Typography>
        <Typography variant='h6' sx={{ color: '#302B27', marginY: 'auto' }}>
          <strong>{formatDateTime(dateWorn)}</strong>
        </Typography>
        <img src={photoUrl} />
      </Card>
    </Box>
  );
};

export default FeedCard;
