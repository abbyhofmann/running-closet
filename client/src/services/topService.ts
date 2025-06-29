import { Top } from '../types';
import api from './config';

const TOP_API_URL = `${process.env.REACT_APP_SERVER_URL}/top`;

/**
 * Creates a new top.
 *
 * @param runnerId - The id of the user (runner) creating the top.
 * @param brand - The brand name of the top.
 * @param model - The model name of the top.
 * @throws Error Throws an error if the request fails or the response status is not 200.
 */
const createTop = async (runnerId: string, brand: string, model: string): Promise<Top> => {
  const data = { runnerId, brand, model };

  const res = await api.post(`${TOP_API_URL}/createTop`, data);
  if (res.status !== 200) {
    throw new Error('Error while creating a new top');
  }
  return res.data;
};

const getTops = async (uid: string): Promise<Top[]> => {
  const res = await api.get(`${TOP_API_URL}/getTops/${uid}`);

  if (res.status !== 200) {
    throw new Error('Error while fetching user tops');
  }

  return res.data;
};

export { createTop, getTops };
