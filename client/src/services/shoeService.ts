import { Shoe } from '../types';
import api from './config';

const SHOE_API_URL = `${process.env.REACT_APP_SERVER_URL}/shoe`;

/**
 * Creates a new shoe.
 *
 * @param runnerId - The id of the user (runner) creating the shoe.
 * @param brand - The brand name of the shoe.
 * @param model - The model name of the shoe.
 * @param s3PhotoUrl - The URL S3 location of the image of the shoe.
 * @throws Error Throws an error if the request fails or the response status is not 200.
 */
const createShoe = async (
  runnerId: string,
  brand: string,
  model: string,
  s3PhotoUrl: string,
): Promise<Shoe> => {
  const data = { runnerId, brand, model, s3PhotoUrl };

  const res = await api.post(`${SHOE_API_URL}/createShoe`, data);
  if (res.status !== 200) {
    throw new Error('Error while creating a new shoe');
  }
  return res.data;
};

export default createShoe;
