import express, { Response } from 'express';
import { ObjectId } from 'mongodb';
import {
  FakeSOSocket,
  CreateWorkoutRequest,
  GetWorkoutRequest,
  FindWorkoutsByUserIdRequest,
} from '../types';
import {
  addWorkout,
  fetchUserById,
  saveWorkout,
  fetchWorkoutById,
  fetchAllWorkoutsByUser,
} from '../models/application';

const workoutController = (socket: FakeSOSocket) => {
  const router = express.Router();

  /**
   * Checks if the provided create workout request contains the required fields.
   *
   * @param req The request object containing the new workout's runner id, run type, date completed,
   * distance, duration, and location.
   *
   * @returns `true` if the request is valid, otherwise `false`.
   */
  function isCreateWorkoutRequestValid(req: CreateWorkoutRequest): boolean {
    return (
      !!req.body.runnerId &&
      !!req.body.runType &&
      !!req.body.distance &&
      !!req.body.duration 
    );
  }

  /**
   * Adds a new workout to the database. The workout request is validated and the workout is then saved.
   * If there is an error, the HTTP response's status is updated.
   *
   * @param req The CreateWorkoutRequest object containing the Workout data.
   * @param res The HTTP response object used to send back the result of the operation. The response object contains
   * the new user.
   *
   * @returns A Promise that resolves to void.
   */
  const createWorkout = async (req: CreateWorkoutRequest, res: Response): Promise<void> => {
    if (!isCreateWorkoutRequestValid(req)) {
      res.status(400).send('Invalid create workout request');
      return;
    }

    const { runnerId, runType, distance, duration } = req.body;

    try {
      // get the user (runner) object
      const user = await fetchUserById(runnerId);

      if ('error' in user) {
        throw new Error(user.error as string);
      }

      // create the new workout
      const newWorkout = {
        runner: user,
        runType,
        distance,
        duration,
      };

      const workoutFromDb = await saveWorkout(newWorkout);

      if ('error' in workoutFromDb) {
        throw new Error(workoutFromDb.error as string);
      }

      // add the workout to the runner's list of workouts
      const userWithNewWorkout = await addWorkout(workoutFromDb, runnerId);
      if ('error' in userWithNewWorkout) {
        throw new Error(userWithNewWorkout.error as string);
      }

      res.json(workoutFromDb);
    } catch (err) {
      res.status(500).send(`Error when creating a new workout: ${(err as Error).message}`);
    }
  };

  /**
   * Retrieves the workout with the given workout id from the database.
   * If there is an error, the HTTP response's status is updated.
   *
   * @param req The request object with the id of the workout to retrieve.
   * @param res The HTTP response object used to send back the result of the operation.
   * @returns A Promise that resolves to void.
   */
  const getWorkout = async (req: GetWorkoutRequest, res: Response): Promise<void> => {
    const { wid } = req.params;

    try {
      if (!ObjectId.isValid(wid)) {
        res.status(400).send('Invalid ID format');
        return;
      }
      const workout = await fetchWorkoutById(wid);
      if ('error' in workout) {
        throw new Error(workout.error as string);
      }

      res.json(workout);
    } catch (err) {
      res.status(500).send(`Error when fetching workout: ${(err as Error).message}`);
    }
  };

  const getWorkouts = async (req: FindWorkoutsByUserIdRequest, res: Response): Promise<void> => {
    const { uid } = req.params;

    if (!ObjectId.isValid(uid)) {
      res.status(400).send('Invalid ID format');
      return;
    }

    try {
      const user = await fetchUserById(uid);

      if ('error' in user) {
        throw new Error(user.error as string);
      }
      const userWorkouts = await fetchAllWorkoutsByUser(uid);
      if ('error' in userWorkouts) {
        throw new Error(userWorkouts.error as string);
      }
      res.json(userWorkouts);
    } catch (err) {
      res.status(500).send(`Error when fetching all workouts: ${(err as Error).message}`);
    }
  };

  // add appropriate HTTP verbs and their endpoints to the router.
  router.post('/createWorkout', createWorkout);
  router.get('/getWorkout/:wid', getWorkout);
  router.get('/getWorkouts/:uid', getWorkouts);

  return router;
};

export default workoutController;
