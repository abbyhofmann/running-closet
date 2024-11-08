import express, { Response } from 'express';
import { ObjectId } from 'mongodb';
import {
  Conversation,
  FakeSOSocket,
  AddConversationRequest,
  FindConversationsByUserIdRequest,
} from '../types';
import {
  areUsersRegistered,
  saveConversation,
  doesConversationExist,
  fetchUserById,
  fetchConvosByParticipants,
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
   * Gets all the conversations that the provided user in a participant in.
   *
   * @param req The FindConversationsByIdRequest containing the uid of the user.
   * @param res The HTTP response object used to send back the result of the operation.
   *
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

  // add appropriate HTTP verbs and their endpoints to the router
  router.post('/addConversation', addConversation);
  router.get('/getConversations/:uid', getConversations);

  return router;
};

export default conversationController;
