import { Box, Button } from '@mui/material';
import WorkoutCard from '../workoutCard';
import { OutfitItem, Workout } from '../../../../types';
import OutfitItemCard from '../outfitItemCard';

const OutfitItemScroller = ({
  outfitItems,
  outfitItemType,
  onCreateOutfitItem,
  onSelectOutfitItem,
}: {
  outfitItems: OutfitItem[];
  outfitItemType: string;
  onCreateOutfitItem: () => void;
  onSelectOutfitItem: (outfitItem: OutfitItem) => void;
}) => (
  <Box
    sx={{
      display: 'flex',
      overflowX: 'auto',
      padding: 2,
      gap: 2,
      scrollbarWidth: 'thin', // Optional: style scrollbar
    }}>
    {outfitItems.map(outfitItem => (
      <OutfitItemCard
        key={outfitItem._id?.toString()}
        outfitItem={outfitItem}
        onSelectOutfitItem={onSelectOutfitItem}
      />
    ))}

    {/* Card to Create New OutfitItem */}
    <Box
      sx={{
        minWidth: 300,
        maxWidth: 300,
        border: '1px dashed #ccc',
        borderRadius: 2,
        padding: 2,
        margin: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
        bgcolor: '#f9f9f9',
      }}
      onClick={onCreateOutfitItem}>
      <Button variant='contained' color='primary'>
        + Create New{' '}
        {String(outfitItemType).charAt(0).toUpperCase() + String(outfitItemType).slice(1)}
      </Button>
    </Box>
  </Box>
);

export default OutfitItemScroller;
