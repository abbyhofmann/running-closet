import { Box, Button, Card, Typography } from '@mui/material';
import { purple } from '@mui/material/colors';
import WorkoutCard from '../workoutCard';
import { Workout } from '../../../../types';

const WorkoutScroller = ({
  workouts,
  onCreateWorkout,
  onSelectWorkout,
  onPopupOpen,
  onPopupClose,
}: {
  workouts: Workout[];
  onCreateWorkout: (workout: Workout | null) => void;
  onSelectWorkout: (workout: Workout) => void;
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
        <Button variant='contained' color='primary'>
          + Create New Workout
        </Button>
      </Box>
      {/* ////////////////////////////////// */}
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
        <NewWorkoutPopup
          open={popupOpen}
          onClose={() => onPopupClose(null)}
          outfitItemType={currentType}
        />
      </Box>
    </Box>
  );
};

export default WorkoutScroller;
