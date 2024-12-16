import mongoose, { Model } from 'mongoose';
import bottomSchema from './schema/outfit/bottom';
import { Bottom } from '../types';

/**
 * Mongoose model for the `Bottom` collection.
 *
 * This model is created using the `Bottom` interface and the `bottomSchema`, representing the
 * `Bottom` collection in the MongoDB database, and provides an interface for interacting with
 * the stored bottoms.
 *
 * @type {Model<Bottom>}
 */
const BottomModel: Model<Bottom> = mongoose.model<Bottom>('Bottom', bottomSchema);

export default BottomModel;
