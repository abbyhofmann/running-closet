import { ChangeEvent, useState } from 'react';
import useUserContext from './useUserContext';
import { getConversations, sendBlastMessage } from '../services/conversationService';
import { Conversation } from '../types';

/**
 * A custom hook for managing the new conversation's page real-time updates.
 * @param navigate a function that handles navigating to different paths.
 * @returns alert - represents the alert's message.
 * @returns blastMessageContent - represents the contenet of the message that will be blasted.
 * @returns handleBlastMessageContentChange - a funciton that handles change in the input form for blast messages.
 * @returns sendBlast - a function that sends a blast message to all users followers.
 * @returns setAlert - a function that sets the alert message's  text.
 */
const useNewConversationPage = (setConversations: (conversations: Conversation[]) => void) => {
  const { user } = useUserContext();
  const [alert, setAlert] = useState<string>();
  const [blastMessageSuccess, setBlastMessageSuccess] = useState<string>('');
  const [blastMessageContent, setBlastMessageContent] = useState<string>('');

  /**
   * Function to handle when the new message input is changed
   * @param e - the event object
   */
  const handleBlastMessageContentChange = (e: ChangeEvent<HTMLInputElement>) => {
    setBlastMessageSuccess('');
    setBlastMessageContent(e.target.value);
  };

  const sendBlast = () => {
    try {
      const fetchData = async () => {
        setBlastMessageContent('');
        setAlert('');
        setBlastMessageContent('');
        if (user._id) {
          await sendBlastMessage(user._id, blastMessageContent);
          setBlastMessageSuccess(
            `Blast message successfully send to all ${user.followers.length} followers!`,
          );
          const convos = await getConversations(user._id);
          setConversations(convos);
        } else {
          setAlert('Error sending blast message.');
        }
      };
      fetchData();
    } catch (err) {
      setAlert('Error sending blast message.');
    }
  };

  return {
    alert,
    blastMessageContent,
    handleBlastMessageContentChange,
    sendBlast,
    setAlert,
    blastMessageSuccess,
  };
};
export default useNewConversationPage;
