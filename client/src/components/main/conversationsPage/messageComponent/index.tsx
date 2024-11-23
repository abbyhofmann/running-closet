import { ListItem, ListItemAvatar, Typography } from '@mui/material';
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
        <Box mr={1.5}>
          {!userSent && (
            <ListItemAvatar
              sx={{
                display: 'flex', // Enables flexbox
                flexDirection: 'column', // Stacks items vertically
                alignItems: 'center', // Centers items horizontally
                justifyContent: 'center', // Centers items vertically
              }}>
              <ProfileAvatar profileGraphic={message.sender.profileGraphic} size={40} />
              {/* Display sender's name if it's a group conversation */}
              <Typography color='#32292F' sx={{ marginTop: 1, textAlign: 'center' }}>
                {groupConvo ? message.sender.firstName : ''}
              </Typography>
            </ListItemAvatar>
          )}
        </Box>

        <Box
          sx={{
            maxWidth: '70%',
            textAlign: userSent ? 'right' : 'left',
          }}>
          {/* Message Content */}
          <Box
            sx={{
              display: 'inline-block',
              backgroundColor: userSent ? '#d8d8f2' : '#f5c9c1', // lightened versions of our orange and purple
              padding: 1.5,
              borderRadius: 2,
              wordBreak: 'break-word',
              whiteSpace: 'pre-wrap',
            }}>
            <Typography
              variant='body1'
              sx={{
                color: '#32292F',
                mb: 0.5,
              }}>
              {message.messageContent}
            </Typography>
          </Box>

          {/* Timestamp */}
          <Typography
            variant='caption'
            sx={{
              color: '#776270',
              mt: 0.5,
              display: 'block',
            }}>
            {getMessageDate(new Date(message.sentAt))}
          </Typography>
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
