import { Schema } from 'mongoose';
/**
 * Mongoose schema for the Outfit collection.
 *
 * This schema defines the structure for storing outfits in the database.
 * Each outfit includes the following fields:
 * - `wearer`: The user who wore and logged the outfit.
 * - `workout`: The workout for which the outfit was worn.
 * - `rating`: The overall rating of the outfit.
 * - `tops`: The tops worn in the outfit.
 * - `bottoms`: The bottoms worn in the outfit.
 * - `outerwear`: The outerwear worn in the outfit.
 * - `accessories`: The accessories worn in the outfit.
 * - `shoes`: The shoes worn in the outfit.
 */
const outfitSchema: Schema = new Schema(
  {
    wearer: { type: Schema.Types.ObjectId, ref: 'Runner' },
    workout: { type: Schema.Types.ObjectId, ref: 'Workout' },
    rating: { type: Schema.Types.ObjectId, ref: 'Rating' },
    tops: { type: Schema.Types.ObjectId, ref: 'Top' },
    bottoms: { type: Schema.Types.ObjectId, ref: 'Bottom' },
    outerwear: { type: Schema.Types.ObjectId, ref: 'Outerwear' },
    accessories: { type: Schema.Types.ObjectId, ref: 'Accessory' },
    shoes: { type: Schema.Types.ObjectId, ref: 'Shoe' },
  },
  { collection: 'Outfit' },
);

export default outfitSchema;
