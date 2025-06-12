import { Dialog, DialogContent, DialogTitle, Typography } from '@mui/material';

interface ErrorPopupProps {
  open: boolean;
  onClose: () => void;
  errorMessage: string;
}

/**
 * Popup for displaying an error message during the create outfit process - utilized when selecting outfit and rating components.
 */
const ErrorPopup = (props: ErrorPopupProps) => {
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
export default ErrorPopup;
