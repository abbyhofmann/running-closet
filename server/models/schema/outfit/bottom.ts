import { Schema } from 'mongoose';
/**
 * Mongoose schema for the Bottom collection.
 *
 * This schema defines the structure for storing bottoms in the database.
 * Each bottom includes the following fields:
 * - `runner`: The runner who created the bottom object.
 * - `brand`: The brand name of the bottom.
 * - `model`: The model name of the bottom.
 * - `s3PhotoUrl`: The URL link to the S3 bucket where the bottom photo is stored.
 * - `outfits`: The outfits that the bottom is a part of.
 */
const bottomSchema: Schema = new Schema(
  {
    runner: { type: Schema.Types.ObjectId, ref: 'Runner' },
    brand: { type: String },
    model: { type: String },
    s3PhotoUrl: { type: String },
    outfits: [{ type: Schema.Types.ObjectId, ref: 'Outfit' }],
  },
  { collection: 'Bottom' },
);

export default bottomSchema;
