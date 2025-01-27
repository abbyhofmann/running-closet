import { Accessory } from '../types';
import api from './config';

const ACCESSORY_API_URL = `${process.env.REACT_APP_SERVER_URL}/accessory`;

/**
 * Creates a new accessory.
 *
 * @param runnerId - The id of the user (runner) creating the accessory.
 * @param brand - The brand name of the accessory.
 * @param model - The model name of the accessory.
 * @param s3PhotoUrl - The URL S3 location of the image of the accessory.
 * @throws Error Throws an error if the request fails or the response status is not 200.
 */
const createAccessory = async (
  runnerId: string,
  brand: string,
  model: string,
  s3PhotoUrl: string,
): Promise<Accessory> => {
  const data = { runnerId, brand, model, s3PhotoUrl };

  const res = await api.post(`${ACCESSORY_API_URL}/createAccessory`, data);
  if (res.status !== 200) {
    throw new Error('Error while creating a new accessory');
  }
  return res.data;
};

const getAccessories = async (uid: string): Promise<Accessory[]> => {
  const res = await api.get(`${ACCESSORY_API_URL}/getAccessories/${uid}`);

  if (res.status !== 200) {
    throw new Error('Error while fetching user accessories');
  }

  return res.data;
};

export { createAccessory, getAccessories };
