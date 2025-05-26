import './index.css';
import { Card, Rating, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import { Box } from '@mui/system';
import StarIcon from '@mui/icons-material/Star';
import { OutfitData } from '../../../../types';

/**
 * Props for the outfit card component.
 *
 * o - The outfit object.
 * clickOutfit - Function to handle the outfit click event.
 */
interface OutfitCardProps {
  o: OutfitData;
  clickOutfit: (outfitId: string) => void;
}

// formats date string into format of "May 25, 2025 at 7:30 am"
const formatDateTime = (date: string | Date) =>
  new Date(date)
    .toLocaleString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
    .replace('AM', 'am')
    .replace('PM', 'pm');

/**
 * Outfit component that displays partial information about a specific outfit.
 * The component displays the outfit's date, workout type, location, and rating.
 * It also triggers a click event to handle outfit selection and navigation to view outfit page, where
 * the outfit item details are also displayed.
 *
 * @param o - The outfit object.
 * @param clickOutfit - Function to handle outfit clicks.
 */
const OutfitCard = ({ o, clickOutfit }: OutfitCardProps) => (
  <Box sx={{ display: 'flex', alignItems: 'center' }}>
    <Card
      sx={{ bgcolor: grey[300] }}
      className='outfitNode'
      onClick={() => {
        clickOutfit(o.oid);
      }}>
      <Typography sx={{ color: '#E77963', marginY: 'auto' }}>
        <strong>{formatDateTime(o.dateWorn)}</strong>
      </Typography>
      <Typography sx={{ color: '#E77963', marginY: 'auto' }}>
        <strong>{o.runType} workout</strong>
      </Typography>
      <Typography sx={{ color: '#32292F', marginY: 'auto' }}>{o.location}</Typography>

      <Rating
        name='read-only'
        value={o.stars}
        precision={1}
        size='large'
        emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize='inherit' />}
      />
    </Card>
  </Box>
);

export default OutfitCard;
