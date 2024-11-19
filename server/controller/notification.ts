import express, { Response } from 'express';
import { ObjectId } from 'mongodb';
import {
  DeleteNotificationRequest,
  FakeSOSocket,
  FindNotificationsByUsernameRequest,
} from '../types';
import { deleteNotificationById, fetchNotifsByUsername } from '../models/application';

const notificationController = (socket: FakeSOSocket) => {
  const router = express.Router();

  /**
   * Handles deleting the notification with the id specified in the request. The notification ID is first validated.
   * If the notification is invalid or deleting fails, the HTTP response status is updated.
   *
   * @param req The DeleteNotificationRequest object containing the notification ID.
   * @param res The HTTP response used to send back the result of the operation.
   * @returns A Promise that resolves to void.
   */
  const deleteNotification = async (
    req: DeleteNotificationRequest,
    res: Response,
  ): Promise<void> => {
    const { nid } = req.params;

    if (!ObjectId.isValid(nid)) {
      res.status(400).send('Invalid ID format');
      return;
    }

    try {
      const notificationSuccessfullyDeleted = await deleteNotificationById(nid);

      if (!notificationSuccessfullyDeleted) {
        throw new Error('Notification not deleted');
      }

      res.json(notificationSuccessfullyDeleted);
    } catch (err) {
      res.status(500).send(`Error when deleting notification with id: ${nid}`);
    }
  };

  /**
   * Gets all the notifications of the provided user.
   * @param req The FindNotificationsByUsernameRequest containing the username of the user.
   * @param res The HTTP response object used to send back the result of the operation.
   * @returns A Promise that resolves to void.
   */
  const getNotifications = async (
    req: FindNotificationsByUsernameRequest,
    res: Response,
  ): Promise<void> => {
    const { username } = req.params;

    try {
      const notifications = await fetchNotifsByUsername(username);

      if ('error' in notifications) {
        throw new Error(notifications.error as string);
      }
      res.json(notifications);
    } catch (err) {
      res.status(500).send(`Error when fetching notifications: ${(err as Error).message}`);
    }
  };

  router.delete('/deleteNotification/:nid', deleteNotification);
  router.get('/getNotifications/:username', getNotifications);

  return router;
};

export default notificationController;
