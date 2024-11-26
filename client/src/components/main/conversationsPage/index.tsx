import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { AppProvider, NavigationItem, type Navigation } from '@toolpad/core/AppProvider';
import SearchIcon from '@mui/icons-material/Search';
import IconButton from '@mui/material/IconButton';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ForumIcon from '@mui/icons-material/Forum';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import './index.css';
import React, { ChangeEvent } from 'react';
import { Badge, TextField, Tooltip } from '@mui/material';
import { useParams } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import useConversationPage from '../../../hooks/useConversationsPage';
import NewConversationPage from './newConversation';
import IndividualConversation from './individualConversation';
import ProfileAvatar from '../../profileAvatar';
import { Conversation, User } from '../../../types';

const theme = createTheme({
  palette: {
    primary: {
      main: '#5171A5',
    },
    secondary: {
      main: '#FF69B4',
    },
    background: {
      default: '#EDE6E3',
      paper: '#EDE6E3',
    },
  },
  colorSchemes: { light: true, dark: false },
});

function NoConversationLayout() {
  return (
    <Box
      sx={{
        py: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
      }}>
      <Typography>No conversation selected</Typography>
    </Box>
  );
}

/**
 * Search function from MUI. Displays a search bar and handles input.
 * @returns the search bar component.
 */
function Search(
  searchInput: string,
  setSearchInput: React.Dispatch<React.SetStateAction<string>>,
  setShowSearchResults: React.Dispatch<React.SetStateAction<boolean>>,
) {
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
    setShowSearchResults(true);
  };

  return (
    <React.Fragment>
      <Tooltip title='Search' enterDelay={1000} sx={{ margin: 'auto' }}>
        <IconButton type='button' aria-label='search' size='small'>
          <SearchIcon />
        </IconButton>
      </Tooltip>
      <TextField
        label='Search'
        variant='outlined'
        size='small'
        slotProps={{
          input: {
            sx: { pr: 0.5 },
          },
        }}
        sx={{
          display: { xs: 'none', md: 'inline-block' },
          marginLeft: 3,
          marginTop: 2,
          marginBottom: 1,
        }}
        value={searchInput}
        onChange={handleInputChange}
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
  const { cid } = useParams();

  const {
    user,
    conversations,
    sortByUpdatedAt,
    router,
    setConversations,
    searchInput,
    setSearchInput,
    filteredConversationsBySearchInput,
    showSearchResults,
    setShowSearchResults,
  } = useConversationPage(cid);

  /**
   * Gets the number of the associated profile graphic for the conversation. If there is one other user in
   * the conversation, get their profileGraphic field. If it is a group conversation, return 0.
   *
   * @param conversation The conversation in need of profile graphic.
   * @param currentUser The logged-in user part of the conversation.
   * @returns Number corresponding to the profile graphic to use. 0 corresponds to group conversation graphic.
   */
  const getConversationGraphicNumber = (conversation: Conversation, currentUser: User) => {
    const otherUsers = conversation.users.filter(u => currentUser.username !== u.username);

    return otherUsers.length === 1 ? otherUsers[0].profileGraphic : 0;
  };

  // Creates the navigation item objects for the individual conversations for the nav bar.
  const messagesNav: NavigationItem[] = conversations.sort(sortByUpdatedAt).map(c => ({
    segment: `conversation/${c._id}`,
    title: c.users
      .filter(u => user.username !== u.username)
      .map(u => ' '.concat(u.firstName))
      .toString(),
    icon: (
      <Badge
        color='error'
        variant='dot'
        invisible={
          c.messages.findIndex(
            m => m.readBy.findIndex(u => u.username === user.username) === -1,
          ) === -1
        }
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}>
        <ProfileAvatar profileGraphic={getConversationGraphicNumber(c, user)} size={40} />
      </Badge>
    ),
  }));

  /**
   * Creates the navigation item objects for the conversations resulting from the search, where
   * the search returns the conversations that include the input string as another user in the conversation.
   */
  const searchResultsNav: NavigationItem[] = filteredConversationsBySearchInput.map(c => ({
    segment: `conversation/${c._id}`,
    title: c.users
      .filter(u => user.username !== u.username)
      .map(u => u.firstName)
      .join(', '),
    icon: <ProfileAvatar profileGraphic={getConversationGraphicNumber(c, user)} size={40} />,
  }));

  /**
   * Creates the default navigation component for when a user is not searching for a conversation by username.
   * @param input The input string from the search bar.
   * @param setInput Function to set the input string state variable.
   * @param setShowResults Function to set the boolean indicating whether or not to display search results.
   * @param msgNav Function to create the navigation item objects to create individual convos in the nav bar.
   * @returns Navigation objects.
   */
  const defaultNavigation = (
    input: string,
    setInput: React.Dispatch<React.SetStateAction<string>>,
    setShowResults: React.Dispatch<React.SetStateAction<boolean>>,
    msgNav: NavigationItem[],
  ): Navigation => [
    {
      icon: Search(input, setInput, setShowResults),
    },
    {
      kind: 'divider',
    },
    {
      segment: 'new/convo',
      title: 'Create new conversation',
      icon: <AddCircleIcon sx={{ color: 'green' }} />,
    },
    {
      kind: 'divider',
    },
    {
      kind: 'page',
      title: 'Messages',
    },
    ...msgNav,
  ];

  /**
   * Creates the navigation component for displaying the search results after a user searches for a conversation by username.
   * @param input The input string from the search bar.
   * @param setInput Function to set the input string state variable.
   * @param setShowResults Function to set the boolean indicating whether or not to display search results.
   * @param searchNav Function to create the navigation item objects to create individual convos in the nav bar.
   * @returns Navigation objects.
   */
  const searchNavigation = (
    input: string,
    setInput: React.Dispatch<React.SetStateAction<string>>,
    setShowResults: React.Dispatch<React.SetStateAction<boolean>>,
    searchNav: NavigationItem[],
  ): Navigation => [
    {
      icon: Search(input, setInput, setShowResults),
    },
    ...searchNav,
  ];

  // Sets up the navigation bar on the side that links to the new conversations page,
  // and individual conversations.
  const navigation: Navigation =
    showSearchResults && searchInput.trim() !== ''
      ? searchNavigation(searchInput, setSearchInput, setShowSearchResults, searchResultsNav)
      : defaultNavigation(searchInput, setSearchInput, setShowSearchResults, messagesNav);

  return (
    <ThemeProvider theme={theme}>
      <AppProvider
        navigation={navigation}
        branding={{
          logo: <ForumIcon className='messagesIcon' sx={{ color: '#5171A5', marginTop: 1 }} />,
          title: 'Messages',
        }}
        router={router}
        theme={theme}>
        <DashboardLayout sx={{ height: 1, width: 1, bgcolor: '#EDE6E3', color: '#EDE6E3' }}>
          {router.pathname.includes('new/convo') && (
            <NewConversationPage
              navigate={router.navigate}
              setConversations={setConversations}
              conversations={conversations}></NewConversationPage>
          )}
          {router.pathname.includes('conversation') && (
            <IndividualConversation cidPath={router.pathname} />
          )}
          {!router.pathname.includes('new/convo') && !router.pathname.includes('conversation') && (
            <NoConversationLayout />
          )}
        </DashboardLayout>
      </AppProvider>
    </ThemeProvider>
  );
}
