import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllOutfitItems } from '../services/outfitService';
import { Accessory, Bottom, Outerwear, OutfitItem, Shoe, Top, Workout } from '../types';
import useUserContext from './useUserContext';
import useOutfitContext from './useOutfitContext';

/**
 * Custom hook for managing the new outfit page state.
 */
const useNewOutfitPage = () => {
  const { user, socket } = useUserContext();

  // outfit
  const { outfit, setOutfit } = useOutfitContext();

  // selected workout for the new outfit
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);

  // create outfit item popup open 
  const [open, setOpen] = useState(false);

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

  const handleClickOpen = () => {
    setOpen(true);
  }

  const handleClose = (outfit: OutfitItem) => {
    setOpen(false);
    // do something with outfit item
  }

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
    handleClickOpen,
    open
  };
};

export default useNewOutfitPage;
