import { Schema } from 'mongoose';

/**
 * Mongoose schema for the Message collection.
 *
 * This schema defines the structure for storing messages in the database. Messages are a part of Conversations.
 * Each message includes the following fields:
 * - `messageContent`: The content of the message.
 * - `sender`: The user who sent the message.
 * - `sentAt`: The date and time when the message was sent.
 * - `readBy`: An array of users that have read the message.
 * - `cid`: The ID of the conversation to which the message belongs.
 */
const messageSchema: Schema = new Schema(
  {
    messageContent: {
      type: String,
    },
    sender: { type: Schema.Types.ObjectId, ref: 'User' },
    sentAt: {
      type: Date,
    },
    readBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    cid: { type: String },
  },
  { collection: 'Message' },
);

export default messageSchema;
