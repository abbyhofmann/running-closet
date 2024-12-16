import mongoose, { Model } from 'mongoose';
import outfitSchema from './schema/outfit/outfit';
import { Outfit } from '../types';

/**
 * Mongoose model for the `Outfit` collection.
 *
 * This model is created using the `Outfit` interface and the `outfitSchema`, representing the
 * `Outfit` collection in the MongoDB database, and provides an interface for interacting with
 * the stored outfits.
 *
 * @type {Model<Outfit>}
 */
const OutfitModel: Model<Outfit> = mongoose.model<Outfit>('Outfit', outfitSchema);

export default OutfitModel;
