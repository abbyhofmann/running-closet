import { Button, Typography, Stack, Grid2, Paper } from '@mui/material';
import { DatePicker, LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import WorkoutScroller from './workoutScroller';
import OutfitItemScroller from './outfitItemScroller';
import useNewOutfitPage from '../../../hooks/useNewOutfitPage';
import LocationInput from './newWorkoutPopup/locationInput';

/**
 * Renders a page where the user can create a new outfit.
 */
const NewOutfitPage = () => {
  const {
    outfit,
    workouts,
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
    popupOpen,
    popupType,
    handlePopupOpen,
    handlePopupClose,
    handleWorkoutPopupClose,
    handleCreateWorkout,
    dateWorn,
    setDateWorn,
    handleLocationSelection,
    handleDateSelection,
    handleAddRatingClick,
  } = useNewOutfitPage();

  return (
    <Stack spacing={4} sx={{ px: { xs: 2, md: 9 }, mt: 4 }}>
      <Typography variant='h4' sx={{ color: '#32292F' }}>
        <strong>Create a New Outfit</strong>
      </Typography>
      {/* Date Picker */}
      <Paper elevation={3} sx={{ p: 3, bgcolor: '#fafafa' }}>
        <Typography variant='h6' fontWeight='bold' gutterBottom>
          Date Worn
        </Typography>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Stack direction='row' spacing={2}>
            <DatePicker
              label='Select date'
              value={dayjs(dateWorn)}
              onChange={newValue => {
                const newDate = newValue ? newValue.toDate() : null;
                if (newDate && dateWorn) {
                  // preserve time from previous dateWorn
                  newDate.setHours(dateWorn.getHours(), dateWorn.getMinutes());
                }
                setDateWorn(newDate);
                handleDateSelection(newDate);
              }}
            />
            <TimePicker
              label='Select time'
              value={dayjs(dateWorn)} // same here
              onChange={newValue => {
                if (!newValue) return;
                const selected = newValue.toDate();
                if (dateWorn) {
                  // preserve the existing date part
                  const updatedDate = new Date(dateWorn);
                  updatedDate.setHours(selected.getHours(), selected.getMinutes());
                  setDateWorn(updatedDate);
                  handleDateSelection(updatedDate);
                } else {
                  setDateWorn(selected);
                  handleDateSelection(selected);
                }
              }}
            />
          </Stack>
        </LocalizationProvider>
      </Paper>

      {/* Location */}
      <Paper elevation={3} sx={{ p: 3, bgcolor: '#fafafa' }}>
        <LocationInput onSelectLocation={handleLocationSelection} />
      </Paper>

      {/* Workout Picker */}
      <Paper elevation={3} sx={{ p: 3, bgcolor: '#fafafa' }}>
        <WorkoutScroller
          workouts={workouts}
          onSelectWorkout={handleWorkoutSelection}
          currentSelectedWorkout={selectedWorkout}
          popupOpen={popupOpen && popupType === 'workout'}
          onPopupOpen={() => handlePopupOpen('workout')}
          onPopupClose={handleWorkoutPopupClose}
          onNewWorkoutCreated={handleCreateWorkout}
        />
      </Paper>

      {/* Outfit Item Scrollers */}
      {[
        {
          items: userTops,
          type: 'top',
          selected: outfit.tops,
          onCreate: handleCreateTop,
          onSelect: handleTopSelection,
        },
        {
          items: userBottoms,
          type: 'bottom',
          selected: outfit.bottoms,
          onCreate: handleCreateBottom,
          onSelect: handleBottomSelection,
        },
        {
          items: userShoes,
          type: 'shoes',
          selected: outfit.shoe ? [outfit.shoe] : [],
          onCreate: handleCreateShoe,
          onSelect: handleShoeSelection,
        },
        {
          items: userOuterwears,
          type: 'outerwear',
          selected: outfit.outerwear,
          onCreate: handleCreateOuterwear,
          onSelect: handleOuterwearSelection,
        },
        {
          items: userAccessories,
          type: 'accessory',
          selected: outfit.accessories,
          onCreate: handleCreateAccessory,
          onSelect: handleAccessorySelection,
        },
      ].map(({ items, type, selected, onCreate, onSelect }) => (
        <Paper elevation={3} sx={{ p: 3, bgcolor: '#fafafa' }} key={type}>
          <OutfitItemScroller
            key={type}
            outfitItems={items}
            outfitItemType={type}
            onSelectOutfitItem={onSelect}
            currentSelectedOutfitItems={selected}
            onNewOutfitItemCreated={onCreate}
            popupOpen={popupOpen && popupType === type}
            onPopupOpen={() => handlePopupOpen(type)}
            onPopupClose={handlePopupClose}
          />
        </Paper>
      ))}

      <Button
        variant='contained'
        size='large'
        sx={{ alignSelf: 'center', bgcolor: '#473BF0', color: '#f5f3f5' }}
        onClick={() => handleAddRatingClick(outfit)}>
        Rate this Outfit
      </Button>
    </Stack>
  );
};

export default NewOutfitPage;
