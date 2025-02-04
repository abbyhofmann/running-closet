import { Box, Card, Typography } from '@mui/material';
import { useState } from 'react';
import { purple } from '@mui/material/colors';
import { OutfitItem } from '../../../../types';
import OutfitItemCard from '../outfitItemCard';
import NewOutfitItemPopup from '../newOutfitItemPopup';

const OutfitItemScroller = ({
  outfitItems,
  outfitItemType,
  onSelectOutfitItem,
  currentSelectedOutfitItems,
  onNewOutfitItemCreated,
  popupOpen,
  onPopupOpen,
  onPopupClose,
}: {
  outfitItems: OutfitItem[];
  outfitItemType: string;
  onSelectOutfitItem: (outfitItem: OutfitItem) => void;
  currentSelectedOutfitItems: OutfitItem[];
  onNewOutfitItemCreated: (newOutfitItem: OutfitItem | null) => void;
  popupOpen: boolean;
  onPopupOpen: () => void;
  onPopupClose: () => void;
}) => {
  const [currentType, setCurrentType] = useState<string>(outfitItemType); // track current type

  const handleCreateClick = () => {
    setCurrentType(outfitItemType); // set the current type for this scroller
    onPopupOpen();
  };

  return (
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
          selected={currentSelectedOutfitItems.includes(outfitItem)}
        />
      ))}

      {/* Card to Create New OutfitItem */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'pointer',
        }}
        onClick={handleCreateClick}>
        <Card
          sx={{
            'display': 'flex',
            'cursor': 'pointer',
            '&:hover': {
              boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
              transform: 'scale(1.03)',
            },
            'borderRadius': 2,
            'backgroundColor': purple[100],
          }}>
          <Box
            sx={{
              padding: 2,
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
            }}>
            <Typography variant='h6' sx={{ fontWeight: 'bold' }}>
              + Create New{' '}
              {String(outfitItemType).charAt(0).toUpperCase() + String(outfitItemType).slice(1)}
            </Typography>
          </Box>
        </Card>
        <NewOutfitItemPopup
          open={popupOpen}
          onClose={() => onPopupClose()}
          outfitItemType={currentType}
          onNewOutfitItemCreated={onNewOutfitItemCreated}
        />
      </Box>
    </Box>
  );
};

export default OutfitItemScroller;
