import { Schema } from 'mongoose';
/**
 * Mongoose schema for the Top collection.
 *
 * This schema defines the structure for storing tops in the database.
 * Each top includes the following fields:
 * - `runner`: The runner who created the top object.
 * - `brand`: The brand name of the top.
 * - `model`: The model name of the top.
 * - `outfits`: The outfits that the top is a part of.
 */
const topSchema: Schema = new Schema(
  {
    runner: { type: Schema.Types.ObjectId, ref: 'Runner' },
    brand: { type: String },
    model: { type: String },
    outfits: [{ type: Schema.Types.ObjectId, ref: 'Outfit' }],
  },
  { collection: 'Top' },
);

export default topSchema;
