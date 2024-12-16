import { Schema } from 'mongoose';
/**
 * Mongoose schema for the Workout collection.
 *
 * This schema defines the structure for storing workouts in the database.
 * Each workout includes the following fields:
 * - `runner`: The user who logged the workout.
 * - `outfit`: The outfit worn during the workout.
 * - `runType`: The type of run workout (tempo, speed, easy, long, fun, recovery, etc).
 * - `dateCompleted`: The date the workout was completed.
 * - `distance`: The distance (in miles) of the run.
 * - `duration`: The length of time of the run.
 * - `location`: The city/state/country location where the run was completed.
 */
const workoutSchema: Schema = new Schema(
  {
    runner: { type: Schema.Types.ObjectId, ref: 'Runner' },
    outfit: { type: Schema.Types.ObjectId, ref: 'Outfit' },
    runType: {
      type: String,
    },
    dateCompleted: {
      type: Date,
    },
    distance: {
      type: Number,
    },
    duration: {
      type: Number,
    },
    location: {
      type: String,
    },
  },
  { collection: 'Workout' },
);

export default workoutSchema;
