import { Notification } from '../types';
import api from './config';

const NOTIFICATION_API_URL = `${process.env.REACT_APP_SERVER_URL}/notification`;

/**
 * Gets all the notifications for the given user.
 *
 * @param username The username of the user whose notifications are being retrieved.
 * @throws Error if there is an issue fetching the notifications by username.
 */
const getNotifications = async (username: string): Promise<Notification[]> => {
  const res = await api.get(`${NOTIFICATION_API_URL}/getNotifications/${username}`);

  if (res.status !== 200) {
    throw new Error('Error while fetching all notifications');
  }

  return res.data;
};

/**
 * Deletes the notification with the given id.
 *
 * @param username The id of the notification being deleted.
 * @returns a boolean representing the success of the deletion.
 * @throws Error if there is an issue deleting the notification.
 */
const deleteNotification = async (nid: string): Promise<boolean> => {
  const res = await api.delete(`${NOTIFICATION_API_URL}/deleteNotification/${nid}`);

  if (res.status !== 200) {
    throw new Error('Error while deleting notification');
  }

  return res.data;
};

export { getNotifications, deleteNotification };
