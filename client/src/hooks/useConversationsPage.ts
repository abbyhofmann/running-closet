import { useDemoRouter } from '@toolpad/core/internal';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Conversation } from '../types';
import useUserContext from './useUserContext';
import { getConversations } from '../services/conversationService';

/**
 * Custom hook for managing the conversation page.
 * @param {string | undefined} cid - the cid passed in through routing within the website (come from the params of the URL)
 * @returns user - the current user logged in.
 * @returns conversations - the list of conversations being displayed.
 * @returns setConversations - a function that sets the conversations being displayed.
 * @returns sortByUpdatedAt - a function that sorts conversations by the most recently updated conversation.
 * @returns router - router that manages navigation.
 * @returns searchInput - the current input within the search bar
 * @returns setSearchInput - a function that sets the searchInput to be the value typed
 * @returns filteredConversationsBySearchInput - an array of conversations that have been filtered based upon the search input
 * @returns showSearchResults - a boolean to determine whether the search results should be shown
 * @returns setShowSearchResults - a function that updates whether the search results should be shown
 */
const useConversationPage = (cid: string | undefined) => {
  const { user, socket } = useUserContext();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [searchInput, setSearchInput] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [filteredConversationsBySearchInput, setFilteredConversationsBySearchInput] = useState<
    Conversation[]
  >([]);
  const router = useDemoRouter('/dashboard');
  const navigate = useNavigate();

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

  useEffect(() => {
    if (cid) {
      const conversationExists = conversations.some(c => c._id ?? c._id === cid);
      if (conversationExists) {
        navigate(`/conversations/`);
        router.navigate(`/conversation/${cid}`);
      }
    }
  }, [cid, conversations, router, navigate]);

  /**
   * Update filtered conversations based on search input and user context.
   */
  useEffect(() => {
    if (!searchInput) {
      setFilteredConversationsBySearchInput(conversations);
    } else {
      const filtered = conversations.filter(
        conversation =>
          conversation.users
            .filter(u => u.username !== user.username) // exclude the logged-in user
            .some(convoUser =>
              convoUser.username.toLowerCase().includes(searchInput.toLowerCase()),
            ), // match the search input username
      );
      setFilteredConversationsBySearchInput(filtered);
    }
  }, [conversations, searchInput, user.username]);

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

  useEffect(() => {
    async function fetchData() {
      if (user._id) {
        const convos = (await getConversations(user._id)).sort(sortByUpdatedAt);
        setConversations(convos);
      }
    }
    fetchData();
  }, [user._id]);

  return {
    user,
    conversations,
    setConversations,
    sortByUpdatedAt,
    router,
    searchInput,
    setSearchInput,
    filteredConversationsBySearchInput,
    showSearchResults,
    setShowSearchResults,
  };
};

export default useConversationPage;
