import { useEffect, useState } from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Button, Dialog, DialogContent, DialogTitle, TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { Workout } from '../../../../types';
import useUserContext from '../../../../hooks/useUserContext';
import RunTypeChips from './runTypeChips';
import LocationInput from './locationInput';

interface NewWorkoutPopupProps {
  open: boolean;
  onClose: (value: Workout | null) => void;
}

const NewWorkoutPopup = (props: NewWorkoutPopupProps) => {
  const { open, onClose } = props;
  const [runType, setRunType] = useState<string>('');
  const [dateCompleted, setDateCompleted] = useState<Date | undefined>(new Date()); // TODO - idk if this type is correct
  const [distance, setDistance] = useState<string>('');
  const [duration, setDuration] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const { user } = useUserContext();

  useEffect(() => {
    console.log('location updated:', location);
  }, [location]);

  // clear the form after the workout is created
  const resetForm = () => {
    setRunType('');
    setDateCompleted(new Date());
    setDistance('');
    setDuration('');
    setLocation('');
  };

  const handleSubmit = () => {
    console.log('handle submit clicked');
    if (
      runType &&
      runType !== '' &&
      dateCompleted &&
      dateCompleted !== undefined &&
      distance &&
      distance !== '' &&
      duration &&
      duration !== '' &&
      location &&
      location !== ''
    ) {
      const newWorkout: Workout = {
        runner: user,
        runType,
        dateCompleted,
        distance: Number(distance), // TODO - maybe do this in a different way than casting
        duration: Number(duration),
        location,
      };

      console.log('new workout: ', newWorkout);

      onClose(newWorkout);
      resetForm();
    }
  };

  // cancel workout creation if popup is closed prematurely
  const handleCancel = () => {
    console.log('handle cancel clicked');
    resetForm();
    onClose(null);
  };

  const handleSelectRunType = (selectedRunType: string) => {
    setRunType(selectedRunType);
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
        <Box sx={{ '& > :not(style)': { m: 1, width: '25ch' } }}>
          <Typography gutterBottom={true}>Date Completed</Typography>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label='Select date'
              onChange={newValue => {
                setDateCompleted(newValue?.toDate());
              }}
            />
          </LocalizationProvider>
        </Box>
        <LocationInput setLocation={setLocation} />
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
