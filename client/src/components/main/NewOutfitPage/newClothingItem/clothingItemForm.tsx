import { Box, TextField, Button, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ClothingItemFormProps } from '../../../../types';
import useClothingItemForm from '../../../../hooks/useClothingItemForm';

const ClothingItemForm = (props: ClothingItemFormProps) => {
  const { clothingItem, nextClothingItem } = props;
  const navigate = useNavigate();

  const {
    brand,
    model,
    createClothingItemError,
    showCreateClothingItemError,
    handleBrandChange,
    handleModelChange,
    handleSubmit,
  } = useClothingItemForm(clothingItem);

  const handleNext = () => {
    navigate(`../${nextClothingItem}`);
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
      <h4>Please enter {clothingItem} details below.</h4>
      <form
        onSubmit={e => {
          handleSubmit(e).then(() => handleNext());
        }}>
        <div className='row'>
          <label className='clothing-item-photo' htmlFor='clothing-item-photo'>
            Upload Photo:
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

        {showCreateClothingItemError && (
          <div className='alert-container'>
            <Alert severity='error' className='error-alert'>
              {createClothingItemError}
            </Alert>
          </div>
        )}
        <Button variant='contained' type='submit' sx={{ mt: 2, width: '25ch', bgcolor: '#473BF0' }}>
          Create {clothingItem}
        </Button>
      </form>
    </div>
  );
};

export default ClothingItemForm;
