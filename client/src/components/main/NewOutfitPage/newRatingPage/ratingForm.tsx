import { Button, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import useRatingForm from '../../../../hooks/useRatingForm';
import RatingStars from './ratingStars';
import TempGauge from './tempGauge';
import ErrorPopup from '../createOutfitErrorPopup/createOutfitErrorPopup';

const RatingForm = () => {
  const {
    stars,
    setStars,
    temperatureGauge,
    setTemperatureGauge,
    newRatingError,
    showNewRatingErrorPopup,
    handleNewRatingErrorPopupClose,
    handleSubmit,
  } = useRatingForm();

  return (
    <Stack alignItems='center' direction='column' spacing={4} sx={{ px: { xs: 2, md: 9 }, mt: 4 }}>
      <Typography variant='h4' sx={{ color: '#32292F' }}>
        <strong>Rate Your Outfit</strong>
      </Typography>
      <RatingStars stars={stars} setStars={setStars} />
      <TempGauge tempGauge={temperatureGauge} setTempGauge={setTemperatureGauge} />
      <Button
        variant='contained'
        size='large'
        sx={{ alignSelf: 'center', bgcolor: '#473BF0', color: '#f5f3f5' }}
        onClick={() => handleSubmit()}>
        Create Outfit!
      </Button>
      <ErrorPopup
        open={showNewRatingErrorPopup}
        onClose={handleNewRatingErrorPopupClose}
        errorMessage={newRatingError}
      />
    </Stack>
  );
};

export default RatingForm;
