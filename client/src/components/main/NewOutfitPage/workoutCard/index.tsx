import { Box, Card, Typography } from '@mui/material';
import { blue, grey } from '@mui/material/colors';
import { Workout } from '../../../../types';

const WorkoutCard = ({
  workout,
  onSelectWorkout,
  selected,
}: {
  workout: Workout;
  onSelectWorkout: (workout: Workout) => void;
  selected: boolean;
}) => (
  <Card
    sx={{
      'backgroundColor': selected ? blue[100] : grey[400],
      'width': 200, // fixed width
      'height': 200, // fixed height
      'display': 'flex',
      'cursor': 'pointer',
      'flexDirection': 'column',
      'flex': '0 0 auto', // prevents shrinking of the card when new one is added
      // 'justifyContent': 'center',
      'alignItems': 'center',
      'borderRadius': 2,
      '&:hover': {
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
        transform: 'scale(1.03)',
      },
    }}
    onClick={() => {
      onSelectWorkout(workout);
    }}>
    <Box
      sx={{
        padding: 2,
        px: 3, // adds equal left and right padding
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        width: '100%',
        margin: '0 auto', // centers content horizontally
      }}>
      <Typography variant='h6' sx={{ fontWeight: 'bold' }}>
        {workout.runType}
      </Typography>
      <Typography variant='body2' sx={{ color: 'rgba(0,0,0,0.6)' }}>
        Distance: {workout.distance} miles
      </Typography>
      <Typography variant='body2' sx={{ color: 'rgba(0,0,0,0.6)' }}>
        Duration: {workout.duration} minutes
      </Typography>
    </Box>
  </Card>
);

export default WorkoutCard;
