import { Alert, Button, List, TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';
import MessageComponent from '../messageComponent';
import useIndividualConversation from '../../../../hooks/useIndividualConversation';

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
    conversationName,
    messages,
    newMessage,
    alert,
    handleNewMessageChange,
    handleSendMessage,
    listRef,
  } = useIndividualConversation(cidPath);

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
      <Box sx={{ p: 2, borderBottom: '1px solid lightgray' }}>
        <Typography variant='h6'>{conversationName}</Typography>
      </Box>

      <Box
        sx={{ flexGrow: 1, overflowY: 'auto', p: 2, width: 1, maxWidth: 1, minWidth: 1 }}
        ref={listRef}>
        <List>
          {messages.map(msg => (
            <MessageComponent key={msg._id} message={msg} />
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
