import { Workout } from '../types';
import api from './config';

const WORKOUT_API_URL = `${process.env.REACT_APP_SERVER_URL}/workout`;

/**
 * Creates a new workout.
 *
 * @param runnerId
 * @param runType
 * @param dateCompleted
 * @param distance
 * @param duration
 * @param location
 * @throws Error Throws an error if the request fails or the response status is not 200.
 */
const createWorkout = async (
  runnerId: string,
  runType: string,
  dateCompleted: Date,
  distance: number,
  duration: number,
  location: string,
): Promise<Workout> => {
  const data = { runnerId, runType, dateCompleted, distance, duration, location };

  const res = await api.post(`${WORKOUT_API_URL}/createTop`, data);
  if (res.status !== 200) {
    throw new Error('Error while creating a new workout');
  }
  return res.data;
};

export default createWorkout;
