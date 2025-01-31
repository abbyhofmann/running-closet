import { useState } from 'react';
import { Button, Dialog, DialogContent, DialogTitle, TextField } from '@mui/material';
import { Workout } from '../../../../types';
import useUserContext from '../../../../hooks/useUserContext';
import RunTypeChips from './runTypeChips';

interface NewWorkoutPopupProps {
  open: boolean;
  onClose: (value: Workout | null) => void;
}

const NewWorkoutPopup = (props: NewWorkoutPopupProps) => {
  const { open, onClose } = props;
  const [runType, setRunType] = useState<string>('');
  const [dateCompleted, setDateCompleted] = useState<Date>(new Date()); // TODO - idk if this type is correct
  const [distance, setDistance] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [location, setLocation] = useState<string>('');
  const { user } = useUserContext();

  // clear the form after the workout is created
  const resetForm = () => {
    setRunType('');
    setDateCompleted(new Date());
    setDistance(0);
    setDuration(0);
    setLocation('');
  };

  const handleSubmit = () => {
    if (runType && dateCompleted && distance && duration && location) {
      const newWorkout: Workout = {
        runner: user,
        runType,
        dateCompleted,
        distance,
        duration,
        location,
      };

      onClose(newWorkout);
      resetForm();
    }
  };

  // cancel workout creation if popup is closed prematurely
  const handleCancel = () => {
    resetForm();
    onClose(null);
  };
  /*

setRunType('');
    setDateCompleted(new Date());
    setDistance(0);
    setDuration(0);
    setLocation('');

*/
  return (
    <Dialog onClose={handleCancel} open={open}>
      <DialogTitle>Workout Details</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin='dense'
          label='distance'
          type='text'
          fullWidth
          value={distance}
          onChange={e => setDistance(e.target.value)}
        /*
        onChange={e => {
              const { value } = e.target;
              // Allow only integers greater than or equal to 0
              if (value === '' || /^[0-9]+$/.test(value)) {
                handleAgeChange(Number(value));
              }
            }}
        */
        />
        <RunTypeChips />

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
