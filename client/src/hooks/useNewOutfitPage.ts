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

/**
 * Custom hook for managing the new outfit page state.
 */
const useNewOutfitPage = () => {
  const { user, socket } = useUserContext();

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

  // state variable for re-rendering scrollbars when user creates new outfit item
  const [createdNewOutfitItem, setCreatedNewOutfitItem] = useState<OutfitItem | null>(null);

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
      }
    }
    fetchData();
    setCreatedNewOutfitItem(null);
  }, [createdNewOutfitItem]); // TODO - this may need to be changed to re-render when these change/new outfit is created

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
    // TODO - have shoe selection highlight the selected shoe
    // setSelectedShoe(shoe);
    setOutfit({ ...outfit, shoe });
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

  //   const handleClickOpen = () => {
  //     setOpen(true);
  //   };

  //   const handleClose = (createdOutfitItem: OutfitItem | null) => {
  //     setOpen(false);
  //     setNewOutfitItem(createdOutfitItem);
  //     // add item-specific function calls for top, bottom, etc in handleCreateTop (instead of handle close)
  //   };

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
  };
};

export default useNewOutfitPage;
