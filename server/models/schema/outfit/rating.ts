import { Schema } from 'mongoose';
/**
 * Mongoose schema for the Rating collection.
 *
 * This schema defines the structure for storing ratings in the database.
 * Each rating includes the following fields:
 * - `stars`: The number of stars (out of 5) allocated to the outfit.
 * - `temperatureGauge`: A measure of how the outfit performed in the weather conditions (
 * i.e. too cold, too warm, appropriate).
 * - `comment`: A comment about the overall experience of the outfit.
 */
const ratingSchema: Schema = new Schema(
  {
    stars: {
      type: Number,
    },
    temperatureGauge: {
      type: String,
    },
  },
  { collection: 'Rating' },
);

export default ratingSchema;
