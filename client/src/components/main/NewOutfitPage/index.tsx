import { useState, useEffect } from 'react';
import { Box, Drawer, List, ListItem, ListItemText, Button, Typography } from '@mui/material';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { Accessory, Bottom, Outerwear, Outfit, Rating, Shoe, Top, Workout } from '../../../types';
import useUserContext from '../../../hooks/useUserContext';
import useOutfitContext from '../../../hooks/useOutfitContext';

/**
 *
 */
const NewOutfitPage = () => {
  const { user, socket } = useUserContext();
  const navigate = useNavigate();
  const [workout, setWorkout] = useState<Workout>({
    runner: user,
    runType: '',
    dateCompleted: new Date(),
    distance: 0,
    duration: 0,
    location: '',
  });

  const { outfit, setOutfit } = useOutfitContext();
  // Set the wearer of the outfit
  useEffect(() => {
    if (user && outfit.wearer === null) {
      setOutfit({ ...outfit, wearer: user });
    }
  }, [user, outfit.wearer, setOutfit]);

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
      <div className='scrolling-wrapper'>
        {/* <div className='card'>
          <h2>Card</h2>
        </div> */}
      </div>
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
