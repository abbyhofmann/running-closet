import {
  AllOutfitItemsObject,
  HourlyWeather,
  LocationCoordinates,
  Outfit,
  OutfitData,
} from '../types';
import api from './config';

const OUTFIT_API_URL = `${process.env.REACT_APP_SERVER_URL}/outfit`;

/**
 * Creates a new outfit.
 *
 * @throws Error Throws an error if the request fails or the response status is not 200.
 */
const createOutfit = async (
  creatorId: string,
  dateWorn: Date,
  location: string,
  workoutId: string,
  ratingId: string,
  topIds: string[],
  bottomIds: string[],
  outerwearIds: string[],
  accessoriesIds: string[],
  shoesId: string,
): Promise<Outfit> => {
  const data = {
    creatorId,
    dateWorn,
    location,
    workoutId,
    ratingId,
    topIds,
    bottomIds,
    outerwearIds,
    accessoriesIds,
    shoesId,
  };

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

/**
 * Gets all of a user's outfits.
 *
 * @param uid The id of the user whose outfits are being retrieved.
 * @throws Error if there is an issue fetching the outfits by user ID.
 */
const getOutfitsByUser = async (uid: string): Promise<Outfit[]> => {
  const res = await api.get(`${OUTFIT_API_URL}/getOutfitsByUser/${uid}`);

  if (res.status !== 200) {
    throw new Error('Error while fetching user outfits');
  }

  return res.data;
};

/**
 * Gets all of a user's outfits, but only the necessary data to display (OutfitData).
 *
 * @param uid The id of the user whose partial outfits are being retrieved.
 * @throws Error if there is an issue fetching the outfits by user ID.
 */
const getPartialOutfitsByUser = async (uid: string): Promise<OutfitData[]> => {
  const res = await api.get(`${OUTFIT_API_URL}/getPartialOutfitsByUser/${uid}`);

  if (res.status !== 200) {
    throw new Error('Error while fetching partial user outfits');
  }

  return res.data;
};

/**
 * Gets an outfit by id.
 *
 * @param oid The id of the outfit being retrieved.
 * @throws Error if there is an issue fetching the outfit by ID.
 */
const getOutfitById = async (oid: string): Promise<Outfit> => {
  const res = await api.get(`${OUTFIT_API_URL}/getOutfitById/${oid}`);

  if (res.status !== 200) {
    throw new Error('Error while fetching outfit');
  }

  return res.data;
};

/**
 * Forward geocodes (i.e. converts) a string location into its latitude-longitude geographic coordinates.
 *
 * @param location The location being forward geocoded.
 * @throws Error if there is an issue forward geocoding the location.
 */
const forwardGeocodeLocation = async (location: string): Promise<LocationCoordinates> => {
  const data = { location };
  const res = await api.post(`${OUTFIT_API_URL}/forwardGeocodeLocation`, data);

  if (res.status !== 200) {
    throw new Error('Error while geocoding location');
  }

  return res.data;
};

const generateStaticMapImage = async (coordinates: LocationCoordinates): Promise<string> => {
  const data = { coordinates };
  const res = await api.post(`${OUTFIT_API_URL}/generateStaticMapImage`, data);

  if (res.status !== 200) {
    throw new Error('Error while generating static map image');
  }

  return res.data;
};

const getHistoricalWeatherData = async (
  coordinates: LocationCoordinates,
  dateTimeInfo: Date,
): Promise<HourlyWeather> => {
  const data = { coordinates, dateTimeInfo };
  const res = await api.post(`${OUTFIT_API_URL}/getHistoricalWeatherData`, data);

  if (res.status !== 200) {
    throw new Error('Error while getting historical weather data');
  }

  return res.data;
};

const uploadImage = async (formData: FormData): Promise<string> => {
  // send raw form data
  const res = await api.post(`${OUTFIT_API_URL}/uploadImage`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  if (res.status !== 200) {
    throw new Error('Error while uploading image');
  }

  return res.data;
};

export {
  createOutfit,
  getAllOutfitItems,
  getOutfitsByUser,
  getPartialOutfitsByUser,
  getOutfitById,
  forwardGeocodeLocation,
  generateStaticMapImage,
  getHistoricalWeatherData,
  uploadImage,
};
