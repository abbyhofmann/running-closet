import mongoose, { Model } from 'mongoose';
import outerwearSchema from './schema/outfit/outerwear';
import { Outerwear } from '../types';

/**
 * Mongoose model for the `Outerwear` collection.
 *
 * This model is created using the `Outerwear` interface and the `outerwearSchema`, representing the
 * `Outerwear` collection in the MongoDB database, and provides an interface for interacting with
 * the stored outerwear items.
 *
 * @type {Model<Outerwear>}
 */
const OuterwearModel: Model<Outerwear> = mongoose.model<Outerwear>('Outerwear', outerwearSchema);

export default OuterwearModel;
