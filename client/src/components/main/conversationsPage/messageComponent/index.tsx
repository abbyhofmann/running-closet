import { ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import { Box } from '@mui/system';
import { useState } from 'react';
import { Message } from '../../../../types';
import useUserContext from '../../../../hooks/useUserContext';
import { getMessageDate } from '../../../../tool';
import ProfileAvatar from '../../../profileAvatar';

/**
 * Interface represeting the props of the MessageComponent
 *
 * message - The message object containing the message information.
 */
interface MessageComponentProps {
  message: Message;
  groupConvo: boolean;
}

/**
 * The MessageComponent represents an indivual message that is a part of the conversation.
 * It displays an icon for the sender, the message content, and the time the message was sent.
 */
export default function MessageComponent(props: MessageComponentProps) {
  const { user } = useUserContext();
  const { message, groupConvo } = props;
  const [userSent] = useState<boolean>(message.sender.username === user.username);

  return (
    <ListItem>
      <Box
        display='flex'
        flexDirection='row'
        justifyContent={userSent ? 'flex-end' : 'flex-start'}
        alignItems='center'
        sx={{
          width: 1,
          maxWidth: 1,
          minWidth: 1,
        }}>
        <Box mr={2}>
          {!userSent && (
            <ListItemAvatar>
              <ProfileAvatar
                profileGraphic={message.sender.profileGraphic}
                size={40}></ProfileAvatar>
              {/* if this is a group conversation, we need to display the username of the sender of each message */}
              {groupConvo ? message.sender.username : ''}
            </ListItemAvatar>
          )}
        </Box>

        <Box flex={1} maxWidth='70%' sx={{ wordBreak: 'break-all', whiteSpace: 'pre-wrap' }}>
          <ListItemText
            primary={message.messageContent}
            secondary={`${getMessageDate(new Date(message.sentAt))}`}
            style={{ textAlign: userSent ? 'right' : 'left' }}
          />
        </Box>

        <Box ml={2}>
          {userSent && (
            <ListItemAvatar>
              <ProfileAvatar profileGraphic={user.profileGraphic} size={40}></ProfileAvatar>
            </ListItemAvatar>
          )}
        </Box>
      </Box>
    </ListItem>
  );
}
