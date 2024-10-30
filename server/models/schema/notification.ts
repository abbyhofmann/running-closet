import { Schema } from 'mongoose';

/**
 * Mongoose schema for the Notification collection.
 *
 * This schema defines the structure of notifications used in the database.
 * Each notification includes the following fields:
 * - `user`: The username of the user that has a notification.
 * - `message`: The message that the notification is for.
 */
const notificationSchema: Schema = new Schema(
  {
    user: {
      type: String,
    },
    message: {
      type: Schema.Types.ObjectId,
      ref: 'Message',
    },
  },
  { collection: 'Notification' },
);

export default notificationSchema;
