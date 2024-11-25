import express, { Response } from 'express';
import { ObjectId } from 'mongodb';
import {
  AddMessageRequest,
  Conversation,
  FakeSOSocket,
  MarkMessageAsReadRequest,
  Message,
  User,
  Notification,
  NotificationUpdatePayload,
} from '../types';
import {
  addMessage,
  areUsersRegistered,
  fetchConversationById,
  fetchUserById,
  markMessageAsRead,
  fetchUserByUsername,
  saveMessage,
  saveNotification,
  sendEmail,
  fetchNotifsByUsername,
  deleteNotificationById,
} from '../models/application';

const messageController = (socket: FakeSOSocket) => {
  const router = express.Router();

  /**
   * Checks if the provided add message request contains the required fields.
   * @param req The request object containing the message data.
   * @returns true if the request is valid, otherwise false.
   */
  const isAddMessageRequestValid = (req: AddMessageRequest): boolean =>
    !!req.body.sentBy &&
    req.body.sentBy !== '' &&
    !!req.body.messageContent &&
    req.body.messageContent !== '' &&
    !!req.body.cid &&
    req.body.cid !== '';

  /**
   * Checks to ensure that the user is a part of the conversation
   * @param {Conversation} conversation the conversation to check
   * @param {User} sender the user to check to see if they are a part of the conversation
   * @returns a boolean value indicating whether the user is a part of the conversation
   */
  const isUserInConversation = (conversation: Conversation, sender: User): boolean =>
    conversation.users.some(user => user._id?.toString() === sender._id?.toString());

  /**
   * Handles adding a new message to the specified conversation. The message is first validated and then saved.
   * If the message is invalid or saving fails, the HTTP response status is updated.
   *
   * @param req The MessageRequest object containing the message data.
   * @param res The HTTP response used to send back the result of the operation.
   *
   * @returns A Promise that resolves to void.
   */
  const sendMessage = async (req: AddMessageRequest, res: Response): Promise<void> => {
    if (!isAddMessageRequestValid(req)) {
      res.status(400).send('Invalid request');
      return;
    }

    const { sentBy, messageContent, cid } = req.body;

    if (!ObjectId.isValid(cid)) {
      res.status(400).send('Invalid ID format');
      return;
    }

    try {
      const user = await fetchUserByUsername(sentBy);

      if (user && 'error' in user) {
        throw new Error(user.error);
      }

      const conversation = await fetchConversationById(cid);

      if (conversation && 'error' in conversation) {
        throw new Error(conversation.error);
      }

      if (!(await areUsersRegistered(conversation.users))) {
        res.status(400).send('Users are not still registered');
        return;
      }

      if (!isUserInConversation(conversation, user)) {
        res.status(401).send('Sender is not part of the conversation');
        return;
      }

      const message: Message = {
        messageContent,
        sender: user,
        cid,
        readBy: [user],
        sentAt: new Date(),
      };

      const msgFromDb = await saveMessage(message);

      if ('error' in msgFromDb) {
        throw new Error(msgFromDb.error);
      }

      const updatedConversation = await addMessage(msgFromDb);

      if (updatedConversation && 'error' in updatedConversation) {
        throw new Error(updatedConversation.error);
      }

      // adds notifications for all users that were sent the message.
      const filteredUsers = updatedConversation.users.filter(u => u.username !== user.username);

      const promises: Promise<void>[] = filteredUsers.map(async u => {
        const notification: Notification = {
          user: u.username,
          message: msgFromDb,
        };
        const notificationFromDb = await saveNotification(notification);
        if (notificationFromDb && 'error' in notificationFromDb) {
          throw new Error(notificationFromDb.error);
        }

        const notificationUpdate: NotificationUpdatePayload = {
          notification: notificationFromDb,
          type: 'add',
        };

        const sendEmailResp = await sendEmail(u.email, user.username, user.profileGraphic);
        if (sendEmailResp && !sendEmailResp.success) {
          throw new Error(sendEmailResp.message);
        }
        socket.emit('notificationsUpdate', notificationUpdate);
      });

      await Promise.all(promises);

      socket.emit('conversationUpdate', updatedConversation);

      res.json(msgFromDb);
    } catch (err) {
      res.status(500).send(`Error when adding message: ${(err as Error).message}`);
    }
  };

  /**
   * Validates the request to mark a message as read to ensure everything necessary is provided.
   *
   * @param {MarkMessageAsReadRequest} req the request to validate
   * @returns  true if the request is valid, otherwise false.
   */
  const isMarkAsReadRequestValid = (req: MarkMessageAsReadRequest): boolean =>
    !!req.body.mid && !!req.body.uid;

  /**
   * Handles marking a message as read by the user specified in the request. The message ID is first validated and then marked as read.
   * If the message is invalid or saving fails, the HTTP response status is updated.
   *
   * @param req The MarkMessageAsReadRequest object containing the message ID and user ID.
   * @param res The HTTP response used to send back the result of the operation.
   * @returns A Promise that resolves to void.
   */
  const markAsRead = async (req: MarkMessageAsReadRequest, res: Response): Promise<void> => {
    if (!isMarkAsReadRequestValid(req)) {
      res.status(400).send('Invalid request');
      return;
    }

    const mid = req.body.mid as string;
    const uid = req.body.uid as string;

    if (!ObjectId.isValid(mid) || !ObjectId.isValid(uid)) {
      res.status(400).send('Invalid ID format');
      return;
    }

    try {
      const user = await fetchUserById(uid);

      if (user && 'error' in user) {
        throw new Error(user.error);
      }

      const message = await markMessageAsRead(mid, user);

      if (message && 'error' in message) {
        throw new Error(message.error);
      }

      const userNotifications = await fetchNotifsByUsername(user.username);

      if (userNotifications && 'error' in userNotifications) {
        throw new Error(userNotifications.error);
      }

      const notifications = userNotifications.filter(n => n.message._id?.equals(message._id));

      // if there is a notification for the current message, delete it. if there is not then keep going as expected.
      if (notifications.length !== 0) {
        if (notifications.length !== 1) {
          throw new Error(
            `Issue finding notification for message ${message._id} for user ${user.username}`,
          );
        }

        const notification = notifications[0];

        if (!notification._id) {
          throw new Error('Notification id undefined');
        }

        const notificationDeleted = await deleteNotificationById(notification._id.toString());

        if (!notificationDeleted) {
          throw new Error('Notification not successully deleted');
        }

        const notificationUpdate: NotificationUpdatePayload = {
          notification,
          type: 'remove',
        };

        socket.emit('notificationsUpdate', notificationUpdate);
      }

      const conversation = await fetchConversationById(message.cid);

      if (conversation && !('error' in conversation)) {
        socket.emit('conversationUpdate', conversation);
      }

      res.json(message);
    } catch (err) {
      res.status(500).send(`Error when marking message as read: ${(err as Error).message}`);
    }
  };

  router.post('/sendMessage', sendMessage);
  router.post('/markAsRead', markAsRead);

  return router;
};

export default messageController;
