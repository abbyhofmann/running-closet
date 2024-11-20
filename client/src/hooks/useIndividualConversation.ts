import { useState, ChangeEvent, useEffect, useRef } from 'react';
import { getConversation } from '../services/conversationService';
import { sendMessage, markMessageAsRead } from '../services/messageService';
import { Conversation, Message } from '../types';
import useUserContext from './useUserContext';

/**
 * A custom hook with the logic for an individual conversation component
 * @param cidpath the pathname for the current conversation (e.g. /conversation/123)
 * @returns conversationNames - The name(s) of the conversation
 * @returns messages - The messages in the conversation
 * @returns newMessage - The current value of the new message input
 * @returns alert - The alert message to display
 * @returns handleNewMessageChange - Function to handle changes in the new message input field
 * @returns handleSendMessage - Function to handle sending a new message
 * @returns listRef - Reference to the message list elements (necessary for scrolling)
 */
const useIndividualConversation = (cidpath: string) => {
  const { user, socket } = useUserContext();
  const [conversationId, setConversationId] = useState<string>(cidpath.split('/')[2]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationNames, setConversationNames] = useState<string[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [alert, setAlert] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [profileGraphic, setProfileGraphic] = useState<number>(-1);

  /**
   * Ensures that the message list scrolls to the bottom when new messages are added (so the most recent is viewed first)
   */
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  /**
   * Fetches the conversation data when the component mounts
   */
  useEffect(() => {
    async function fetchData() {
      if (conversationId) {
        try {
          const conversation = await getConversation(conversationId);
          if (!conversation) {
            throw new Error('Conversation not found');
          }
          setConversationNames(
            conversation.users
              .filter(u => user.username !== u.username)
              .map(u => u.username.toString()),
          );
          setMessages(conversation.messages.sort((a, b) => (a.sentAt > b.sentAt ? 1 : -1)));
          setProfileGraphic(
            conversation.users.filter(u => user.username !== u.username).length > 1
              ? 0
              : conversation.users.filter(u => user.username !== u.username)[0].profileGraphic,
          );
        } catch (err) {
          setAlert('There was an issue loading the conversation. Please try again.');
        }
      }
    }

    /**
     * Function that handles updating the conversation when a new message is sent by
     * replacing the current conversation with the updated one if the conversation ids match
     * @param conversation - the updated conversation object
     */
    const handleConversationUpdate = (conversation: Conversation) => {
      if (conversation._id?.toString() === conversationId) {
        setMessages(conversation.messages.sort((a, b) => (a.sentAt > b.sentAt ? 1 : -1)));
      }
    };

    fetchData();

    socket.on('conversationUpdate', handleConversationUpdate);

    return () => {
      socket.off('conversationUpdate', handleConversationUpdate);
    };
  }, [conversationId, user.username, socket]);

  useEffect(() => {
    setConversationId(cidpath.split('/')[2]);
  }, [cidpath]);

  useEffect(() => {
    async function markUnreadMessagesAsRead() {
      try {
        const unreadMessages = messages.filter(
          m => m.readBy.findIndex(u => u.username === user.username) === -1,
        );
        if (unreadMessages.length > 0) {
          Promise.all(
            unreadMessages.map(m =>
              m._id && user._id ? markMessageAsRead(m._id.toString(), user._id) : null,
            ),
          );
        }
      } catch (err) {
        // if this fails, just try to mark them as read again
        markUnreadMessagesAsRead();
      }
    }

    markUnreadMessagesAsRead();
  }, [messages, user]);

  /**
   * Function to handle when the new message input is changed
   * @param e - the event object
   */
  const handleNewMessageChange = (e: ChangeEvent<HTMLInputElement>) =>
    setNewMessage(e.target.value);

  /**
   * Function to handling sending a new message when the send message button is clicked
   * If the message is succesfully sent, it is appended to the chat, if not an alert is shown
   * @param e - the event object
   */
  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (newMessage === '') {
      return;
    }

    try {
      const res = await sendMessage(user.username, newMessage, conversationId);
      if (res) {
        setMessages([...messages, res]);
        setNewMessage('');
        setAlert(null);
      } else {
        setAlert('There was an issue sending the message. Please try again.');
      }
    } catch (err) {
      setAlert('There was an issue sending the message. Please try again.');
    }
  };

  return {
    conversationNames,
    messages,
    newMessage,
    alert,
    handleNewMessageChange,
    handleSendMessage,
    listRef,
    profileGraphic,
  };
};

export default useIndividualConversation;
