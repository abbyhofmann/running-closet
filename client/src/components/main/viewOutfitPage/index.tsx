import { Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Stack } from '@mui/system';
import { Outfit, Shoe, User, Workout, Rating } from '../../../types';
import { getOutfitById } from '../../../services/outfitService';
import './index.css';
import OutfitItemCard from '../newOutfitPage/outfitItemCard';

const ViewOutfitPage = () => {
  const { oid } = useParams();

  const outfitItemNames = ['Tops', 'Bottoms', 'Shoes', 'Outerwear', 'Accessories'];
  const [outfit, setOutfit] = useState<Outfit | null>(null);

  useEffect(() => {
    async function fetchData() {
      if (oid) {
        const fetchedOutfit = await getOutfitById(oid);
        console.log('fetched outfit: ', fetchedOutfit);
        setOutfit(fetchedOutfit);
      }
    }
    fetchData();
  }, [oid]);

  const isShoe = (shoe: string | Shoe | User | Date | Workout | Rating | undefined): shoe is Shoe =>
    (shoe as Shoe).brand !== undefined && (shoe as Shoe).model !== undefined;

  const renderOutfitItems = (name: string, outfitToRender: Outfit | null) => {
    const key = name.toLowerCase();
    const items = outfitToRender?.[key as keyof Outfit];

    if (Array.isArray(items)) {
      return items.length > 0 ? (
        items.map(item => (
          <div key={item._id} style={{ marginBottom: 10 }}>
            <OutfitItemCard outfitItem={item} onSelectOutfitItem={() => {}} selected={false} />
          </div>
        ))
      ) : (
        <Typography color='text.secondary'>No {name}</Typography>
      );
    }
    if (isShoe(items)) {
      return (
        <div key={items._id} style={{ marginBottom: 10 }}>
          <OutfitItemCard outfitItem={items} onSelectOutfitItem={() => {}} selected={false} />
        </div>
      );
    }
    return <Typography color='text.secondary'>No Shoes</Typography>;
  };

  if (!outfit) {
    return <Typography>Loading outfit...</Typography>;
  }

  return (
    <div>
      <Typography>View Outfit Page! outfit id: {oid}</Typography>
      <Typography>{outfit?.dateWorn?.toString()}</Typography>
      <Typography>{outfit?.location?.toString()}</Typography>
      <Typography>{outfit?.rating?.stars.toString()}</Typography>
      <Typography>{outfit?.rating?.temperatureGauge.toString()}</Typography>

      <Stack>
        <Box sx={{ paddingRight: 3 }}>
          <Box className='space_between right_padding'>
            <Typography variant='h5'>
              <strong>Outfits</strong>
            </Typography>
            <Typography variant='h5'>
              <strong>My Outfits</strong>
            </Typography>
          </Box>
          <Box className='outfit_items_columns right_padding'>
            {outfitItemNames.map(name => (
              <Box
                key={name}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  textAlign: 'center', // center text within children
                  gap: 1, // optional spacing between title and items
                }}>
                <Typography variant='h5'>
                  <strong>{name}</strong>
                </Typography>
                {renderOutfitItems(name, outfit)}
              </Box>
            ))}
          </Box>
        </Box>
      </Stack>
    </div>
  );
};

export default ViewOutfitPage;
