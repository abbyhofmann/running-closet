import './index.css';
import { Card, Paper, Rating, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import { Box } from '@mui/system';
import StarIcon from '@mui/icons-material/Star';
import { OutfitData } from '../../../../types';
import useOutfitCard from '../../../../hooks/useOutfitCard';
import useUserContext from '../../../../hooks/useUserContext';

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

/**
 * Outfit component that displays partial information about a specific outfit.
 * The component displays the outfit's date, workout type, location, and rating.
 * It also triggers a click event to handle outfit selection and navigation to view outfit page, where
 * the outfit item details are also displayed.
 *
 * @param o - The outfit object.
 * @param clickOutfit - Function to handle outfit clicks.
 */
const OutfitCard = ({ o, clickOutfit }: OutfitCardProps) => {
  const { formatDateTime } = useOutfitCard();
  const { user } = useUserContext();

  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        bgcolor: '#fafafa',
        width: '100%',
        // height: '100%',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
      <Card
        sx={{
          width: '100%',
          bgcolor: grey[300],
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
        className='outfitNode'
        onClick={() => {
          clickOutfit(o.oid);
        }}>
        {user.username !== o.wearerUsername && (
          <Typography sx={{ fontStyle: 'italic' }}>
            <strong>{o.wearerUsername}</strong>
          </Typography>
        )}
        <Typography variant='h6' sx={{ color: '#302B27', marginY: 'auto' }}>
          <strong>{formatDateTime(o.dateWorn)}</strong>
        </Typography>
        <Typography fontSize={19} sx={{ color: '#473BF0', marginY: 'auto' }}>
          <strong>{o.runType} workout</strong>
        </Typography>
        <Typography sx={{ color: '#32292F', marginY: 'auto' }}>{o.location}</Typography>

        <Rating
          name='read-only'
          readOnly
          value={o.stars}
          precision={1}
          size='large'
          emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize='inherit' />}
        />
        <Box sx={{ padding: 1 }}>
          <img className='outfitCardImage' src={o.imageUrl} />
        </Box>
      </Card>
    </Paper>
  );
};

export default OutfitCard;
