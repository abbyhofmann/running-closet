import mongoose, { Model } from 'mongoose';
import accessorySchema from './schema/outfit/accessory';
import { Accessory } from '../types';

/**
 * Mongoose model for the `Accessory` collection.
 *
 * This model is created using the `Accessory` interface and the `accessorySchema`, representing the
 * `Accessory` collection in the MongoDB database, and provides an interface for interacting with
 * the stored accessories.
 *
 * @type {Model<Accessory>}
 */
const AccessoryModel: Model<Accessory> = mongoose.model<Accessory>('Accessory', accessorySchema);

export default AccessoryModel;
