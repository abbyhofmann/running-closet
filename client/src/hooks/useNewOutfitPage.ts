import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllOutfitItems } from '../services/outfitService';
import { Accessory, Bottom, Outerwear, Outfit, OutfitItem, Shoe, Top, Workout } from '../types';
import useUserContext from './useUserContext';
import useOutfitContext from './useOutfitContext';
import { createTop, getTops } from '../services/topService';
import createBottom from '../services/bottomService';
import createAccessory from '../services/accessoryService';
import createOuterwear from '../services/outerwearService';
import createShoe from '../services/shoeService';

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

  // state variable for re-rendering scrollbars when user creates new outfit item
  const [createdNewOutfitItem, setCreatedNewOutfitItem] = useState<OutfitItem | null>(null);

  // set the outfit items
  useEffect(() => {
    async function fetchData() {
      if (user._id) {
        const allOutfitItems = await getAllOutfitItems(user._id);
        const fetchedTops = await getTops(user._id);
        setUserTops(fetchedTops);
        setUserBottoms(allOutfitItems.bottoms);
        setUserAccessories(allOutfitItems.accessories);
        setUserOuterwears(allOutfitItems.outerwears);
        setUserShoes(allOutfitItems.shoes);
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
    setOpen(false);
    // if (user._id && newOutfitItem !== null) {
    //   const newTop = await createTop(
    //     user._id,
    //     newOutfitItem?.brand,
    //     newOutfitItem?.model,
    //     newOutfitItem?.s3PhotoUrl,
    //   );
    //   setNewOutfitItem(newTop); // TODO idk about this - also need to create the new tile; figure out how to add the top to the display (but it is not yet associated with an outfit... need to delete from db if not actually added to an outfit)
    //   // may need to have the scrollers be populated by any of the user's top's, not just those in outfits - would need to query the tops db by user id
    // }
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
    setOpen(false);
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
    setOpen(false);
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
    setOpen(false);
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
    setOpen(false);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

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
    handleClickOpen,
    open,
  };
};

export default useNewOutfitPage;
