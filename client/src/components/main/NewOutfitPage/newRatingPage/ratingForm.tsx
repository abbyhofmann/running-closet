import React, { useState, useContext } from 'react';
import { Box, TextField, Button, Alert, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Outfit, ClothingItemFormProps } from '../../../../types';
import useClothingItemForm from '../../../../hooks/useClothingItemForm';
import OutfitContext from '../../../../contexts/OutfitContext';
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

  const handleNext = () => {
    navigate(`../finalOutfitPage`);
  };

  return (
    <div>
      <span>outfit: {outfit.toString()}</span>
      <RatingStars stars={stars} setStars={setStars} />
      <TempGauge tempGauge={temperatureGauge} setTempGauge={setTemperatureGauge} />
      <Button onClick={() => handleSubmit()}>Create Outfit!</Button>
    </div>
  );
};

export default RatingForm;
