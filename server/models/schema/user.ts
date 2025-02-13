import { Schema } from 'mongoose';
/**
 * Mongoose schema for the User (runner) collection.
 *
 * This schema defines the structure for storing users in the database.
 * Each user includes the following fields:
 * - `username`: The unique username for each user.
 * - `firstName`: The first name of the user.
 * - `lastName`: The last name of the user.
 * - `email`: The email associated with the account.
 * - `password`: The an ecrypted version of the user's password for the account.
 * - `profileGraphic`: The number corresponding to which profile graphic they choose upon registering.
 * - `deleted`: A boolean value representing if the account has been deleted. By default false.
 * - `following`: A list of users that the user follows.
 * - `followers`: A list of users that follow the user.
 * - `outfits`: The outfits this user has logged.
 * - `workouts`: The workouts this user has logged.
 * - `gender`: The gender of the user.
 * - `age`: The age of the user.
 */
const userSchema: Schema = new Schema(
  {
    username: {
      type: String,
    },

    firstName: {
      type: String,
    },

    lastName: {
      type: String,
    },

    email: {
      type: String,
    },
    password: {
      type: String,
    },
    profileGraphic: {
      type: Number,
    },
    deleted: {
      type: Boolean,
    },
    following: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    followers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    outfits: [{ type: Schema.Types.ObjectId, ref: 'Outfit' }],
    workouts: [{ type: Schema.Types.ObjectId, ref: 'Workout' }],
    gender: {
      type: String,
    },
    age: {
      type: Number,
    },
  },
  { collection: 'User' },
);

export default userSchema;
