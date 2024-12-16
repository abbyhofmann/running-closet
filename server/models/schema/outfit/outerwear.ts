import { Schema } from 'mongoose';
/**
 * Mongoose schema for the Outerwear collection.
 *
 * This schema defines the structure for storing outerwear in the database.
 * Each outerwear includes the following fields:
 * - `runner`: The runner who created the outerwear object.
 * - `brand`: The brand name of the outerwear.
 * - `model`: The model name of the outerwear.
 * - `s3PhotoUrl`: The URL link to the S3 bucket where the outerwear photo is stored.
 * - `outfits`: The outfits that the outerwear is a part of.
 */
const outerwearSchema: Schema = new Schema(
  {
    runner: { type: Schema.Types.ObjectId, ref: 'Runner' },
    brand: { type: String },
    model: { type: String },
    s3PhotoUrl: { type: String },
    outfits: [{ type: Schema.Types.ObjectId, ref: 'Outfit' }],
  },
  { collection: 'Outerwear' },
);

export default outerwearSchema;
