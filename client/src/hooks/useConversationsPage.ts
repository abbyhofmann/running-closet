import { useDemoRouter } from '@toolpad/core/internal';
import { useEffect, useState } from 'react';
import { Conversation } from '../types';
import useUserContext from './useUserContext';
import { getConversations } from '../services/conversationService';

/**
 * Custom hook for managing the conversation page.
 * @returns user - the current user logged in.
 * @returns conversations - the list of conversations being displayed.
 * @returns setConversations - a function that sets the conversations being displayed.
 * @returns sortByUpdatedAt - a function that sorts conversations by the most recently updated conversation.
 * @returns router - router that manages navigation.
 */
const useConversationPage = () => {
  const { user, socket } = useUserContext();
  const [conversations, setConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    async function fetchData() {
      if (user._id) {
        const convos = await getConversations(user._id);
        setConversations(convos);
      }
    }
    fetchData();

    /**
     * Function to handle updating the conversation list when a new message is added.
     * The main purpose is to ensure that the conversation list is sorted by the most recent message
     * and the unread message indicator is updated.
     * @param conversation The updated conversation object.
     */
    const handleConversationUpdate = (conversation: Conversation) => {
      setConversations(prevClist =>
        prevClist.map(c => (c._id === conversation._id ? conversation : c)),
      );
    };

    socket.on('conversationUpdate', handleConversationUpdate);

    return () => {
      socket.off('conversationUpdate', handleConversationUpdate);
    };
  }, [user._id, socket]);

  /**
   * Determines whether the first conversation is newer than the second one.
   * @param conversation1 the first conversation.
   * @param conversation2 the second conversation.
   * @returns -1 if the first is newer than the second, 0 if they were updated at the same time,
   * and 1 if the second one is newer.
   */
  const sortByUpdatedAt = (conversation1: Conversation, conversation2: Conversation): number => {
    if (conversation1.updatedAt > conversation2.updatedAt) {
      return -1;
    }
    if (conversation1.updatedAt < conversation2.updatedAt) {
      return 1;
    }
    return 0;
  };

  const router = useDemoRouter('/dashboard');

  return { user, conversations, setConversations, sortByUpdatedAt, router };
};

export default useConversationPage;
