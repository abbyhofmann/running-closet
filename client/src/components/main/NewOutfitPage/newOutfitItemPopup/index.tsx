import { Button, Dialog, DialogContent, DialogTitle, TextField } from '@mui/material';
import { useState } from 'react';
import { OutfitItem } from '../../../../types';
import useUserContext from '../../../../hooks/useUserContext';

interface NewOutfitItemPopupProps {
  open: boolean;
  onClose: () => void;
  outfitItemType: string;
  onNewOutfitItemCreated: (value: OutfitItem | null) => void;
}

const NewOutfitItemPopup = (props: NewOutfitItemPopupProps) => {
  const { open, onClose, outfitItemType, onNewOutfitItemCreated } = props;
  const [brand, setBrand] = useState<string>('');
  const [model, setModel] = useState<string>('');
  const { user } = useUserContext();

  // clear the form after the object is created
  const resetForm = () => {
    setBrand('');
    setModel('');
  };

  const handleSubmit = () => {
    if (brand && model) {
      const newOutfitItem: OutfitItem = {
        runner: user,
        outfits: [],
        brand,
        model,
      };

      onNewOutfitItemCreated(newOutfitItem);
      onClose();
      resetForm();
    }
  };

  // cancel object creation if popup is closed prematurely
  const handleCancel = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog onClose={handleCancel} open={open}>
      <DialogTitle>
        {String(outfitItemType).charAt(0).toUpperCase() + String(outfitItemType).slice(1)} Details
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin='dense'
          label='Brand'
          type='text'
          fullWidth
          value={brand}
          onChange={e => setBrand(e.target.value)}
        />
        <TextField
          margin='dense'
          label='Model'
          type='text'
          fullWidth
          value={model}
          onChange={e => setModel(e.target.value)}
        />
        <Button
          onClick={handleSubmit}
          variant='contained'
          sx={{ mt: 2, bgcolor: '#473BF0', color: '#f5f3f5' }}>
          Create!
        </Button>
        <Button
          onClick={handleCancel}
          variant='outlined'
          sx={{ mt: 2, ml: 1, color: '#473BF0', bgcolor: '#f5f3f5' }}>
          Cancel {String(outfitItemType).charAt(0).toUpperCase() + String(outfitItemType).slice(1)}{' '}
          Creation
        </Button>
      </DialogContent>
    </Dialog>
  );
};
export default NewOutfitItemPopup;
