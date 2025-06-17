import './index.css';
import { Card, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import { Box } from '@mui/system';
import useOutfitCard from '../../../../hooks/useOutfitCard';

/**
 * Props for the feed card component.
 *
 * username: the username of the user who created the outfit.
 * dateWorn: the date (date/time) the user wore the outfit.
 * photoUrl: the s3 url of the outfit's photo. - TODO: make this not hard-coded by adding a photo field to
 *      outfit and making it required to upload a photo upon outfit creation! also, should location be added?
 * clickOutfit - Function to handle the outfit click event.
 */
interface FeedCardProps {
  username: string;
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
  const { username, dateWorn, photoUrl, clickOutfit } = props;
  const { formatDateTime } = useOutfitCard();

  return (
    <Box sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
      <Card
        sx={{ bgcolor: grey[300] }}
        className='feedNode'
        onClick={() => {
          clickOutfit();
        }}>
        <Typography fontSize={19} sx={{ color: '#473BF0', marginY: 'auto' }}>
          <strong>{username}</strong>
        </Typography>
        <Typography variant='h6' sx={{ color: '#302B27', marginY: 'auto' }}>
          <strong>{formatDateTime(dateWorn)}</strong>
        </Typography>
        <img className='feedImage' src={photoUrl} />
      </Card>
    </Box>
  );
};

export default FeedCard;
