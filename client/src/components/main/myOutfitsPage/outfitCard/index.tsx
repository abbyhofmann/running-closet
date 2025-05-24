import React from 'react';
import './index.css';
import { Card, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import { OutfitData, TagData } from '../../../../types';
import useTagSelected from '../../../../hooks/useTagSelected';

/**
 * Props for the outfit card component.
 *
 * o - The outfit object.
 * clickOutfit - Function to handle the outfit click event.
 */
interface OutfitCardProps {
  o: OutfitData;
  clickOutfit: (tagName: string) => void;
}

/**
 * Outfit component that displays partial information about a specific outfit.
 * The component displays the outfit's date, workout type, location, and rating.
 * It also triggers a click event to handle outfit selection and navigation to view outfit page, where
 * the outfit item details are also displayed.
 *
 * @param o - The outfit object .
 * @param clickOutfit - Function to handle outfit clicks.
 */
const OutfitCard = ({ o, clickOutfit }: OutfitCardProps) => {
  const { tag } = useTagSelected(t);

  return (
    <Card
      sx={{ bgcolor: grey[300] }}
      className='outfitNode'
      onClick={() => {
        clickOutfit(t.name);
      }}>
      <Typography sx={{ color: '#E77963', marginY: 'auto' }}>
        <strong>{tag.name.toLowerCase()}</strong>
      </Typography>
      <Typography sx={{ color: '#32292F', marginY: 'auto' }}>{tag.description}</Typography>
      <Typography sx={{ color: '#5171A5', marginY: 'auto' }}>{t.qcnt} questions</Typography>
    </Card>
  );
};

export default OutfitCard;
