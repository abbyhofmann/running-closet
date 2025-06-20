import { Schema } from 'mongoose';
/**
 * Mongoose schema for the Accessory collection.
 *
 * This schema defines the structure for storing accessory in the database.
 * Each accessory includes the following fields:
 * - `runner`: The runner who created the accessory object.
 * - `brand`: The brand name of the accessory.
 * - `model`: The model name of the accessory.
 * - `outfits`: The outfits that the accessory is a part of.
 */
const accessorySchema: Schema = new Schema(
  {
    runner: { type: Schema.Types.ObjectId, ref: 'Runner' },
    brand: { type: String },
    model: { type: String },
    outfits: [{ type: Schema.Types.ObjectId, ref: 'Outfit' }],
  },
  { collection: 'Accessory' },
);

export default accessorySchema;
