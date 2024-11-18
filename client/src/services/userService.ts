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
 * @param username The username of the user to delete.
 * @returns Error Throws an error if the request fails or the response status is not 200.
 */
const deleteUser = async (username: string) => {
  const data = { username };
  const res = await api.post(`${USER_API_URL}/deleteUser`, data);
  if (res.status !== 200) {
    throw new Error(`Error while deleteing user ${username}`);
  }
  return res.data;
};

/**
 * Gets the user object of the user with the given username.
 * @param username the username of the user we are retrieving.
 * @returns the user object of the user with the given username or throws if there is an error.
 */
const getUserByUsername = async (username: string): Promise<User> => {
  const res = await api.get(`${USER_API_URL}/getUserByUsername/${username}`);
  if (res.status !== 200) {
    throw new Error('Error while fetching the user.');
  }
  return res.data;
};

/**
 * Logs out the current user of fake stack overflow.
 * @returns the user object of the user logged out.
 */
const logoutUser = async () => {
  const res = await api.post(`${USER_API_URL}/logoutUser`);
  if (res.status !== 200) {
    throw new Error(`Error while logging out current user`);
  }
  return res.data;
};

/**
 * Sets the first user as a follower of the second user. Also adds the second user to the following list
 * of the current user
 *
 * @param currentUserId The uid of the user following the other.
 * @param userToFollowId The uid of the user being followed.
 * @returns Error Throws an error if the request fails or the response status is not 200.
 */
const followUser = async (currentUserId: string, userToFollowId: string) => {
  const data = { currentUserId, userToFollowId };
  const res = await api.post(`${USER_API_URL}/followUser`, data);
  if (res.status !== 200) {
    throw new Error(`Error while ${currentUserId} was attempting to following ${userToFollowId}`);
  }
  return res.data;
};

/**
 * Removes the first user as a follower of the second user. Also removes the second user from the following list
 * of the current user
 *
 * @param currentUserId The uid of the user unfollowing the other.
 * @param userToFollowId The uid of the user being unfollowed.
 * @returns Error Throws an error if the request fails or the response status is not 200.
 */
const unfollowUser = async (currentUserId: string, userToFollowId: string) => {
  const data = { currentUserId, userToFollowId };
  const res = await api.post(`${USER_API_URL}/unfollowUser`, data);
  if (res.status !== 200) {
    throw new Error(`Error while ${currentUserId} was attempting to unfollowing ${userToFollowId}`);
  }
  return res.data;
};

export {
  registerUser,
  loginUser,
  getAllUsers,
  deleteUser,
  getUserByUsername,
  followUser,
  unfollowUser,
  logoutUser,
};
