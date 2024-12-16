import mongoose, { Model } from 'mongoose';
import shoeSchema from './schema/outfit/shoe';
import { Shoe } from '../types';

/**
 * Mongoose model for the `Shoe` collection.
 *
 * This model is created using the `Shoe` interface and the `shoeSchema`, representing the
 * `Shoe` collection in the MongoDB database, and provides an interface for interacting with
 * the stored shoes.
 *
 * @type {Model<Shoe>}
 */
const ShoeModel: Model<Shoe> = mongoose.model<Shoe>('Shoe', shoeSchema);

export default ShoeModel;
