import { useState, useEffect } from 'react';
import { Box, Drawer, List, ListItem, ListItemText, Button, Typography } from '@mui/material';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { Accessory, Bottom, Outerwear, Outfit, Rating, Shoe, Top, Workout } from '../../../types';
import useUserContext from '../../../hooks/useUserContext';
import useOutfitContext from '../../../hooks/useOutfitContext';
import WorkoutScroller from './workoutScroller';

/**
 *
 */
const NewOutfitPage = () => {
  const { user, socket } = useUserContext();
  const navigate = useNavigate();
  //   const [workout, setWorkout] = useState<Workout>({
  //     runner: user,
  //     runType: '',
  //     dateCompleted: new Date(),
  //     distance: 0,
  //     duration: 0,
  //     location: '',
  //   });

  // outfit
  const { outfit, setOutfit } = useOutfitContext();

  // selected workout for the new outfit
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);

  // user's workouts
  const workouts = user?.workouts || [];

  // set the wearer of the outfit
  useEffect(() => {
    if (user && outfit.wearer === null) {
      setOutfit({ ...outfit, wearer: user });
    }
  }, [user, outfit.wearer, setOutfit]);

  const handleWorkoutSelection = (workout: Workout) => {
    setSelectedWorkout(workout);
    setOutfit({ ...outfit, workout });
  };

  const handleCreateWorkout = () => {
    // logic for creating a new workout (e.g., navigate to a workout creation page)
    // navigate('/createWorkout');
    console.log('create new workout clicked...');
  };

  return (
    <Box display='flex'>
      {/* Sidebar */}
      <Drawer variant='permanent' sx={{ width: 240, flexShrink: 0 }}>
        <Box sx={{ width: 240 }}>
          <List>
            <ListItem>
              <ListItemText
                primary={`Top: ${outfit.tops.length > 0 ? outfit.tops[0].brand : 'Not Selected'}`}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary={`Bottom: ${outfit.bottoms.length > 0 ? 'Added' : 'Not Selected'}`}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary={`Outerwear: ${outfit.outerwear.length > 0 ? 'Added' : 'Not Selected'}`}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary={`Accessory: ${outfit.accessories.length > 0 ? 'Added' : 'Not Selected'}`}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary={`Shoes: ${outfit.shoe ? outfit.shoe.brand : 'Not Selected'}`}
              />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* need to navigate between top page, bottom page, etc and pass outfit object between */}
      <Typography>What workout was this outfit for?</Typography>

      {/* Horizontal Workout Scroller */}
      <WorkoutScroller workouts={workouts} onCreateWorkout={handleCreateWorkout} />

      {/* Display Selected Workout */}
      {selectedWorkout && (
        <Box mt={3}>
          <Typography variant='h6'>Selected Workout:</Typography>
          <Typography>Type: {selectedWorkout.runType}</Typography>
          <Typography>
            Date: {new Date(selectedWorkout.dateCompleted).toLocaleDateString()}
          </Typography>
          <Typography>Distance: {selectedWorkout.distance} miles</Typography>
          <Typography>Duration: {selectedWorkout.duration} minutes</Typography>
          <Typography>Location: {selectedWorkout.location}</Typography>
        </Box>
      )}

      <Button
        onClick={() => {
          navigate(`/createOutfit/top`);
        }}
        variant='contained'
        type='submit'
        sx={{ mt: 2, width: '25ch', bgcolor: '#5171A5' }}>
        Select Workout
      </Button>
      <Button
        onClick={() => {
          navigate(`/createOutfit/top`);
        }}
        variant='contained'
        type='submit'
        sx={{ mt: 2, width: '25ch', bgcolor: '#5171A5' }}>
        Start Creating Outfit...
      </Button>
    </Box>
  );
};

export default NewOutfitPage;
