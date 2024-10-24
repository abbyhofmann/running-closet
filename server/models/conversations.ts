// Conversation Document Schema
import mongoose, { Model } from 'mongoose';
import conversationSchema from './schema/conversation';
import { Conversation } from '../types';

/**
 * Mongoose model for the `Conversation` collection.
 *
 * This model is created using the `Conversation` interface and the `conversationSchema`, representing the
 * `Conversation` collection in the MongoDB database, and provides an interface for interacting with
 * the stored conversations.
 *
 * @type {Model<Conversation>}
 */
const ConversationModel: Model<Conversation> = mongoose.model<Conversation>(
  'Conversation',
  conversationSchema,
);

export default ConversationModel;
