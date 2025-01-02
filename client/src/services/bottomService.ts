import { Bottom } from '../types';
import api from './config';

const BOTTOM_API_URL = `${process.env.REACT_APP_SERVER_URL}/bottom`;

/**
 * Creates a new bottom.
 *
 * @param runnerId - The id of the user (runner) creating the bottom.
 * @param brand - The brand name of the bottom.
 * @param model - The model name of the bottom.
 * @param s3PhotoUrl - The URL S3 location of the image of the bottom.
 * @throws Error Throws an error if the request fails or the response status is not 200.
 */
const createBottom = async (
  runnerId: string,
  brand: string,
  model: string,
  s3PhotoUrl: string,
): Promise<Bottom> => {
  const data = { runnerId, brand, model, s3PhotoUrl };

  const res = await api.post(`${BOTTOM_API_URL}/createBottom`, data);
  if (res.status !== 200) {
    throw new Error('Error while creating a new bottom');
  }
  return res.data;
};

export default createBottom;
