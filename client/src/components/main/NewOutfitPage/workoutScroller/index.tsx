import { Box, Button } from '@mui/material';
import WorkoutCard from '../workoutCard';
import { Workout } from '../../../../types';

const WorkoutScroller = ({
  workouts,
  onCreateWorkout,
  onSelectWorkout,
}: {
  workouts: Workout[];
  onCreateWorkout: () => void;
  onSelectWorkout: (workout: Workout) => void;
}) => (
  <Box
    sx={{
      display: 'flex',
      overflowX: 'auto',
      padding: 2,
      gap: 2,
      scrollbarWidth: 'thin', // Optional: style scrollbar
    }}>
    {workouts.map(workout => (
      <WorkoutCard
        key={workout._id?.toString()}
        workout={workout}
        onSelectWorkout={onSelectWorkout}
      />
    ))}

    {/* Card to Create New Workout */}
    <Box
      sx={{
        minWidth: 300,
        maxWidth: 300,
        border: '1px dashed #ccc',
        borderRadius: 2,
        padding: 2,
        margin: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
        bgcolor: '#f9f9f9',
      }}
      onClick={onCreateWorkout}>
      <Button variant='contained' color='primary'>
        + Create New Workout
      </Button>
    </Box>
  </Box>
);

export default WorkoutScroller;
