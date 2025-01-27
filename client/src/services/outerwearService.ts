import { Outerwear } from '../types';
import api from './config';

const OUTERWEAR_API_URL = `${process.env.REACT_APP_SERVER_URL}/outerwear`;

/**
 * Creates a new outerwear item.
 *
 * @param runnerId - The id of the user (runner) creating the outerwear item.
 * @param brand - The brand name of the outerwear item.
 * @param model - The model name of the outerwear item.
 * @param s3PhotoUrl - The URL S3 location of the image of the outerwear item.
 * @throws Error Throws an error if the request fails or the response status is not 200.
 */
const createOuterwear = async (
  runnerId: string,
  brand: string,
  model: string,
  s3PhotoUrl: string,
): Promise<Outerwear> => {
  const data = { runnerId, brand, model, s3PhotoUrl };

  const res = await api.post(`${OUTERWEAR_API_URL}/createOuterwear`, data);
  if (res.status !== 200) {
    throw new Error('Error while creating a new outerwear item');
  }
  return res.data;
};

const getOuterwearItems = async (uid: string): Promise<Outerwear[]> => {
  const res = await api.get(`${OUTERWEAR_API_URL}/getOuterwearItems/${uid}`);

  if (res.status !== 200) {
    throw new Error('Error while fetching user outerwear items');
  }

  return res.data;
};

export { createOuterwear, getOuterwearItems };
