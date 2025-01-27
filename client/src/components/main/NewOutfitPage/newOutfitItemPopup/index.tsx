import {
  Avatar,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  TextField,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import AddIcon from '@mui/icons-material/Add';
import { useEffect, useState } from 'react';
import { OutfitItem } from '../../../../types';
import useUserContext from '../../../../hooks/useUserContext';

interface NewOutfitItemPopupProps {
  open: boolean;
  onClose: (value: OutfitItem | null) => void;
  outfitItemType: string;
}

const NewOutfitItemPopup = (props: NewOutfitItemPopupProps) => {
  const { open, onClose, outfitItemType } = props;
  const [brand, setBrand] = useState<string>('');
  const [model, setModel] = useState<string>('');
  const [s3url, setS3url] = useState<string>('');
  const { user } = useUserContext();

  useEffect(() => {
    console.log('popup open var:', open);
  }, [open, onClose]);

  // clear the form after the object is created
  const resetForm = () => {
    setBrand('');
    setModel('');
    setS3url('');
  };

  const handleSubmit = () => {
    if (brand && model && s3url) {
      const newOutfitItem: OutfitItem = {
        runner: user,
        outfits: [],
        brand,
        model,
        s3PhotoUrl: s3url,
      };

      onClose(newOutfitItem);
      resetForm();
    }
  };

  // cancel object creation if popup is closed prematurely
  const handleCancel = () => {
    console.log('Cancel clicked, closing popup...');
    resetForm();
    onClose(null);
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
          autoFocus
          margin='dense'
          label='Model'
          type='text'
          fullWidth
          value={model}
          onChange={e => setModel(e.target.value)}
        />
        <TextField
          autoFocus
          margin='dense'
          label='Photo URL'
          type='text'
          fullWidth
          value={s3url}
          onChange={e => setS3url(e.target.value)}
        />
        <Button onClick={handleSubmit} variant='contained' color='primary' sx={{ mt: 2 }}>
          Create!
        </Button>
        <Button onClick={handleCancel} variant='outlined' color='secondary' sx={{ mt: 2, ml: 1 }}>
          Cancel {String(outfitItemType).charAt(0).toUpperCase() + String(outfitItemType).slice(1)}{' '}
          Creation
        </Button>
      </DialogContent>
    </Dialog>
  );
};
export default NewOutfitItemPopup;
