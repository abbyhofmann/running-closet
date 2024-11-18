import api from './config';
import { Message } from '../types';

const MESSAGE_API_URL = `${process.env.REACT_APP_SERVER_URL}/message`;

/**
 * Sends a new message.
 *
 * @param sentBy the username of the user sending the message
 * @param messageContent the content of the message
 * @param cid the conversation id that the message should be a part of
 * @returns a promise object containing the message that was sent
 * @throws Error if the request fails or the response status is not 200.
 */
const sendMessage = async (
  sentBy: string,
  messageContent: string,
  cid: string,
): Promise<Message> => {
  const data = { sentBy, messageContent, cid };

  const res = await api.post(`${MESSAGE_API_URL}/sendMessage`, data);
  if (res.status !== 200) {
    throw new Error('Error while sending a message');
  }
  return res.data;
};

/**
 * Marks a message as read
 *
 * @param mid the message id of the message to mark as read
 * @param uid the user id of the user who is reading the message
 */
const markMessageAsRead = async (mid: string, uid: string): Promise<void> => {
  const data = { mid, uid };

  const res = await api.post(`${MESSAGE_API_URL}/markAsRead`, data);
  if (res.status !== 200) {
    throw new Error('Error while marking message as read');
  }

  return res.data;
};
export { sendMessage, markMessageAsRead };
