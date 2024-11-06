import api from './config';
import { Conversation } from '../types';

const CONVERSATION_API_URL = `${process.env.REACT_APP_SERVER_URL}/conversation`;

/**
 * Function to add a new conversation.
 *
 * @param c The conversation object to add.
 * @throws Error if there is an issue creating the new question.
 */
const addConversation = async (c: Conversation): Promise<Conversation> => {
  const res = await api.post(`${CONVERSATION_API_URL}/addConversation`, c);

  if (res.status !== 200) {
    throw new Error('Error while creating a new conversation');
  }

  return res.data;
};

export default addConversation;
