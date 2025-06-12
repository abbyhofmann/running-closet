import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useOutfitContext from './useOutfitContext';
import createRating from '../services/ratingService';
import { createOutfit } from '../services/outfitService';
import { Outfit, Rating } from '../types';

/**
 * Custom hook to handle login input and submission.
 *
 * */
const useRatingForm = () => {
  const [stars, setStars] = useState<number>(0);
  const [temperatureGauge, setTemperatureGauge] = useState<string>('');
  const [newRatingError, setNewRatingError] = useState<string>('');
  const [showNewRatingErrorPopup, setShowNewRatingErrorPopup] = useState<boolean>(false);
  const { outfit, setOutfit, resetOutfit } = useOutfitContext();
  const navigate = useNavigate();

  const handleCreateOutfit = async (newOutfit: Outfit): Promise<string> => {
    if (!newOutfit.rating?._id) {
      throw new Error('Rating is missing an id.');
    }

    if (!newOutfit.shoes?._id) {
      throw new Error('Shoe is missing an id.');
    }

    if (
      !newOutfit.wearer?._id ||
      !newOutfit.workout?._id ||
      !newOutfit.dateWorn ||
      !newOutfit.location
    ) {
      throw new Error('Missing required outfit fields.');
    }

    const newOutfitCreated = await createOutfit(
      newOutfit.wearer._id,
      newOutfit.dateWorn,
      newOutfit.location,
      newOutfit.workout._id,
      newOutfit.rating._id,
      newOutfit.tops.map(t => {
        if (!t._id) throw new Error('One or more tops are missing an id.');
        return t._id;
      }),
      newOutfit.bottoms.map(b => {
        if (!b._id) throw new Error('One or more bottoms are missing an id.');
        return b._id;
      }),
      newOutfit.outerwear.map(o => {
        if (!o._id) throw new Error('One or more outerwear items are missing an id.');
        return o._id;
      }),
      newOutfit.accessories.map(a => {
        if (!a._id) throw new Error('One or more accessories are missing an id.');
        return a._id;
      }),
      newOutfit.shoes._id,
    );

    if (!newOutfitCreated || !newOutfitCreated._id) {
      throw new Error('Failed to create outfit.');
    }

    resetOutfit();
    // setSelectedWorkout(null); // TODO - create new context??
    return newOutfitCreated._id;
  };

  // validate rating to ensure fields are selected
  const validateRating = (selectedStars: number, selectedTempGuage: string): void => {
    if (!selectedStars || selectedStars < 0 || selectedStars > 5) {
      throw new Error('missing stars selection');
    }

    if (!selectedTempGuage || selectedTempGuage === '') {
      throw new Error('missing temperature guage selection');
    }
  };

  /**
   * Function to handle the form submission event.
   *
   * @param event - the form event object.
   */
  const handleSubmit = async () => {
    // event.preventDefault();
    try {
      validateRating(stars, temperatureGauge);
      const newRating = await createRating(stars, temperatureGauge);
      const updatedOutfit = { ...outfit, rating: newRating };
      setOutfit(updatedOutfit);
      const outfitId = await handleCreateOutfit(updatedOutfit);
      navigate('/createOutfit/myOutfits'); // TODO - update route
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setNewRatingError(errorMessage);
      setShowNewRatingErrorPopup(true);
    }
  };

  const handleNewRatingErrorPopupClose = () => {
    setShowNewRatingErrorPopup(false);
    setNewRatingError('');
  };

  return {
    stars,
    setStars,
    temperatureGauge,
    setTemperatureGauge,
    newRatingError,
    showNewRatingErrorPopup,
    setNewRatingError,
    handleNewRatingErrorPopupClose,
    handleSubmit,
  };
};

export default useRatingForm;
