import { Box, Typography } from '@mui/material';
import { Workout } from '../../../../types';

const WorkoutCard = ({ workout }: { workout: Workout }) => (
  <Box
    sx={{
      minWidth: 300,
      maxWidth: 300,
      border: '1px solid #ccc',
      borderRadius: 2,
      padding: 2,
      margin: 1,
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      bgcolor: '#fff',
    }}>
    <Typography variant='h6'>{workout.runType}</Typography>
    <Typography variant='body2'>
      Date: {new Date(workout.dateCompleted).toLocaleDateString()}
    </Typography>
    <Typography variant='body2'>Distance: {workout.distance} miles</Typography>
    <Typography variant='body2'>Duration: {workout.duration} minutes</Typography>
    <Typography variant='body2'>Location: {workout.location}</Typography>
  </Box>
);

export default WorkoutCard;
