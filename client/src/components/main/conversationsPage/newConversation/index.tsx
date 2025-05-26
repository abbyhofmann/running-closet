import './index.css';
import { Alert, Button, TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';
import CheckIcon from '@mui/icons-material/Check';
import { Campaign } from '@mui/icons-material';
import SearchUsers from './searchUsers';
import { DashboardNavigationProps } from '../../../../types';
import useNewConversationPage from '../../../../hooks/useNewConversationPage';

/**
 * Represents the NewConversationPage component which allows a user to start a new conversation
 * by searching for the users that they want to send a message to and then send a message.
 * @returns the NewConversationPage component;
 */
const NewConversationPage = (props: DashboardNavigationProps) => {
  const { navigate, setConversations, conversations } = props;
  const {
    alert,
    blastMessageContent,
    handleBlastMessageContentChange,
    sendBlast,
    setAlert,
    blastMessageSuccess,
  } = useNewConversationPage(setConversations);
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        maxHeight: 1,
        minHeight: 1,
        width: 1,
        maxWidth: 1,
        minWidth: 1,
      }}>
      <Box sx={{ p: 2, marginX: 2 }}>
        <SearchUsers
          setAlert={setAlert}
          navigate={navigate}
          setConversations={setConversations}
          conversations={conversations}></SearchUsers>
      </Box>
      <Box
        sx={{
          marginTop: 5,
          marginX: 2,
          display: 'flex',
          flexDirection: 'column',
        }}>
        <Typography variant='h5' sx={{ marginLeft: 2, color: '#32292F' }}>
          Send a blast message to all followers:
        </Typography>
        <Box component='form' sx={{ p: 2, flexShrink: 0 }}>
          <Box display='flex' alignItems='center' width={1} gap={5}>
            <Box flex='0 0 70%'>
              <TextField
                fullWidth
                multiline
                variant='outlined'
                placeholder='Type a message'
                value={blastMessageContent}
                onChange={handleBlastMessageContentChange}
              />
            </Box>
            <Box flex='0 0 20%'>
              <Button
                variant='contained'
                fullWidth
                onClick={sendBlast}
                disabled={blastMessageContent === ''}
                sx={{ bgcolor: '#473BF0' }}>
                <Campaign sx={{ marginRight: 1 }}></Campaign>
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
      {alert && (
        <Alert sx={{ margin: 2 }} severity='error'>
          {alert}
        </Alert>
      )}
      {!alert && blastMessageSuccess && (
        <Alert
          sx={{ margin: 2, bgcolor: '#C8C7EC', color: '#32292F' }}
          icon={<CheckIcon fontSize='inherit' sx={{ color: '#32292F' }} />}
          severity='success'>
          {blastMessageSuccess}
        </Alert>
      )}
    </Box>
  );
};
export default NewConversationPage;
