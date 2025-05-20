import { useEffect, useState } from 'react';
import { Accessory, Bottom, Outerwear, Outfit, OutfitItem, Shoe, Top, Workout } from '../types';
import useUserContext from './useUserContext';
import useOutfitContext from './useOutfitContext';
import { createTop, getTops } from '../services/topService';
import { createBottom, getBottoms } from '../services/bottomService';
import { createAccessory, getAccessories } from '../services/accessoryService';
import { createOuterwear, getOuterwearItems } from '../services/outerwearService';
import { createShoe, getShoes } from '../services/shoeService';
import { createWorkout, getWorkouts } from '../services/workoutService';
import { createOutfit } from '../services/outfitService';

/**
 * Custom hook for managing the new outfit page state.
 */
const useNewOutfitPage = () => {
  const { user, socket } = useUserContext();

  // outfit
  const { outfit, setOutfit, resetOutfit } = useOutfitContext();

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
    if (user && outfit.wearer === null) {
      setOutfit({ ...outfit, wearer: user });
    }
  }, [user, outfit.wearer, setOutfit, outfit]);

  //   DEBUGGG
  useEffect(() => {
    console.log('Outfit state updated:', outfit);
  }, [outfit]);

  const handleWorkoutSelection = (workout: Workout) => {
    setSelectedWorkout(selectedWorkout?._id === workout._id ? null : workout);
    setOutfit({ ...outfit, workout: outfit.workout?._id === workout._id ? null : workout });
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
    if (!outfit.tops.includes(top)) {
      setOutfit({ ...outfit, tops: [...outfit.tops, top] });
    } else {
      setOutfit({ ...outfit, tops: outfit.tops.filter(existingTop => existingTop !== top) });
    }
  };

  const handleCreateTop = async (newOutfitItem: OutfitItem | null) => {
    if (user._id && newOutfitItem) {
      const newTop = await createTop(
        user._id,
        newOutfitItem?.brand,
        newOutfitItem?.model,
        newOutfitItem?.s3PhotoUrl,
      );
      setCreatedNewOutfitItem(newTop);
    }
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
  };

  const handleCreateBottom = async (newOutfitItem: OutfitItem | null) => {
    if (user._id && newOutfitItem) {
      const newBottom = await createBottom(
        user._id,
        newOutfitItem?.brand,
        newOutfitItem?.model,
        newOutfitItem?.s3PhotoUrl,
      );
      setCreatedNewOutfitItem(newBottom);
    }
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

  const handleCreateAccessory = async (newOutfitItem: OutfitItem | null) => {
    if (user._id && newOutfitItem) {
      const newAccessory = await createAccessory(
        user._id,
        newOutfitItem?.brand,
        newOutfitItem?.model,
        newOutfitItem?.s3PhotoUrl,
      );
      setCreatedNewOutfitItem(newAccessory);
    }
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

  const handleCreateOuterwear = async (newOutfitItem: OutfitItem | null) => {
    if (user._id && newOutfitItem) {
      const newOuterwearItem = await createOuterwear(
        user._id,
        newOutfitItem?.brand,
        newOutfitItem?.model,
        newOutfitItem?.s3PhotoUrl,
      );
      setCreatedNewOutfitItem(newOuterwearItem);
    }
  };

  const handleShoeSelection = (shoe: Shoe) => {
    setOutfit({
      ...outfit,
      shoe: outfit.shoe?._id === shoe._id ? null : shoe,
    });
  };

  const handleCreateShoe = async (newOutfitItem: OutfitItem | null) => {
    if (user._id && newOutfitItem) {
      const newShoe = await createShoe(
        user._id,
        newOutfitItem?.brand,
        newOutfitItem?.model,
        newOutfitItem?.s3PhotoUrl,
      );
      setCreatedNewOutfitItem(newShoe);
    }
  };

  const handleCreateOutfit = async (newOutfit: Outfit) => {
    if (!newOutfit.shoe?._id) {
      throw new Error('Shoe is missing an id.');
    }

    if (newOutfit.wearer?._id && newOutfit.workout?._id) {
      const newOutfitCreated = await createOutfit(
        newOutfit.wearer._id,
        newOutfit.workout._id,
        newOutfit.tops.map(t => {
          if (!t._id) throw new Error('One or more tops are missing an id.');
          return t._id;
        }),
        newOutfit.bottoms.map(b => {
          if (!b._id) throw new Error('One or more bottoms are missing an id.');
          return b._id;
        }),
        newOutfit.outerwear.map(o => {
          if (!o._id) throw new Error('One or more outerwear itmes are missing an id.');
          return o._id;
        }),
        newOutfit.accessories.map(a => {
          if (!a._id) throw new Error('One or more accessories are missing an id.');
          return a._id;
        }),
        newOutfit.shoe._id,
      );
    }

    resetOutfit();
    setSelectedWorkout(null);
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
    handleCreateOutfit,
  };
};

export default useNewOutfitPage;
