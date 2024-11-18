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

/**
 * Gets all the conversations for which a user is a participant in.
 *
 * @param uid The id of the user whose conversations are being retrieved.
 * @throws Error if there is an issue fetching the conversations by user ID.
 */
const getConversations = async (uid: string): Promise<Conversation[]> => {
  const res = await api.get(`${CONVERSATION_API_URL}/getConversations/${uid}`);

  if (res.status !== 200) {
    throw new Error('Error while fetching all conversations');
  }

  return res.data;
};

/**
 * Gets a conversation by its ID.
 *
 * @param cid The ID of the conversation to fetch.
 * @throws Error if there is an issue fetching the conversation by ID.
 */
const getConversation = async (cid: string): Promise<Conversation> => {
  const res = await api.get(`${CONVERSATION_API_URL}/getConversation/${cid}`);

  if (res.status !== 200) {
    throw new Error('Error while fetching conversation');
  }
  return res.data;
};

/**
 * Function to blast a message - i.e. send a message to every follower of a user.
 *
 * @param uid The id of the user.
 * @param messageContent The message content to send.
 * @throws Error if there is an issue sending the message.
 */
const sendBlastMessage = async (uid: string, messageContent: string): Promise<Conversation> => {
  const data = { uid, messageContent };
  const res = await api.post(`${CONVERSATION_API_URL}/sendBlastMessage`, data);

  if (res.status !== 200) {
    throw new Error('Error while sending message to all followers');
  }

  return res.data;
};

export { addConversation, getConversations, sendBlastMessage, getConversation };
