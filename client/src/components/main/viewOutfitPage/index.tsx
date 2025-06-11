import { Rating, Typography } from '@mui/material';
import { Box, Stack } from '@mui/system';
import StarIcon from '@mui/icons-material/Star';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import { Outfit } from '../../../types';
import './index.css';
import OutfitItemCard from '../newOutfitPage/outfitItemCard';
import useViewOutfitPage from '../../../hooks/useViewOutfitPage';

const ViewOutfitPage = () => {
  const { outfit, isShoe, formatDateTime, mapImageUrl, outfitItemNamesAndIcons } =
    useViewOutfitPage();

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
      <Stack sx={{ color: '#32292F' }}>
        <Stack alignItems='center' direction='column'>
          {/* general info (date/time and location) */}
          <Stack alignItems='center' direction='column' sx={{ mb: '30px' }}>
            <Typography fontStyle='italic' variant='h3'>
              <strong>{formatDateTime(outfit?.dateWorn ? outfit?.dateWorn : new Date())}</strong>
            </Typography>
            <Typography variant='h4'>
              <strong>{outfit?.location?.toString()}</strong>
            </Typography>
          </Stack>
          <Stack alignItems='center' direction='row' sx={{ mb: '30px', gap: 5 }}>
            {/* run type and weather info container */}
            <Stack direction='column' sx={{ gap: 2 }}>
              {/* run type */}
              <Box>
                <Typography variant='h5'>
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
              </Box>
              {/* weather info */}
              <Stack direction='column' justifyContent='flex-start'>
                <Stack alignItems='center' direction='row' sx={{ gap: 1 }}>
                  <Box>
                    <Typography>
                      <strong>Temperature:</strong> {78}°F
                    </Typography>
                    <Typography>
                      <strong>Conditions:</strong> Sunny
                    </Typography>
                    <Typography>
                      <strong>Humidity:</strong> {50}%
                    </Typography>
                  </Box>
                  <img src={`/weatherIcons/clear-day.svg`} />
                </Stack>
              </Stack>
            </Stack>
            {/* map of location */}
            <img
              src={mapImageUrl}
              alt='Map showing where the outfit was worn'
              style={{ borderRadius: 8, width: '100%', maxWidth: 500 }}
            />
            {/* outfit rating */}
            <Stack alignItems='center' direction='column' sx={{ mb: '30px', gap: 2 }}>
              {outfit.rating && (
                <Stack alignItems='flex-start' direction='column' sx={{ gap: 3 }}>
                  {/* stars */}
                  <Stack alignItems='center' direction='column'>
                    <Typography variant='h5'>
                      <strong>Performance</strong>
                    </Typography>
                    <Rating
                      name='read-only'
                      readOnly
                      value={outfit.rating.stars}
                      precision={1}
                      size='large'
                      icon={
                        <StarIcon style={{ width: '50px', height: '50px' }} fontSize='inherit' />
                      }
                      emptyIcon={
                        <StarIcon
                          style={{ width: '50px', height: '50px', opacity: 0.55 }}
                          fontSize='inherit'
                        />
                      }
                    />
                  </Stack>
                  {/* temperature gauge */}
                  <Stack alignItems='center' direction='column'>
                    <Typography variant='h5'>
                      <strong>Temperature Suitability</strong>
                    </Typography>
                    {renderTempGauge(outfit.rating.temperatureGauge)}
                    <Typography variant='h6'>{outfit.rating.temperatureGauge}</Typography>
                  </Stack>
                </Stack>
              )}
            </Stack>
            {/* TODO - remove hardcoding of the weather details & update api query to be more efficient and not hit the limit */}
            {/* <Stack alignItems='center' direction='column'>
                <Typography variant='h6' color='#473BF0'>
                  <strong>Weather on Run</strong>
                </Typography>
                <Stack alignItems='center' direction='row'>
                  <Box>
                    <Typography>
                      <strong>Temperature:</strong> {78}°F
                    </Typography>
                    <Typography>
                      <strong>Conditions:</strong> Sunny
                    </Typography>
                    <Typography>
                      <strong>Humidity:</strong> {50}%
                    </Typography>
                  </Box>
                  <img src={`/weatherIcons/clear-day.svg`} />
                </Stack>
              </Stack> */}
          </Stack>
        </Stack>

        {/* outfit item table */}
        <Box className='outfit_items_columns right_padding'>
          {/* map must be converted to array to call map on it */}
          {Array.from(outfitItemNamesAndIcons.entries()).map(([name, Icon]) => (
            <Box
              key={name}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                textAlign: 'center', // center text within children
                gap: 1, // optional spacing between title and items
              }}>
              <Box>
                <Typography variant='h5'>
                  <strong>{name}</strong>
                </Typography>
                <Icon color='#473BF0' size={'40px'} />
              </Box>
              {renderOutfitItems(name, outfit)}
            </Box>
          ))}
        </Box>
      </Stack>
    </div>
  );
};

export default ViewOutfitPage;
