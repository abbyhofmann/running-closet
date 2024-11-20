import { Alert, Button, List, TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import React from 'react';
import MessageComponent from '../messageComponent';
import useIndividualConversation from '../../../../hooks/useIndividualConversation';
import ProfileAvatar from '../../../profileAvatar';

/**
 * Interface represents the props for the IndividualConversation.
 *
 * cid - The conversation id.
 */
interface IndividualConversationProps {
  cidPath: string;
}

/**
 * IndividualConverastion component renders a page displaying a current conversation.
 * From this page, the user can see who the conversation is with, the messages in the conversation,
 * and then can send their own message.
 * @param cidPath the router conversation id path (includes /conversation/)
 */
export default function IndividualConversation({ cidPath }: IndividualConversationProps) {
  const {
    conversationNames,
    messages,
    newMessage,
    alert,
    handleNewMessageChange,
    handleSendMessage,
    listRef,
    profileGraphic,
  } = useIndividualConversation(cidPath);
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        maxHeight: 1,
        minHeight: 1,
        width: 1,
        maxWidth: 1,
        minWidth: 1,
      }}>
      <Box
        sx={{
          p: 2,
          borderBottom: '1px solid lightgray',
          justifyContent: 'flex-start',
          gap: 1,
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'row',
        }}>
        <ProfileAvatar profileGraphic={profileGraphic} size={40}></ProfileAvatar>
        <div>
          {/* Each name of the other user(s) in the convo is clickable */}
          <Typography variant='h6'>
            {conversationNames.map((name, index) => (
              <React.Fragment key={name}>
                <span
                  style={{ cursor: 'pointer', color: 'black', fontWeight: 'bold' }}
                  onClick={() => navigate(`/profile/${name}`)}>
                  {name}
                </span>
                {index < conversationNames.length - 1 && ', '}
              </React.Fragment>
            ))}
          </Typography>
        </div>
      </Box>

      <Box
        sx={{ flexGrow: 1, overflowY: 'auto', p: 2, width: 1, maxWidth: 1, minWidth: 1 }}
        ref={listRef}>
        <List>
          {messages.map(msg => (
            <MessageComponent
              key={msg._id}
              message={msg}
              groupConvo={conversationNames.length > 1}
            />
          ))}
        </List>
      </Box>

      <Box
        component='form'
        onSubmit={handleSendMessage}
        sx={{ p: 2, borderTop: '1px solid lightgray', flexShrink: 0 }}>
        <Box display='flex' alignItems='center' width={1} gap={5}>
          <Box flex='0 0 70%'>
            <TextField
              fullWidth
              multiline
              variant='outlined'
              placeholder='Type a message'
              value={newMessage}
              onChange={handleNewMessageChange}
            />
          </Box>
          <Box flex='0 0 20%'>
            <Button type='submit' variant='contained' fullWidth>
              Send
            </Button>
          </Box>
        </Box>
      </Box>
      {alert && <Alert severity='error'>{alert}</Alert>}
    </Box>
  );
}
