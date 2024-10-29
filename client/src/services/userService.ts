import { User } from '../types';
import api from './config';

const USER_API_URL = `${process.env.REACT_APP_SERVER_URL}/user`;

/**
 * Registers a new user.
 *
 * @param username - The username of the user being registered.
 * @param email - The email of the user being registered.
 * @param password - The password of the user being regiestered.
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

/**
 * Gets all the users from the database.
 *
 * @throws Error Throws an error if the request fails or the response status is not 200.
 */
const getAllUsers = async (): Promise<User[]> => {
  const res = await api.get(`${USER_API_URL}/getAllUsers`);
  if (res.status !== 200) {
    throw new Error('Error while fetching all users');
  }
  return res.data;
};

/**
 * Logs in a new user.
 *
 * @param username - The username of the user logging in.
 * @param password - The password of the user logging in.
 * @throws Error Throws an error if the request fails or the response status is not 200.
 */
const loginUser = async (username: string, password: string): Promise<User> => {
  const data = { username, password };

  const res = await api.post(`${USER_API_URL}/loginUser`, data);
  if (res.status !== 200) {
    throw new Error('Error while logging in a user');
  }
  return res.data;
};

/**
 * Deletes a user from the database.
 *
 * @param uid The uid of the user to delete.
 * @returns Error Throws an error if the request fails or the response status is not 200.
 */
const deleteUser = async (uid: string) => {
  const res = await api.post(`${USER_API_URL}/deleteUser`, uid);
  if (res.status !== 200) {
    throw new Error(`Error while deleteing a user ${uid}`);
  }
  return res.data;
};

export { registerUser, loginUser, getAllUsers, deleteUser };
