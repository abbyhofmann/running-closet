import { Box, Card, Typography } from '@mui/material';
import { blue, grey } from '@mui/material/colors';
import { OutfitItem, Workout } from '../../../../types';

const OutfitItemCard = ({
  outfitItem,
  onSelectOutfitItem,
  selected,
}: {
  outfitItem: OutfitItem;
  onSelectOutfitItem: (outfitItem: OutfitItem) => void;
  selected: boolean;
}) => (
  <Card
    sx={{
      'display': 'flex',
      'cursor': 'pointer',
      '&:hover': {
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
        transform: 'scale(1.03)',
      },
      'borderRadius': 2,
      'backgroundColor': selected ? blue[100] : grey[400],
    }}
    onClick={() => {
      onSelectOutfitItem(outfitItem);
    }}>
    <Box
      sx={{
        padding: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
      }}>
      <Typography variant='h6' sx={{ fontWeight: 'bold' }}>
        {outfitItem.brand}
      </Typography>
      <Typography variant='body2' sx={{ color: 'rgba(0,0,0,0.6)' }}>
        {outfitItem.model}
      </Typography>
      <Typography variant='body2' sx={{ color: 'rgba(0,0,0,0.6)' }}>
        {outfitItem.s3PhotoUrl}
      </Typography>
    </Box>
  </Card>
);

export default OutfitItemCard;
