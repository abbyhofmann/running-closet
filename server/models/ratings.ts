import mongoose, { Model } from 'mongoose';
import ratingSchema from './schema/outfit/rating';
import { Rating } from '../types';

/**
 * Mongoose model for the `Rating` collection.
 *
 * This model is created using the `Rating` interface and the `ratingSchema`, representing the
 * `Rating` collection in the MongoDB database, and provides an interface for interacting with
 * the stored ratings.
 *
 * @type {Model<Rating>}
 */
const RatingtModel: Model<Rating> = mongoose.model<Rating>('Rating', ratingSchema);

export default RatingtModel;
