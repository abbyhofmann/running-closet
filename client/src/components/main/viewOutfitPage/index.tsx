import { Rating, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Stack } from '@mui/system';
import StarIcon from '@mui/icons-material/Star';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import {
  Outfit,
  Shoe,
  User,
  Workout,
  LocationCoordinates,
  Rating as RatingType,
  HourlyWeather,
} from '../../../types';
import {
  forwardGeocodeLocation,
  generateStaticMapImage,
  getHistoricalWeatherData,
  getOutfitById,
} from '../../../services/outfitService';
import './index.css';
import OutfitItemCard from '../newOutfitPage/outfitItemCard';
import useOutfitCard from '../../../hooks/useOutfitCard';

const ViewOutfitPage = () => {
  const { oid } = useParams();

  const outfitItemNames = ['Tops', 'Bottoms', 'Shoes', 'Outerwear', 'Accessories'];
  const [outfit, setOutfit] = useState<Outfit | null>(null);
  const [locationCoordinates, setLocationCoordinates] = useState<LocationCoordinates | null>(null);
  const [mapImageUrl, setMapImageUrl] = useState<string>('');
  const [weather, setWeather] = useState<HourlyWeather | null>(null);
  const { formatDateTime } = useOutfitCard();

  useEffect(() => {
    async function fetchOutfitData() {
      if (oid) {
        const fetchedOutfit = await getOutfitById(oid);
        setOutfit(fetchedOutfit);
      }
    }
    fetchOutfitData();
  }, [oid]);

  useEffect(() => {
    async function fetchCoordinateData() {
      if (outfit && outfit.location) {
        const fetchedCoordinates = await forwardGeocodeLocation(outfit.location);
        setLocationCoordinates(fetchedCoordinates);
      }
    }
    fetchCoordinateData();
  }, [outfit]);

  useEffect(() => {
    async function fetchMapImageUrl() {
      if (locationCoordinates) {
        const fetchedMapImageUrl = await generateStaticMapImage(locationCoordinates);
        setMapImageUrl(fetchedMapImageUrl);
      }
    }

    fetchMapImageUrl();
  }, [locationCoordinates]);

  //   useEffect(() => {
  //     async function fetchWeatherData() {
  //       if (outfit?.dateWorn && locationCoordinates) {
  //         const fetchedWeather = await getHistoricalWeatherData(
  //           locationCoordinates,
  //           outfit?.dateWorn,
  //         );
  //         console.log('fetcheddd weather: ', fetchedWeather);
  //         setWeather(fetchedWeather);
  //       }
  //     }
  //     fetchWeatherData();
  //   }, [locationCoordinates, outfit]);

  const isShoe = (
    shoe: string | Shoe | User | Date | Workout | RatingType | undefined,
  ): shoe is Shoe => (shoe as Shoe).brand !== undefined && (shoe as Shoe).model !== undefined;

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

  const renderTempGauge = (ratingTempGuage: string) => {
    if (ratingTempGuage === 'Too Cold') {
      return (
        <ThermostatIcon
          style={{ width: '70px', height: '70px' }}
          fontSize='large'
          color='primary'
        />
      );
    }
    if (ratingTempGuage === 'Too Warm') {
      return (
        <ThermostatIcon style={{ width: '70px', height: '70px' }} fontSize='large' color='error' />
      );
    }
    return (
      <ThermostatIcon style={{ width: '70px', height: '70px' }} fontSize='large' color='action' />
    );
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
      {/* {weather && (
        <Box>
          <Typography variant='h6'>Weather on Run</Typography>
          <Typography>Temperature: {weather.temp}°F</Typography>
          <Typography>Conditions: {weather.conditions}</Typography>
          <Typography>Humidity: {weather.humidity}%</Typography>
          <img src={`/weatherIcons/${weather.icon}.svg`} />
        </Box>
      )} */}

      <Stack>
        <Typography fontStyle='italic' variant='h4'>
          <strong>{formatDateTime(outfit?.dateWorn ? outfit?.dateWorn : new Date())}</strong>
        </Typography>
        <Typography variant='h5'>
          <strong>{outfit?.location?.toString()}</strong>
        </Typography>
        <Box sx={{ paddingRight: 3 }}>
          {/* <Box className='space_between right_padding'></Box>  */}
          <Stack alignItems='center' direction='row'>
            <Stack alignItems='center' direction='column'>
              <Typography variant='h5' color='#473BF0'>
                <strong>{outfit.workout?.runType} </strong>run
              </Typography>
              <Typography>
                <strong>Distance: </strong>
                {outfit.workout?.distance} miles
              </Typography>
              <Typography>
                <strong>Duration: </strong>
                {outfit.workout?.duration} minutes
              </Typography>
            </Stack>
            <img
              src={mapImageUrl}
              alt='Map showing where the outfit was worn'
              style={{ borderRadius: 8, width: '100%', maxWidth: 500 }}
            />
          </Stack>
          {outfit.rating && (
            <Stack alignItems='center' direction='row'>
              <Rating
                name='read-only'
                readOnly
                value={outfit.rating.stars}
                precision={1}
                size='large'
                emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize='inherit' />}
              />
              {renderTempGauge(outfit.rating.temperatureGauge)}
            </Stack>
          )}
          <Typography variant='h5'>
            <strong>Outfit Details</strong>
          </Typography>
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
