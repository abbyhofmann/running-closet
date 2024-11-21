import express, { Response } from 'express';
import { ObjectId } from 'mongodb';
import {
  Conversation,
  FakeSOSocket,
  AddConversationRequest,
  GetConversationRequest,
  FindConversationsByUserIdRequest,
  BlastMessageRequest,
  Notification,
  NotificationUpdatePayload,
} from '../types';
import {
  areUsersRegistered,
  saveConversation,
  doesConversationExist,
  fetchConversationById,
  fetchUserById,
  fetchConvosByParticipants,
  createOrFetchConversation,
  saveAndAddMessage,
  saveNotification,
} from '../models/application';

const conversationController = (socket: FakeSOSocket) => {
  const router = express.Router();

  /**
   * Validates the conversation object to ensure it contains the necessary field. The conversation
   * must have at least 2 users.
   *
   * @param conversation The conversation object to validate.
   * @returns `true` if the conversation is valid, otherwise `false`.
   */
  const isConversationBodyValid = (conversation: Conversation): boolean =>
    conversation.users !== undefined &&
    conversation.users.length !== 0 &&
    conversation.users.length !== 1;

  /**
   * Checks if the provided BlastMessageRequest contains the necessary fields.
   *
   * @param req BlastMessageRequest object containing the uid of the user sending the message,
   * as well as the string message content. Does not allow empty messages to be sent.
   * @returns `true` if the request is valid, otherwise `false`.
   */
  const isBlastMessageRequestValid = (req: BlastMessageRequest): boolean =>
    !!req.body.uid &&
    req.body.messageContent !== undefined &&
    req.body.messageContent.trim() !== '';

  /**
   * Adds a new conversation to the database. The conversation is first validated and
   * then saved. If the conversation is invalid or saving the conversation fails, the
   * HTTP response status is updated.
   *
   * @param req The AddConversationRequest object containing the question data.
   * @param res The HTTP response object used to send back the result of the operation.
   *
   * @returns A Promise that resolves to void.
   */
  const addConversation = async (req: AddConversationRequest, res: Response): Promise<void> => {
    if (!isConversationBodyValid(req.body)) {
      res.status(400).send('Invalid conversation body');
      return;
    }
    const { users } = req.body;
    const conversation: Conversation = {
      users,
      messages: [],
      updatedAt: new Date(),
    };

    if (!(await areUsersRegistered(conversation.users))) {
      res.status(400).send('Invalid conversation user');
      return;
    }

    try {
      if (await doesConversationExist(conversation.users)) {
        res.status(400).send('Conversation with provided users already exists');
        return;
      }
    } catch (err) {
      res.status(400).send(`Error occurred when checking if conversation exists: ${err}`);
      return;
    }

    try {
      const convoFromDb = await saveConversation(conversation);

      if ('error' in convoFromDb) {
        throw new Error(convoFromDb.error as string);
      }

      res.json(convoFromDb);
    } catch (err) {
      res.status(500).send(`Error when saving conversation: ${(err as Error).message}`);
    }
  };

  /**
   * Retrieves the conversation with the given conversation id from the database.
   * If there is an error, the HTTP response's status is updated.
   *
   * @param req The request object with the id of the conversation to retrieve.
   * @param res The HTTP response object used to send back the result of the operation.
   * @returns A Promise that resolves to void.
   */
  const getConversation = async (req: GetConversationRequest, res: Response): Promise<void> => {
    const { cid } = req.params;

    try {
      if (!ObjectId.isValid(cid)) {
        res.status(400).send('Invalid ID format');
        return;
      }
      const conversation = await fetchConversationById(cid);
      if ('error' in conversation) {
        throw new Error(conversation.error as string);
      }

      res.json(conversation);
    } catch (err) {
      res.status(500).send(`Error when fetching conversation: ${(err as Error).message}`);
    }
  };

  /**
   * Gets all the conversations that the provided user in a participant in.
   * @param req The FindConversationsByIdRequest containing the uid of the user.
   * @param res The HTTP response object used to send back the result of the operation.
   * @returns A Promise that resolves to void.
   */
  const getConversations = async (
    req: FindConversationsByUserIdRequest,
    res: Response,
  ): Promise<void> => {
    const { uid } = req.params;

    if (!ObjectId.isValid(uid)) {
      res.status(400).send('Invalid ID format');
      return;
    }

    try {
      const user = await fetchUserById(uid);

      if ('error' in user) {
        throw new Error(user.error as string);
      }

      const conversations = await fetchConvosByParticipants([user], false);

      if ('error' in conversations) {
        throw new Error(conversations.error as string);
      }
      res.json(conversations);
    } catch (err) {
      res.status(500).send(`Error when fetching conversations: ${(err as Error).message}`);
    }
  };

  /**
   * Sends a blast message, where a given message is sent to all the followers of the user
   * associated with the provided id. If there does not currently exist a conversation between
   * the user and a follower, a new conversation is created.
   *
   * @param req The BlastMessageRequest containing the uid and message string.
   * @param res The HTTP response object used to send back the result of the operation.
   *
   * @returns A Promise that resolves to void.
   */
  const sendBlastMessage = async (req: BlastMessageRequest, res: Response): Promise<void> => {
    if (!isBlastMessageRequestValid(req)) {
      res.status(400).send('Invalid blast message request body');
      return;
    }

    const { uid, messageContent } = req.body;

    if (!ObjectId.isValid(uid)) {
      res.status(400).send('Invalid ID format');
      return;
    }

    try {
      // get the user associated with the id
      const user = await fetchUserById(uid);

      if ('error' in user) {
        throw new Error(user.error as string);
      }

      // list of all user-follower conversation ids
      const blastCids: ObjectId[] = [];

      // logic for sending message to each follower
      await Promise.all(
        user.followers.map(async follower => {
          // conversation between user and this follower
          const userFollowerConvo = await createOrFetchConversation(user, follower);

          // add cid to list
          if (userFollowerConvo._id !== undefined) {
            blastCids.push(userFollowerConvo._id);
          }

          // create and send the message
          const sentMessage = await saveAndAddMessage(userFollowerConvo, user, messageContent);

          // create notification for each message sent
          const notification: Notification = {
            user: follower.username,
            message: sentMessage,
          };

          const notificationFromDb = await saveNotification(notification);
          if (notificationFromDb && 'error' in notificationFromDb) {
            throw new Error(notificationFromDb.error);
          }

          const notificationUpdate: NotificationUpdatePayload = {
            notification: notificationFromDb,
            type: 'add',
          };

          socket.emit('notificationsUpdate', notificationUpdate);
        }),
      );
      res.json(blastCids);
    } catch (err) {
      res.status(500).send(`Error when blasting message: ${(err as Error).message}`);
    }
  };

  // add appropriate HTTP verbs and their endpoints to the router
  router.post('/addConversation', addConversation);
  router.get('/getConversation/:cid', getConversation);
  router.get('/getConversations/:uid', getConversations);
  router.post('/sendBlastMessage', sendBlastMessage);

  return router;
};

export default conversationController;
