import { Schema } from 'mongoose';
/**
 * Mongoose schema for the Workout collection.
 *
 * This schema defines the structure for storing workouts in the database.
 * Each workout includes the following fields:
 * - `runner`: The user who logged the workout.
 * - `runType`: The type of run workout (tempo, speed, easy, long, fun, recovery, etc).
 * - `distance`: The distance (in miles) of the run.
 * - `duration`: The length of time of the run.
 */
const workoutSchema: Schema = new Schema(
  {
    runner: { type: Schema.Types.ObjectId, ref: 'Runner' },
    runType: {
      type: String,
    },
    distance: {
      type: Number,
    },
    duration: {
      type: Number,
    },
  },
  { collection: 'Workout' },
);

export default workoutSchema;
