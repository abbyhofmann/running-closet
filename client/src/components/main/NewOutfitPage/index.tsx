import { useState, useEffect } from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Button,
  Typography,
  Stack,
  Grid2,
} from '@mui/material';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { Accessory, Bottom, Outerwear, Outfit, Rating, Shoe, Top, Workout } from '../../../types';
import useUserContext from '../../../hooks/useUserContext';
import useOutfitContext from '../../../hooks/useOutfitContext';
import WorkoutScroller from './workoutScroller';
import OutfitItemScroller from './outfitItemScroller';
import { getAllOutfitItems } from '../../../services/outfitService';
import useNewOutfitPage from '../../../hooks/useNewOutfitPage';

/**
 *
 */
const NewOutfitPage = () => {
  const {
    outfit,
    workouts,
    handleCreateWorkout,
    handleWorkoutSelection,
    selectedWorkout,
    userTops,
    handleCreateTop,
    handleTopSelection,
    userBottoms,
    handleCreateBottom,
    handleBottomSelection,
    userAccessories,
    handleCreateAccessory,
    handleAccessorySelection,
    userOuterwears,
    handleCreateOuterwear,
    handleOuterwearSelection,
    userShoes,
    handleCreateShoe,
    handleShoeSelection,
  } = useNewOutfitPage();
  const navigate = useNavigate();

  return (
    <Grid2>
      <Stack direction='column' spacing={{ xs: 1, sm: 2, md: 4 }}>
        {/* Sidebar */}
        <Box>
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
        </Box>
        {/* need to navigate between top page, bottom page, etc and pass outfit object between */}
        <Typography>What workout was this outfit for?</Typography>
        {/* Horizontal Workout Scroller */}
        <WorkoutScroller
          workouts={workouts}
          onCreateWorkout={handleCreateWorkout}
          onSelectWorkout={handleWorkoutSelection}
        />
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
          Start Creating Outfit...
        </Button>
        {/* Horizontal OutfitItem Scrollers */}
        {/* Top Scroller */}
        <OutfitItemScroller
          outfitItems={userTops}
          outfitItemType='top'
          onCreateOutfitItem={handleCreateTop}
          onSelectOutfitItem={handleTopSelection}
          currentSelectedOutfitItems={outfit.tops}
        />
        {/* Bottom Scroller */}
        <OutfitItemScroller
          outfitItems={userBottoms}
          outfitItemType='bottom'
          onCreateOutfitItem={handleCreateBottom}
          onSelectOutfitItem={handleBottomSelection}
          currentSelectedOutfitItems={outfit.bottoms}
        />
        {/* Shoes Scroller */}
        <OutfitItemScroller
          outfitItems={userShoes}
          outfitItemType='shoes'
          onCreateOutfitItem={handleCreateShoe}
          onSelectOutfitItem={handleShoeSelection}
          currentSelectedOutfitItems={[]}
        />{' '}
        {/* fix this logic */}
        {/* Outerwears Scroller */}
        <OutfitItemScroller
          outfitItems={userOuterwears}
          outfitItemType='outerwear'
          onCreateOutfitItem={handleCreateOuterwear}
          onSelectOutfitItem={handleOuterwearSelection}
          currentSelectedOutfitItems={outfit.outerwear}
        />
        {/* Accessories Scroller */}
        <OutfitItemScroller
          outfitItems={userAccessories}
          outfitItemType='accessory'
          onCreateOutfitItem={handleCreateAccessory}
          onSelectOutfitItem={handleAccessorySelection}
          currentSelectedOutfitItems={outfit.accessories}
        />
      </Stack>
    </Grid2>
  );
};

export default NewOutfitPage;
