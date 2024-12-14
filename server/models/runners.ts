import mongoose, { Model } from 'mongoose';
import runnerSchema from './schema/runner';
import { Runner } from '../types';

/**
 * Mongoose model for the `Runner` collection.
 *
 * This model is created using the `Runner` interface and the `runnerSchema`, representing the
 * `Runner` collection in the MongoDB database, and provides an interface for interacting with
 * the stored users.
 *
 * @type {Model<Runner>}
 */
const RunnerModel: Model<Runner> = mongoose.model<Runner>('Runner', runnerSchema);

export default RunnerModel;
