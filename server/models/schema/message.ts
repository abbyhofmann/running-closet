import { Schema } from 'mongoose';

/**
 * Mongoose schema for the Message collection.
 *
 * This schema defines the structure for storing messages in the database. Messages are a part of Conversations.
 * Each message includes the following fields:
 * - `messageContent`: The content of the message.
 * - `conversation`: The conversation to which the message belongs.
 * - `sender`: The user who sent the message.
 * - `sentAt`: The date and time when the message was sent.
 * - `readBy`: An array of users that have read the message.
 */
const messageSchema: Schema = new Schema(
  {
    messageContent: {
      type: String,
    },
    conversation: { type: Schema.Types.ObjectId, ref: 'Conversation' },
    sender: { type: Schema.Types.ObjectId, ref: 'User' },
    sentAt: {
      type: Date,
    },
    readBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { collection: 'Message' },
);

export default messageSchema;
