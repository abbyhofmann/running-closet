import { ChangeEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import createTop from '../services/topService';
import createBottom from '../services/bottomService';
import useUserContext from './useUserContext';
import useOutfitContext from './useOutfitContext';
import createAccessory from '../services/accessoryService';
import createOuterwear from '../services/outerwearService';
import createShoe from '../services/shoeService';
import createRating from '../services/ratingService';

/**
 * Custom hook to handle login input and submission.
 *
 * */
const useRatingForm = () => {
  const [stars, setStars] = useState<number>(-1);
  const [temperatureGauge, setTemperatureGauge] = useState<string>('');
  const [newRatingError, setNewRatingError] = useState<string>('');
  const [showNewRatingError, setShowNewRatingError] = useState<boolean>(false);
  const { outfit, setOutfit } = useOutfitContext();
  const navigate = useNavigate();

  /**
   * Function to handle the stars change event.
   *
   * @param e - the event object.
   */
  const handleStarsChange = (e: ChangeEvent<HTMLInputElement>) => {
    setStars(e.target.value.length); // TODO fix
  };

  /**
   * Function to handle the temperature gauge input change event.
   *
   * @param e - the event object.
   */
  const handleTemperatureGaugeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTemperatureGauge(e.target.value);
  };

  /**
   * Function to handle the form submission event.
   *
   * @param event - the form event object.
   */
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const newRating = await createRating(outfit._id!, stars, temperatureGauge);
      setOutfit({ ...outfit, ratings: [...outfit.ratings, newRating] });
      navigate('/createOutfit/finalOutfit'); // TODO - update route
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      if (errorMessage === 'Request failed with status code 400') {
        setNewRatingError(`Creating new rating failed. Please try again.`);
      } else {
        setNewRatingError(`There was an issue creating new rating. Please try again.`);
      }
      setShowNewRatingError(true);
    }
  };

  return {
    stars,
    temperatureGauge,
    newRatingError,
    showNewRatingError,
    setNewRatingError,
    handleStarsChange,
    handleTemperatureGaugeChange,
    handleSubmit,
  };
};

export default useRatingForm;
