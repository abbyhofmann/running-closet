import { Rating } from '../types';
import api from './config';

const RATING_API_URL = `${process.env.REACT_APP_SERVER_URL}/rating`;

/**
 * Creates a new rating.
 *
 * @param stars The number of stars for the outfit (out of 5).
 * @param temperatureGauge A measure of how the outfit performed given the temperature
 * conditions (too cold, too warm, appropriate).
 * @throws Error Throws an error if the request fails or the response status is not 200.
 */
const createRating = async (stars: number, temperatureGauge: string): Promise<Rating> => {
  console.log('inside create rating, stars: ', stars, ', tempgauge: ', temperatureGauge);
  const data = { stars, temperatureGauge };

  const res = await api.post(`${RATING_API_URL}/createRating`, data);
  if (res.status !== 200) {
    throw new Error('Error while creating a new rating');
  }
  return res.data;
};

export default createRating;
