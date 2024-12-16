import { Schema } from 'mongoose';
/**
 * Mongoose schema for the Shoe collection.
 *
 * This schema defines the structure for storing shoes in the database.
 * Each shoe includes the following fields:
 * - `runner`: The runner who created the shoe object.
 * - `brand`: The brand name of the shoe.
 * - `model`: The model name of the shoe.
 * - `s3PhotoUrl`: The URL link to the S3 bucket where the shoe photo is stored.
 * - `outfits`: The outfits that the shoe is a part of.
 */
const shoeSchema: Schema = new Schema(
  {
    runner: { type: Schema.Types.ObjectId, ref: 'Runner' },
    brand: { type: String },
    model: { type: String },
    s3PhotoUrl: { type: String },
    outfits: [{ type: Schema.Types.ObjectId, ref: 'Outfit' }],
  },
  { collection: 'Shoe' },
);

export default shoeSchema;
