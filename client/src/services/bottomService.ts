import { Bottom } from '../types';
import api from './config';

const BOTTOM_API_URL = `${process.env.REACT_APP_SERVER_URL}/bottom`;

/**
 * Creates a new bottom.
 *
 * @param runnerId - The id of the user (runner) creating the bottom.
 * @param brand - The brand name of the bottom.
 * @param model - The model name of the bottom.
 * @throws Error Throws an error if the request fails or the response status is not 200.
 */
const createBottom = async (runnerId: string, brand: string, model: string): Promise<Bottom> => {
  const data = { runnerId, brand, model };

  const res = await api.post(`${BOTTOM_API_URL}/createBottom`, data);
  if (res.status !== 200) {
    throw new Error('Error while creating a new bottom');
  }
  return res.data;
};

const getBottoms = async (uid: string): Promise<Bottom[]> => {
  const res = await api.get(`${BOTTOM_API_URL}/getBottoms/${uid}`);

  if (res.status !== 200) {
    throw new Error('Error while fetching user bottoms');
  }

  return res.data;
};

export { createBottom, getBottoms };
