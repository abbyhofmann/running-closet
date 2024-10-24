import { User } from '../types';
import api from './config';

const USER_API_URL = `${process.env.REACT_APP_SERVER_URL}/user`;

/**
 * Registers a new user.
 *
 * @param qid - The ID of the question to which the answer is being added.
 * @param ans - The answer object containing the answer details.
 * @throws Error Throws an error if the request fails or the response status is not 200.
 */
const registerUser = async (username: string, email: string, password: string): Promise<User> => {
  const data = { username, email, password };

  const res = await api.post(`${USER_API_URL}/registerUser`, data);
  if (res.status !== 200) {
    throw new Error('Error while registering a new user');
  }
  return res.data;
};

export default registerUser;
