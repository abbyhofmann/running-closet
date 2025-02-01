import { Box, Button, Card, Typography } from '@mui/material';
import { purple } from '@mui/material/colors';
import WorkoutCard from '../workoutCard';
import { Workout } from '../../../../types';
import NewWorkoutPopup from '../newWorkoutPopup';

const WorkoutScroller = ({
  workouts,
  onSelectWorkout,
  currentSelectedWorkout,
  popupOpen,
  onPopupOpen,
  onPopupClose,
}: {
  workouts: Workout[];
  onSelectWorkout: (workout: Workout) => void;
  currentSelectedWorkout: Workout | null;
  popupOpen: boolean;
  onPopupOpen: () => void;
  onPopupClose: (newWorkout: Workout | null) => void;
}) => {
  const handleCreateClick = () => {
    onPopupOpen();
  };

  return (
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
          selected={!!currentSelectedWorkout && workout._id === currentSelectedWorkout._id}
        />
      ))}

      {/* Card to Create New Workout */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'pointer',
        }}
        onClick={handleCreateClick}>
        <Card
          sx={{
            'display': 'flex',
            'cursor': 'pointer',
            '&:hover': {
              boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
              transform: 'scale(1.03)',
            },
            'borderRadius': 2,
            'backgroundColor': purple[100],
          }}>
          <Box
            sx={{
              padding: 2,
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
            }}>
            <Typography variant='h6' sx={{ fontWeight: 'bold' }}>
              + Create New Workout
            </Typography>
          </Box>
        </Card>
        <NewWorkoutPopup open={popupOpen} onClose={() => onPopupClose(null)} />
      </Box>
    </Box>
  );
};

export default WorkoutScroller;
