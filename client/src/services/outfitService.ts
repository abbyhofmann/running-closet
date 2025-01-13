import { AllOutfitItemsObject, Outfit } from '../types';
import api from './config';

const OUTFIT_API_URL = `${process.env.REACT_APP_SERVER_URL}/outfit`;

/**
 * Creates a new outfit.
 *
 * @param runnerId - The id of the user (runner) creating the outfit.
 * @param brand - The brand name of the outfit.
 * @param model - The model name of the outfit.
 * @param s3PhotoUrl - The URL S3 location of the image of the outfit.
 * @throws Error Throws an error if the request fails or the response status is not 200.
 */
const createOutfit = async (
  creatorId: string,
  workoutId: string,
  topIds: string[],
  bottomIds: string[],
  outerwearIds: string[],
  accessoriesIds: string[],
  shoeId: string,
): Promise<Outfit> => {
  const data = { creatorId, workoutId, topIds, bottomIds, outerwearIds, accessoriesIds, shoeId };

  const res = await api.post(`${OUTFIT_API_URL}/createOutfit`, data);
  if (res.status !== 200) {
    throw new Error('Error while creating a new outfit');
  }
  return res.data;
};

/**
 * Gets all the outfit items a user has created.
 *
 * @param uid The id of the user whose outfit items are being retrieved.
 * @throws Error if there is an issue fetching the outfit items by user ID.
 */
const getAllOutfitItems = async (uid: string): Promise<AllOutfitItemsObject> => {
  const res = await api.get(`${OUTFIT_API_URL}/getAllOutfitItems/${uid}`);

  if (res.status !== 200) {
    throw new Error('Error while fetching all outfit items');
  }

  return res.data;
};

export default createOutfit;
