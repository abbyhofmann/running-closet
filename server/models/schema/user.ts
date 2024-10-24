import { Schema } from 'mongoose';
/**
 * Mongoose schema for the User collection.
 *
 * This schema defines the structure for storing users in the database.
 * Each user includes the following fields:
 * - `username`: The unique username for each user.
 * - `email`: The email associated with the account.
 * - `password`: The an ecrypted version of the user's password for the account.
 * - `deleted`: A boolean value representing if the account has been deleted. By default false.
 * - `following`: A list of users that the user follows.
 * - `followers`: A list of users that follow the user.
 */
const userSchema: Schema = new Schema(
  {
    username: {
      type: String,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    following: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    followers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { collection: 'User' },
);

export default userSchema;
