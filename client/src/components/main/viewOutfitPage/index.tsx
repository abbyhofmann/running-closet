import { Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Outfit } from '../../../types';
import { getOutfitById } from '../../../services/outfitService';

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

  return (
    <div>
      <Typography>View Outfit Page! outfit id: {oid}</Typography>
      <Typography>{outfit?.dateWorn?.toString()}</Typography>
      <Typography>{outfit?.location?.toString()}</Typography>
      <Typography>{outfit?.tops.length.toString()}</Typography>
      <Typography>{outfit?.bottoms.length.toString()}</Typography>
      <Typography>{outfit?.shoe?.toString()}</Typography>
      <Typography>{outfit?.outerwear.length.toString()}</Typography>
      <Typography>{outfit?.accessories.length.toString()}</Typography>
      <Typography>{outfit?.rating?.stars.toString()}</Typography>
      <Typography>{outfit?.rating?.temperatureGauge.toString()}</Typography>
    </div>
  );
};

export default ViewOutfitPage;
