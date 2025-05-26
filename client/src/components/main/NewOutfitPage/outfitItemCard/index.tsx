import { Box, Card, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import { OutfitItem } from '../../../../types';

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
      'minWidth': 150, // default width
      'maxWidth': '100%', // allow for expansion of width if needed
      'height': 140, // fixed height
      'flexDirection': 'column',
      'flex': '0 0 auto',
      '&:hover': {
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
        transform: 'scale(1.03)',
      },
      'borderRadius': 2,
      'backgroundColor': selected ? '#abffff' : grey[300],
      'overflow': 'hidden',
    }}
    onClick={() => {
      onSelectOutfitItem(outfitItem);
    }}>
    <Box
      sx={{
        padding: 2,
        px: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        margin: '0 auto',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
      }}>
      <Typography
        variant='h6'
        sx={{
          fontWeight: 'bold',
          textAlign: 'center',
          width: '100%',
          overflowWrap: 'break-word',
          wordBreak: 'break-word',
        }}>
        {outfitItem.brand}
      </Typography>
      <Typography
        variant='body2'
        sx={{
          color: 'rgba(0,0,0,0.6)',
          textAlign: 'center',
          width: '100%',
          overflowWrap: 'break-word',
          wordBreak: 'break-word',
        }}>
        {outfitItem.model}
      </Typography>
      <Typography
        variant='body2'
        sx={{
          color: 'rgba(0,0,0,0.6)',
          textAlign: 'center',
          width: '100%',
          overflowWrap: 'break-word',
          wordBreak: 'break-word',
        }}>
        {outfitItem.s3PhotoUrl}
      </Typography>
    </Box>
  </Card>
);

export default OutfitItemCard;
