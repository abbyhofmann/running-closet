import { ChangeEvent, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import useOutfitContext from './useOutfitContext';

import createRating from '../services/ratingService';
import { createOutfit } from '../services/outfitService';
import { Outfit } from '../types';

/**
 * Custom hook to handle login input and submission.
 *
 * */
const useRatingForm = () => {
  const [stars, setStars] = useState<number>(0);
  const [temperatureGauge, setTemperatureGauge] = useState<string>('');
  const [newRatingError, setNewRatingError] = useState<string>('');
  const [showNewRatingError, setShowNewRatingError] = useState<boolean>(false);
  const { outfit, setOutfit, resetOutfit } = useOutfitContext();
  const navigate = useNavigate();

  const handleCreateOutfit = async (newOutfit: Outfit): Promise<string> => {
    if (!newOutfit.rating?._id) {
      throw new Error('Rating is missing an id.');
    }

    if (!newOutfit.shoe?._id) {
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
      newOutfit.shoe._id,
    );

    if (!newOutfitCreated || !newOutfitCreated._id) {
      throw new Error('Failed to create outfit.');
    }

    resetOutfit();
    // setSelectedWorkout(null); // TODO - create new context??
    return newOutfitCreated._id;
  };

  /**
   * Function to handle the form submission event.
   *
   * @param event - the form event object.
   */
  const handleSubmit = async () => {
    // event.preventDefault();
    try {
      const newRating = await createRating(stars, temperatureGauge);
      const updatedOutfit = { ...outfit, rating: newRating };
      setOutfit(updatedOutfit);
      const outfitId = await handleCreateOutfit(updatedOutfit);
      navigate('/createOutfit/myOutfits'); // TODO - update route
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setNewRatingError(errorMessage);
      setShowNewRatingError(true);
    }
  };

  return {
    stars,
    setStars,
    temperatureGauge,
    setTemperatureGauge,
    newRatingError,
    showNewRatingError,
    setNewRatingError,
    handleSubmit,
  };
};

export default useRatingForm;
