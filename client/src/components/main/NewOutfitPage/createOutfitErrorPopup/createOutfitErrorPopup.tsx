import { Dialog, DialogContent, DialogTitle, Typography } from '@mui/material';

interface CreateOutfitErrorPopupProps {
  open: boolean;
  onClose: () => void;
  errorMessage: string;
}

/**
 * Popup for displaying an error message when creating an outfit.
 */
const CreateOutfitErrorPopup = (props: CreateOutfitErrorPopupProps) => {
  const { open, onClose, errorMessage } = props;

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle sx={{ fontWeight: 'bold' }}>Unable to create outfit due to: </DialogTitle>
      <DialogContent>
        <Typography variant={'h6'} sx={{ textAlign: 'center' }}>
          {errorMessage}
        </Typography>
      </DialogContent>
    </Dialog>
  );
};
export default CreateOutfitErrorPopup;
