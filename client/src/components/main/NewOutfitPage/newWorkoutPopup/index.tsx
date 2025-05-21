import { useState } from 'react';
import { Button, Dialog, DialogContent, DialogTitle, TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { Workout } from '../../../../types';
import useUserContext from '../../../../hooks/useUserContext';
import RunTypeChips from './runTypeChips';

interface NewWorkoutPopupProps {
  open: boolean;
  onClose: () => void;
  onNewWorkoutCreated: (value: Workout) => void;
}

const NewWorkoutPopup = (props: NewWorkoutPopupProps) => {
  const { open, onClose, onNewWorkoutCreated } = props;
  const [runType, setRunType] = useState<string>('');
  const [distance, setDistance] = useState<string>('');
  const [duration, setDuration] = useState<string>('');
  const { user } = useUserContext();

  // clear the form after the workout is created
  const resetForm = () => {
    setRunType('');
    setDistance('');
    setDuration('');
  };

  const handleSubmit = () => {
    if (runType && runType !== '' && distance && distance !== '' && duration && duration !== '') {
      const newWorkout: Workout = {
        runner: user,
        runType,
        distance: Number(distance), // TODO - maybe do this in a different way than casting
        duration: Number(duration),
      };

      onNewWorkoutCreated(newWorkout);
      onClose();
      resetForm();
    }
  };

  // cancel workout creation if popup is closed prematurely
  const handleCancel = () => {
    resetForm();
    onClose();
  };

  const handleSelectRunType = (selectedRunType: string) => {
    setRunType(selectedRunType);
  };

  return (
    <Dialog onClose={handleCancel} open={open}>
      <DialogTitle>Workout Details</DialogTitle>
      <DialogContent>
        <Box>
          <Typography gutterBottom={true}>Run Type</Typography>
          <RunTypeChips handleSelectRunType={handleSelectRunType} />
        </Box>
        <Box
          component='form'
          sx={{ '& > :not(style)': { m: 1, width: '25ch' } }}
          noValidate
          autoComplete='off'>
          <TextField
            id='distance-field'
            label='Distance'
            variant='filled'
            type='number'
            value={distance}
            onChange={e => {
              const { value } = e.target;
              // Allow only integers greater than or equal to 0
              if (value === '' || /^[0-9]+$/.test(value)) {
                setDistance(value);
              }
            }}
          />
          <TextField
            id='duration-field'
            label='Duration'
            variant='filled'
            type='number'
            value={duration}
            onChange={e => {
              const { value } = e.target;
              // Allow only integers greater than or equal to 0
              if (value === '' || /^[0-9]+$/.test(value)) {
                setDuration(value);
              }
            }}
          />
        </Box>
        <Button onClick={handleSubmit} variant='contained' color='primary' sx={{ mt: 2 }}>
          Create!
        </Button>
        <Button onClick={handleCancel} variant='outlined' color='secondary' sx={{ mt: 2, ml: 1 }}>
          Cancel Workout Creation
        </Button>
      </DialogContent>
    </Dialog>
  );
};
export default NewWorkoutPopup;
