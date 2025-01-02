import React, { useState, useContext } from 'react';
import { Box, TextField, Button, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Outfit, ClothingItemFormProps } from '../../../../types';
import useClothingItemForm from '../../../../hooks/useClothingItemForm';
import OutfitContext from '../../../../contexts/OutfitContext';
import useOutfitContext from '../../../../hooks/useOutfitContext';
import useRatingForm from '../../../../hooks/useRatingForm';

const RatingForm = () => {
  const navigate = useNavigate();

  const {
    stars,
    temperatureGauge,
    newRatingError,
    showNewRatingError,
    setNewRatingError,
    handleStarsChange,
    handleTemperatureGaugeChange,
    handleSubmit,
  } = useRatingForm();

  const handleNext = () => {
    navigate(`../finalOutfitPage`);
  };

  return (
    <div></div>
    // <div className='container'>
    //   <Box
    //     sx={{
    //       textAlign: 'center',
    //       marginBottom: 1,
    //       marginX: 'auto',
    //       color: '#32292F',
    //       display: 'flex',
    //     }}></Box>
    //   <h4>Please enter {clothingItem} details below.</h4>
    //   <form
    //     onSubmit={e => {
    //       handleSubmit(e).then(() => handleNext());
    //     }}>
    //     <div className='row'>
    //       <label className='clothing-item-photo' htmlFor='clothing-item-photo'>
    //         Upload Photo:
    //       </label>
    //     </div>
    //     <div className='row'>
    //       <TextField
    //         id='brand-name-input'
    //         label='Brand Name'
    //         required
    //         value={brand}
    //         sx={{ marginX: 'auto', width: '25ch' }}
    //         onChange={handleBrandChange}
    //       />
    //       <TextField
    //         id='model-name-input'
    //         label='Model Name'
    //         required
    //         value={model}
    //         sx={{ marginX: 'auto', width: '25ch' }}
    //         onChange={handleModelChange}
    //       />
    //     </div>

    //     {showCreateClothingItemError && (
    //       <div className='alert-container'>
    //         <Alert severity='error' className='error-alert'>
    //           {createClothingItemError}
    //         </Alert>
    //       </div>
    //     )}
    //     <Button variant='contained' type='submit' sx={{ mt: 2, width: '25ch', bgcolor: '#5171A5' }}>
    //       Create {clothingItem}
    //     </Button>
    //   </form>
    // </div>
  );
};

export default RatingForm;
