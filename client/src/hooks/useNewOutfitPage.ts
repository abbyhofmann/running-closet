import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Accessory, Bottom, Outerwear, Outfit, OutfitItem, Shoe, Top, Workout } from '../types';
import useUserContext from './useUserContext';
import useOutfitContext from './useOutfitContext';
import { createTop, getTops } from '../services/topService';
import { createBottom, getBottoms } from '../services/bottomService';
import { createAccessory, getAccessories } from '../services/accessoryService';
import { createOuterwear, getOuterwearItems } from '../services/outerwearService';
import { createShoe, getShoes } from '../services/shoeService';
import { createWorkout, getWorkouts } from '../services/workoutService';

/**
 * Custom hook for managing the new outfit page state.
 */
const useNewOutfitPage = () => {
  const { user } = useUserContext();
  const navigate = useNavigate();
  const { resetOutfit } = useOutfitContext();

  // outfit
  const { outfit, setOutfit } = useOutfitContext();

  // date and location selection for outfit worn
  const [dateWorn, setDateWorn] = useState<Date | null>(null); // TODO - idk if this type is correct
  const [location, setLocation] = useState<string>('');

  // selected workout for the new outfit
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);

  // user's workouts
  const [workouts, setWorkouts] = useState<Workout[]>(user?.workouts || []);

  // user's various outfit items
  const [userTops, setUserTops] = useState<Top[]>([]);
  const [userBottoms, setUserBottoms] = useState<Bottom[]>([]);
  const [userOuterwears, setUserOuterwears] = useState<Outerwear[]>([]);
  const [userAccessories, setUserAccessories] = useState<Accessory[]>([]);
  const [userShoes, setUserShoes] = useState<Shoe[]>([]);

  // state variable for re-rendering scrollbars when user creates new outfit item
  const [createdNewOutfitItem, setCreatedNewOutfitItem] = useState<OutfitItem | null>(null);

  // state variable for re-rendering scrollbars when user creates new workout
  const [createdNewWorkout, setCreatedNewWorkout] = useState<Workout | null>(null);

  const [popupOpen, setPopupOpen] = useState(false);
  const [popupType, setPopupType] = useState<string | null>(null);

  // error popup for creating an outfit
  const [createOutfitErrorPopupOpen, setCreateOutfitErrorPopupOpen] = useState(false);
  const [createOutfitErrorMessage, setCreateOutfitErrorMessage] = useState('');

  // set the outfit items
  useEffect(() => {
    async function fetchData() {
      if (user._id) {
        const fetchedTops = await getTops(user._id);
        setUserTops(fetchedTops);
        const fetchedBottoms = await getBottoms(user._id);
        setUserBottoms(fetchedBottoms);
        const fetchedAccessories = await getAccessories(user._id);
        setUserAccessories(fetchedAccessories);
        const fetchedOuterwearItems = await getOuterwearItems(user._id);
        setUserOuterwears(fetchedOuterwearItems);
        const fetchedShoeItems = await getShoes(user._id);
        setUserShoes(fetchedShoeItems);
        const fetchedWorkouts = await getWorkouts(user._id);
        setWorkouts(fetchedWorkouts);
      }
    }
    fetchData();
    setCreatedNewOutfitItem(null);
    setCreatedNewWorkout(null);
  }, [createdNewOutfitItem, createdNewWorkout, user._id]); // TODO - this may need to be changed to re-render when these change/new outfit is created

  // set the wearer of the outfit
  useEffect(() => {
    if (user && !outfit.wearer) {
      setOutfit({ ...outfit, wearer: user });
    }
  }, [outfit, setOutfit, user]);

  // reset outfit when rendering page (upon navigating to the page to reset outfit if navigating to and from create outfit page)
  useEffect(() => {
    resetOutfit();
  }, []);

  //   DEBUGGG
  useEffect(() => {
    console.log('Outfit state updated:', outfit);
  }, [outfit]);

  const handleLocationSelection = (selectedLocation: string) => {
    setLocation(location);
    setOutfit({ ...outfit, location: selectedLocation });
  };

  const handleDateSelection = (selectedDate: Date | null) => {
    // if selectedDate is null, fallback date is today's date
    const validDate = selectedDate ?? new Date();
    setDateWorn(validDate);
    setOutfit(prev => ({ ...prev, dateWorn: validDate }));
  };

  const handleWorkoutSelection = (workout: Workout) => {
    setSelectedWorkout(selectedWorkout?._id === workout._id ? null : workout);
    setOutfit({ ...outfit, workout: outfit.workout?._id === workout._id ? undefined : workout });
  };

  const handleCreateWorkout = async (newWorkout: Workout) => {
    if (user._id && newWorkout) {
      const newWorkoutObject = await createWorkout(
        user._id,
        newWorkout.runType,
        newWorkout.distance,
        newWorkout.duration,
      );
      setCreatedNewWorkout(newWorkoutObject);
    }
  };

  const handleTopSelection = (top: Top) => {
    const isSelected = outfit.tops.some(existingTop => existingTop._id === top._id);
    if (!isSelected) {
      setOutfit({ ...outfit, tops: [...outfit.tops, top] });
    } else {
      setOutfit({
        ...outfit,
        tops: outfit.tops.filter(existingTop => existingTop._id !== top._id),
      });
    }
  };

  const handleCreateTop = async (newOutfitItem: OutfitItem | null) => {
    if (user._id && newOutfitItem) {
      const newTop = await createTop(user._id, newOutfitItem?.brand, newOutfitItem?.model);
      setCreatedNewOutfitItem(newTop);
    }
  };

  const handleBottomSelection = (bottom: Bottom) => {
    const isSelected = outfit.bottoms.some(existingBottom => existingBottom._id === bottom._id);
    if (!isSelected) {
      setOutfit({ ...outfit, bottoms: [...outfit.bottoms, bottom] });
    } else {
      setOutfit({
        ...outfit,
        bottoms: outfit.bottoms.filter(existingBottom => existingBottom._id !== bottom._id),
      });
    }
  };

  const handleCreateBottom = async (newOutfitItem: OutfitItem | null) => {
    if (user._id && newOutfitItem) {
      const newBottom = await createBottom(user._id, newOutfitItem?.brand, newOutfitItem?.model);
      setCreatedNewOutfitItem(newBottom);
    }
  };

  const handleAccessorySelection = (accessory: Accessory) => {
    const isSelected = outfit.accessories.some(
      existingAccessory => existingAccessory._id === accessory._id,
    );
    if (!isSelected) {
      setOutfit({ ...outfit, accessories: [...outfit.accessories, accessory] });
    } else {
      setOutfit({
        ...outfit,
        accessories: outfit.accessories.filter(
          existingAccessory => existingAccessory._id !== accessory._id,
        ),
      });
    }
  };

  const handleCreateAccessory = async (newOutfitItem: OutfitItem | null) => {
    if (user._id && newOutfitItem) {
      const newAccessory = await createAccessory(
        user._id,
        newOutfitItem?.brand,
        newOutfitItem?.model,
      );
      setCreatedNewOutfitItem(newAccessory);
    }
  };

  const handleOuterwearSelection = (outerwear: Outerwear) => {
    const isSelected = outfit.outerwear.some(
      existingOuterwear => existingOuterwear._id === outerwear._id,
    );
    if (!isSelected) {
      setOutfit({ ...outfit, outerwear: [...outfit.outerwear, outerwear] });
    } else {
      setOutfit({
        ...outfit,
        outerwear: outfit.outerwear.filter(
          existingOuterwear => existingOuterwear._id !== outerwear._id,
        ),
      });
    }
  };

  const handleCreateOuterwear = async (newOutfitItem: OutfitItem | null) => {
    if (user._id && newOutfitItem) {
      const newOuterwearItem = await createOuterwear(
        user._id,
        newOutfitItem?.brand,
        newOutfitItem?.model,
      );
      setCreatedNewOutfitItem(newOuterwearItem);
    }
  };

  const handleShoeSelection = (shoe: Shoe) => {
    setOutfit({
      ...outfit,
      shoes: outfit.shoes?._id === shoe._id ? undefined : shoe,
    });
  };

  const handleCreateShoe = async (newOutfitItem: OutfitItem | null) => {
    if (user._id && newOutfitItem) {
      const newShoe = await createShoe(user._id, newOutfitItem?.brand, newOutfitItem?.model);
      setCreatedNewOutfitItem(newShoe);
    }
  };

  const validateOutfit = (outfitToValidate: Outfit): void => {
    if (!outfitToValidate.dateWorn) {
      throw new Error('missing date selection');
    }

    if (!outfitToValidate.location) {
      throw new Error('missing location selection');
    }

    if (!outfitToValidate.workout) {
      throw new Error('missing workout selection');
    }

    if (outfitToValidate.tops.length === 0) {
      throw new Error('missing top selection');
    }

    if (outfitToValidate.bottoms.length === 0) {
      throw new Error('missing bottom selection');
    }

    if (!outfitToValidate.shoes?._id) {
      throw new Error('missing shoe selection');
    }

    if (!outfitToValidate.wearer?._id) {
      throw new Error('logged in user error');
    }

    const hasInvalidIds = [
      ...outfitToValidate.tops,
      ...outfitToValidate.bottoms,
      ...outfitToValidate.outerwear,
      ...outfitToValidate.accessories,
    ].some(item => !item._id);

    if (hasInvalidIds) {
      throw new Error('One or more outfit items are missing an id.');
    }

    if (!outfitToValidate.imageUrl) {
      throw new Error('missing image');
    }
  };

  // function for new outfit item popup
  const handlePopupOpen = (type: string) => {
    setPopupType(type);
    setPopupOpen(true);
  };

  // function for closing new outfit item popup
  const handlePopupClose = () => {
    setPopupOpen(false);
    setTimeout(() => setPopupType(null), 0); // delay resetting type to ensure state updates
  };

  // function for closing workout popup
  const handleWorkoutPopupClose = () => {
    setPopupOpen(false);
    setTimeout(() => setPopupType(null), 0); // delay resetting type to ensure state updates
  };

  // function for closing create outfit error popup
  const handleCreateOutfitErrorPopupClose = () => {
    setCreateOutfitErrorPopupOpen(false);
    setCreateOutfitErrorMessage('');
  };

  const handleAddRatingClick = (outfitToRate: Outfit) => {
    try {
      validateOutfit(outfitToRate);
      navigate('/createOutfit/rating');
    } catch (e) {
      console.error('Error validating outfit:', (e as Error).message);
      setCreateOutfitErrorPopupOpen(true);
      setCreateOutfitErrorMessage((e as Error).message);
    }
  };

  const handleImageUpload = (imageCloudUrl: string) => {
    setOutfit({
      ...outfit,
      imageUrl: imageCloudUrl,
    });
  };

  return {
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
    popupOpen,
    popupType,
    handlePopupOpen,
    handlePopupClose,
    handleWorkoutPopupClose,
    dateWorn,
    setDateWorn,
    handleLocationSelection,
    handleDateSelection,
    handleAddRatingClick,
    createOutfitErrorPopupOpen,
    handleCreateOutfitErrorPopupClose,
    createOutfitErrorMessage,
    handleImageUpload,
  };
};

export default useNewOutfitPage;
