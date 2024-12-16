import mongoose, { Model } from 'mongoose';
import topSchema from './schema/outfit/top';
import { Top } from '../types';

/**
 * Mongoose model for the `Top` collection.
 *
 * This model is created using the `Top` interface and the `topSchema`, representing the
 * `Top` collection in the MongoDB database, and provides an interface for interacting with
 * the stored tops.
 *
 * @type {Model<Top>}
 */
const TopModel: Model<Top> = mongoose.model<Top>('Top', topSchema);

export default TopModel;
