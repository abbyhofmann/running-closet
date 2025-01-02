import React, { useState, useContext } from 'react';
import { Box, TextField, Button, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Outfit, Bottom } from '../../../../types';
import useBottomForm from '../../../../hooks/useBottomForm';
import OutfitContext from '../../../../contexts/OutfitContext';
import useOutfitContext from '../../../../hooks/useOutfitContext';

const BottomForm = () => {
  const navigate = useNavigate();

  const {
    brand,
    model,
    createBottomError,
    showCreateBottomError,
    handleBrandChange,
    handleModelChange,
    handleSubmit,
  } = useBottomForm();

  const handleNext = () => {
    navigate('createOutfit/outerwear');
  };

  return (
    <div className='container'>
      <Box
        sx={{
          textAlign: 'center',
          marginBottom: 1,
          marginX: 'auto',
          color: '#32292F',
          display: 'flex',
        }}></Box>
      <h4>Please enter bottom details below.</h4>
      <form
        onSubmit={e => {
          handleSubmit(e).then(() => handleNext());
        }}>
        <div className='row'>
          <label className='bottom-photo' htmlFor='bottom-photo'>
            Upload Bottom Photo:
          </label>
        </div>
        <div className='row'>
          <TextField
            id='brand-name-input'
            label='Brand Name'
            required
            value={brand}
            sx={{ marginX: 'auto', width: '25ch' }}
            onChange={handleBrandChange}
          />
          <TextField
            id='model-name-input'
            label='Model Name'
            required
            value={model}
            sx={{ marginX: 'auto', width: '25ch' }}
            onChange={handleModelChange}
          />
        </div>

        {showCreateBottomError && (
          <div className='alert-container'>
            <Alert severity='error' className='error-alert'>
              {createBottomError}
            </Alert>
          </div>
        )}
        <Button variant='contained' type='submit' sx={{ mt: 2, width: '25ch', bgcolor: '#5171A5' }}>
          Create Bottom
        </Button>
      </form>
    </div>
  );
};

export default BottomForm;
