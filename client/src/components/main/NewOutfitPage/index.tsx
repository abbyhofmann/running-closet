import { Box, List, ListItem, ListItemText, Button, Typography, Stack, Grid2 } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import WorkoutScroller from './workoutScroller';
import OutfitItemScroller from './outfitItemScroller';
import useNewOutfitPage from '../../../hooks/useNewOutfitPage';

/**
 * Renders a page where the user can create a new outfit.
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
    handleClickOpen,
    open,
  } = useNewOutfitPage();
  const navigate = useNavigate();

  return (
    <Grid2 sx={{ marginTop: 3 }}>
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
        {/* <Button
          onClick={() => {
            navigate(`/createOutfit/top`);
          }}
          variant='contained'
          type='submit'
          sx={{ mt: 2, width: '25ch', bgcolor: '#5171A5' }}>
          Start Creating Outfit...
        </Button> */}
        <Box
          id='scrollers'
          className='scrollers'
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center', // Centers horizontally
            justifyContent: 'center', // Centers vertically
            gap: 4, // Adds space between scrollers
            marginTop: 4, // Adjusts vertical positioning
            minHeight: '50vh', // Ensures the content occupies at least half the viewport height
          }}>
          {/* Horizontal Workout Scroller */}
          <WorkoutScroller
            workouts={workouts}
            onCreateWorkout={handleCreateWorkout}
            onSelectWorkout={handleWorkoutSelection}
          />
          <Typography>Select Outfit Clothing Items</Typography>
          {/* Horizontal OutfitItem Scrollers */}
          {/* Top Scroller */}
          <OutfitItemScroller
            outfitItems={userTops}
            outfitItemType='top'
            onCreateOutfitItem={handleClickOpen}
            onSelectOutfitItem={handleTopSelection}
            currentSelectedOutfitItems={outfit.tops}
            onNewOutfitItemCreated={handleCreateTop}
          />
          {/* Bottom Scroller */}
          <OutfitItemScroller
            outfitItems={userBottoms}
            outfitItemType='bottom'
            onCreateOutfitItem={handleClickOpen}
            onSelectOutfitItem={handleBottomSelection}
            currentSelectedOutfitItems={outfit.bottoms}
            onNewOutfitItemCreated={handleCreateBottom} // TODO - change from top
          />
          {/* Shoes Scroller */}
          <OutfitItemScroller
            outfitItems={userShoes}
            outfitItemType='shoes'
            onCreateOutfitItem={handleClickOpen}
            onSelectOutfitItem={handleShoeSelection}
            currentSelectedOutfitItems={[]}
            onNewOutfitItemCreated={handleCreateShoe} // TODO - change from top
          />
          {/* fix this logic */}
          {/* Outerwears Scroller */}
          <OutfitItemScroller
            outfitItems={userOuterwears}
            outfitItemType='outerwear'
            onCreateOutfitItem={handleClickOpen}
            onSelectOutfitItem={handleOuterwearSelection}
            currentSelectedOutfitItems={outfit.outerwear}
            onNewOutfitItemCreated={handleCreateOuterwear} // TODO - change from top
          />
          {/* Accessories Scroller */}
          <OutfitItemScroller
            outfitItems={userAccessories}
            outfitItemType='accessory'
            onCreateOutfitItem={handleClickOpen}
            onSelectOutfitItem={handleAccessorySelection}
            currentSelectedOutfitItems={outfit.accessories}
            onNewOutfitItemCreated={handleCreateAccessory} // TODO - change from top
          />
          <Button>Create Outfit!</Button>
        </Box>
      </Stack>
    </Grid2>
  );
};

export default NewOutfitPage;
