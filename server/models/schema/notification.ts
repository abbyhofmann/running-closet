import { Schema } from 'mongoose';

/**
 * Mongoose schema for the Notification collection.
 *
 * This schema defines the structure of notifications used in the database.
 * Each notification includes the following fields:
 * - `user`: The username of the user that has a notification.
 * - `message_id`: The message_id that the notification is for.
 */
const notificationSchema: Schema = new Schema(
  {
    user: {
      type: String,
    },
    message_id: {
      type: Date,
    },
  },
  { collection: 'Notification' },
);

export default notificationSchema;
