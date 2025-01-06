import { Box, Card, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import { Workout } from '../../../../types';

const WorkoutCard = ({
  workout,
  onSelectWorkout,
}: {
  workout: Workout;
  onSelectWorkout: (workout: Workout) => void;
}) => (
  <Card
    sx={{
      'display': 'flex',
      'cursor': 'pointer',
      '&:hover': {
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
        transform: 'scale(1.03)',
      },
      'borderRadius': 2,
    }}
    onClick={() => {
      onSelectWorkout(workout);
    }}>
    <Box
      sx={{
        backgroundColor: grey[400],
        padding: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
      }}>
      <Typography variant='h6' sx={{ fontWeight: 'bold' }}>
        {workout.runType}
      </Typography>
      <Typography variant='body2' sx={{ color: 'rgba(0,0,0,0.6)' }}>
        Date: {new Date(workout.dateCompleted).toLocaleDateString()}
      </Typography>
      <Typography variant='body2' sx={{ color: 'rgba(0,0,0,0.6)' }}>
        Distance: {workout.distance} miles
      </Typography>
      <Typography variant='body2' sx={{ color: 'rgba(0,0,0,0.6)' }}>
        Duration: {workout.duration} minutes
      </Typography>
      <Typography variant='body2' sx={{ color: 'rgba(0,0,0,0.6)' }}>
        Location: {workout.location}
      </Typography>
    </Box>
  </Card>
);

export default WorkoutCard;
