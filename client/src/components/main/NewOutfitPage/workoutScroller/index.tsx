import { Box, Card, Typography } from '@mui/material';
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
  onNewWorkoutCreated,
}: {
  workouts: Workout[];
  onSelectWorkout: (workout: Workout) => void;
  currentSelectedWorkout: Workout | null;
  popupOpen: boolean;
  onPopupOpen: () => void;
  onPopupClose: () => void;
  onNewWorkoutCreated: (newWorkout: Workout) => void;
}) => {
  const handleCreateClick = () => {
    onPopupOpen();
  };

  return (
    <div>
      <Typography variant='h6' sx={{ fontWeight: 'bold' }}>
        Workout
      </Typography>
      <Box
        sx={{
          'display': 'flex',
          'overflowX': 'auto', // Enables horizontal scrolling
          'gap': 2, // Spacing between cards
          'padding': 2, // Padding inside container
          'scrollbarWidth': 'thin', // hides scrollbar
          '&::-webkit-scrollbar': { height: 8 },
          '&::-webkit-scrollbar-thumb': { backgroundColor: 'gray', borderRadius: 4 },
          'whiteSpace': 'nowrap', // prevents wrapping
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
              'backgroundColor': '#CAFE48',
            }}>
            <Box
              sx={{
                padding: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
              }}>
              <Typography variant='h6' sx={{ fontWeight: 'bold' }}>
                + New Workout
              </Typography>
            </Box>
          </Card>
          <NewWorkoutPopup
            open={popupOpen}
            onClose={onPopupClose}
            onNewWorkoutCreated={onNewWorkoutCreated}
          />
        </Box>
      </Box>
    </div>
  );
};

export default WorkoutScroller;
