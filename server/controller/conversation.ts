import express, { Response } from 'express';
import { Conversation, FakeSOSocket, AddConversationRequest } from '../types';
import { areUsersRegistered, saveConversation, doesConversationExist } from '../models/application';

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

  // add appropriate HTTP verbs and their endpoints to the router
  router.post('/addConversation', addConversation);

  return router;
};

export default conversationController;
