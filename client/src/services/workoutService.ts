import { Workout } from '../types';
import api from './config';

const WORKOUT_API_URL = `${process.env.REACT_APP_SERVER_URL}/workout`;

/**
 * Creates a new workout.
 *
 * @param runnerId
 * @param runType
 * @param distance
 * @param duration
 * @throws Error Throws an error if the request fails or the response status is not 200.
 */
const createWorkout = async (
  runnerId: string,
  runType: string,
  distance: number,
  duration: number,
): Promise<Workout> => {
  const data = { runnerId, runType, distance, duration };

  const res = await api.post(`${WORKOUT_API_URL}/createWorkout`, data);
  if (res.status !== 200) {
    throw new Error('Error while creating a new workout');
  }
  return res.data;
};

/**
 * Function to get a workout by its ID.
 *
 * @param wid - The ID of the workout to retrieve.
 * @throws Error if there is an issue fetching the workout by ID.
 */
const getWorkout = async (wid: string): Promise<Workout> => {
  const res = await api.get(`${WORKOUT_API_URL}/getWorkout/${wid}`);
  if (res.status !== 200) {
    throw new Error('Error when fetching workout by id');
  }
  return res.data;
};

const getWorkouts = async (uid: string): Promise<Workout[]> => {
  const res = await api.get(`${WORKOUT_API_URL}/getWorkouts/${uid}`);

  if (res.status !== 200) {
    throw new Error('Error while fetching user workouts');
  }

  return res.data;
};

export { createWorkout, getWorkout, getWorkouts };
