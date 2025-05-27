import { Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Stack } from '@mui/system';
import { Outfit, Shoe, User, Workout, Rating } from '../../../types';
import { getOutfitById } from '../../../services/outfitService';
import './index.css';

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

  const isShoe = (
    shoe: string | Shoe | User | Date | Workout | Rating | undefined,
  ): shoe is Shoe => {
    console.log('shoe: ', shoe);
    return (shoe as Shoe).brand !== undefined && (shoe as Shoe).model !== undefined;
  };

  const renderOutfitItems = (name: string, outfitToRender: Outfit | null) => {
    const key = name.toLowerCase();
    const items = outfitToRender?.[key as keyof Outfit];
    console.log('items: ', items, ', name: ', name, ', outfitToRender: ', outfitToRender);

    if (Array.isArray(items)) {
      return items.length > 0 ? (
        items.map(item => <Typography key={item._id}>{item.model}</Typography>)
      ) : (
        <Typography color='text.secondary'>No {name}</Typography>
      );
    }
    if (isShoe(items)) {
      return <Typography>{items.model}</Typography>;
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
      <Typography>{outfit?.tops.length.toString()}</Typography>
      <Typography>{outfit?.bottoms.length.toString()}</Typography>
      <Typography>{outfit?.shoes?.toString()}</Typography>
      <Typography>{outfit?.outerwear.length.toString()}</Typography>
      <Typography>{outfit?.accessories.length.toString()}</Typography>
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
            {outfitItemNames.map(name => {
              console.log('outfitttt: ', outfit);
              return (
                <div key={name}>
                  <Typography variant='h6'>{name}</Typography>
                  {renderOutfitItems(name, outfit)}
                </div>
              );
            })}
          </Box>
        </Box>
      </Stack>
    </div>
  );
};

export default ViewOutfitPage;
