import { Schema } from 'mongoose';
/**
 * Mongoose schema for the Top collection.
 *
 * This schema defines the structure for storing tops in the database.
 * Each top includes the following fields:
 * 
 
 */
const topSchema: Schema = new Schema(
  {
    runner: { type: Schema.Types.ObjectId, ref: 'Runner' },
    outfit: { type: Schema.Types.ObjectId, ref: 'Outfit' },
    runType: {
        type: String,
    },
    dateCompleted: {
        type: Date,
    },
    distance: {
        type: Number,
    },
    duration: {
        type: Number,
    }, 
    location: {
        type: String,
    },
  },
  { collection: 'Top' },
);

export default topSchema;
