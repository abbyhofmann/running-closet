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

/**
 *
 */
const NewOutfitPage = () => {
  const { user, socket } = useUserContext();
  const navigate = useNavigate();

  // outfit
  const { outfit, setOutfit } = useOutfitContext();

  // selected workout for the new outfit
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);

  // user's workouts
  const workouts = user?.workouts || [];

  // user's various outfit items
  const [userTops, setUserTops] = useState<Top[]>([]);
  const [userBottoms, setUserBottoms] = useState<Bottom[]>([]);
  const [userOuterwears, setUserOuterwears] = useState<Outerwear[]>([]);
  const [userAccessories, setUserAccessories] = useState<Accessory[]>([]);
  const [userShoes, setUserShoes] = useState<Shoe[]>([]);

  // set the outfit items
  useEffect(() => {
    async function fetchData() {
      if (user._id) {
        const allOutfitItems = await getAllOutfitItems(user._id);
        setUserTops(allOutfitItems.tops);
        setUserBottoms(allOutfitItems.bottoms);
        setUserAccessories(allOutfitItems.accessories);
        setUserOuterwears(allOutfitItems.outerwears);
        setUserShoes(allOutfitItems.shoes);
      }
    }
    fetchData();
  }, []); // TODO - this may need to be changed to re-render when these change/new outfit is created

  // set the wearer of the outfit
  useEffect(() => {
    if (user && outfit.wearer === null) {
      setOutfit({ ...outfit, wearer: user });
    }
  }, [user, outfit.wearer, setOutfit]);

  //   DEBUGGG
  useEffect(() => {
    console.log('Outfit state updated:', outfit);
  }, [outfit]);

  const handleWorkoutSelection = (workout: Workout) => {
    setSelectedWorkout(workout);
    setOutfit({ ...outfit, workout });
  };

  const handleCreateWorkout = () => {
    // logic for creating a new workout (e.g., navigate to a workout creation page)
    // navigate('/createWorkout');
    console.log('create new workout clicked...');
  };

  const handleTopSelection = (top: Top) => {
    if (!outfit.tops.includes(top)) {
      setOutfit({ ...outfit, tops: [...outfit.tops, top] });
    } else {
      setOutfit({ ...outfit, tops: outfit.tops.filter(existingTop => existingTop !== top) });
    }
  };

  const handleCreateTop = () => {
    // navigate
    console.log('create new top clicked...');
  };

  const handleBottomSelection = (bottom: Bottom) => {
    if (!outfit.bottoms.includes(bottom)) {
      setOutfit({ ...outfit, bottoms: [...outfit.bottoms, bottom] });
    } else {
      setOutfit({
        ...outfit,
        bottoms: outfit.bottoms.filter(existingBottom => existingBottom !== bottom),
      });
    }
    // setOutfit({ ...outfit, bottoms: [...outfit.bottoms, bottom] });
  };

  const handleCreateBottom = () => {
    // navigate('/createWorkout');
    console.log('create new bottom clicked...');
  };

  const handleAccessorySelection = (accessory: Accessory) => {
    if (!outfit.accessories.includes(accessory)) {
      setOutfit({ ...outfit, accessories: [...outfit.accessories, accessory] });
    } else {
      setOutfit({
        ...outfit,
        accessories: outfit.accessories.filter(
          existingAccessory => existingAccessory !== accessory,
        ),
      });
    }
  };

  const handleCreateAccessory = () => {
    // navigate('/createWorkout');
    console.log('create new accessory clicked...');
  };

  const handleOuterwearSelection = (outerwear: Outerwear) => {
    if (!outfit.outerwear.includes(outerwear)) {
      setOutfit({ ...outfit, outerwear: [...outfit.outerwear, outerwear] });
    } else {
      setOutfit({
        ...outfit,
        outerwear: outfit.outerwear.filter(existingOuterwear => existingOuterwear !== outerwear),
      });
    }
  };

  const handleCreateOuterwear = () => {
    // navigate('/createWorkout');
    console.log('create new outerwear clicked...');
  };

  const handleShoeSelection = (shoe: Shoe) => {
    // TODO - have shoe selection highlight the selected shoe
    // setSelectedShoe(shoe);
    setOutfit({ ...outfit, shoe });
  };

  const handleCreateShoe = () => {
    // navigate('/createWorkout');
    console.log('create new shoe clicked...');
  };

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
