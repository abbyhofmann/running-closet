import mongoose, { Model } from 'mongoose';
import workoutSchema from './schema/workout';
import { Workout } from '../types';

/**
 * Mongoose model for the `Workout` collection.
 *
 * This model is created using the `Workout` interface and the `workoutSchema`, representing the
 * `Workout` collection in the MongoDB database, and provides an interface for interacting with
 * the stored users.
 *
 * @type {Model<Workout>}
 */
const WorkoutModel: Model<Workout> = mongoose.model<Workout>('Runner', workoutSchema);

export default WorkoutModel;
