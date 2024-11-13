import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { AppProvider, NavigationItem, type Navigation } from '@toolpad/core/AppProvider';
import MessageIcon from '@mui/icons-material/Message';
import SearchIcon from '@mui/icons-material/Search';
import IconButton from '@mui/material/IconButton';
import MarkUnreadChatAltIcon from '@mui/icons-material/MarkUnreadChatAlt';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ForumIcon from '@mui/icons-material/Forum';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import './index.css';
import blue from '@mui/material/colors/blue';
import React from 'react';
import { TextField, Tooltip } from '@mui/material';
import useConversationPage from '../../../hooks/useConversationsPage';

// can be removed once inidividual conversation page is in. displays routing. from MUI
function DemoPageContent({ pathname }: { pathname: string }) {
  return (
    <Box
      sx={{
        py: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
      }}>
      <Typography>Dashboard content for {pathname}</Typography>
    </Box>
  );
}

/**
 * Search function from MUI. Displays a search bar and handles input.
 * @returns the search bar component.
 */
function Search() {
  return (
    <React.Fragment>
      <Tooltip title='Search' enterDelay={1000} sx={{ margin: 'auto' }}>
        <div>
          <IconButton
            type='button'
            aria-label='search'
            sx={{
              display: { xs: 'inline', md: 'none' },
            }}>
            <SearchIcon />
          </IconButton>
        </div>
      </Tooltip>
      <TextField
        label='Search'
        variant='outlined'
        size='small'
        slotProps={{
          input: {
            endAdornment: (
              <IconButton type='button' aria-label='search' size='small'>
                <SearchIcon />
              </IconButton>
            ),
            sx: { pr: 0.5 },
          },
        }}
        sx={{ display: { xs: 'none', md: 'inline-block' }, marginLeft: 3, marginTop: 2 }}
      />
    </React.Fragment>
  );
}

/**
 * Represents the conversations page object that displays all of the users conersations on the
 * left hand side and displays the individual conversation once clicked on.
 * @returns the conversations page object.
 */
export default function ConversationsPage() {
  const { user, conversations, sortByUpdatedAt, router } = useConversationPage();

  // Creates the navigation item objects for the individual covnersations for the nav bar
  const messagesNav: NavigationItem[] = conversations.sort(sortByUpdatedAt).map(c => ({
    segment: `conversation/${c._id}`,
    title: c.users
      .filter(u => user.username !== u.username)
      .map(u => ' '.concat(u.username))
      .toString(),
    icon:
      c.messages.filter(m => m.readBy.map(n => n.username).includes(user.username)).length > 0 ? (
        <MessageIcon />
      ) : (
        <MarkUnreadChatAltIcon />
      ),
  }));

  // Sets up the navigation bar on the side that links to the new conversations page,
  // and individual conversations.
  let navigation: Navigation = [
    {
      icon: Search(),
    },
    {
      kind: 'divider',
    },
    {
      segment: 'newMessage',
      title: 'new message',
      icon: <AddCircleIcon sx={{ color: 'green' }} />,
    },
    {
      kind: 'divider',
    },
    {
      kind: 'header',
      title: 'Messages',
    },
  ];

  navigation = navigation.concat(messagesNav);

  return (
    <AppProvider
      navigation={navigation}
      branding={{
        logo: <ForumIcon className='messagesIcon' sx={{ color: blue[700], marginTop: 1 }} />,
        title: 'Messages',
      }}
      router={router}>
      <DashboardLayout>
        <DemoPageContent pathname={router.pathname} />
      </DashboardLayout>
    </AppProvider>
  );
}
