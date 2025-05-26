import { Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Stack } from '@mui/system';
import useOutfitContext from '../../../../hooks/useOutfitContext';
import useRatingForm from '../../../../hooks/useRatingForm';
import RatingStars from './ratingStars';
import TempGauge from './tempGauge';

const RatingForm = () => {
  const navigate = useNavigate();
  const { outfit } = useOutfitContext();

  const {
    stars,
    setStars,
    temperatureGauge,
    setTemperatureGauge,
    newRatingError,
    showNewRatingError,
    setNewRatingError,
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
    </Stack>
  );
};

export default RatingForm;
