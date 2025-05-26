import { useState, useEffect } from 'react';
import { AutocompleteGetTagProps, useAutocomplete } from '@mui/base/useAutocomplete';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import { autocompleteClasses } from '@mui/material/Autocomplete';
import { Conversation, User } from '../types';
import { getAllUsers } from '../services/userService';
import useUserContext from './useUserContext';
import { addConversation, getConversations } from '../services/conversationService';
import ProfileAvatar from '../components/profileAvatar';
/**
 * From MUI for search bar.
 */
const Root = styled('div')(
  ({ theme }) => `
  color: #32292F;
  font-size: 16px;
`,
);
/**
 * From MUI for search bar.
 */
const Label = styled('label')`
  padding: 0 0 4px;
  line-height: 1.5;
  display: block;
`;
/**
 * From MUI for search bar.
 */
const InputWrapper = styled('div')(
  ({ theme }) => `
  width: 100%;
  border: 1px solid rgb(0, 0, 0);
  background-color: #f5f3f5; 
  border-radius: 4px;
  padding: 1px;
  display: flex;
  flex-wrap: wrap;

  &:hover {
    border-color: #32292F ;
  }

  &.focused {
    border-color: #32292F;
    box-shadow: 0 0 0 2px #32292F;
  }

  & svg {
    color: #32292F;
  }

  & input {
    background-color: #f5f3f5;
    color: #32292F;
    height: 50px;
    box-sizing: border-box;
    padding: 4px 6px;
    width: 0;
    min-width: 30px;
    font-size: 16px;
    flex-grow: 1;
    border: 0;
    margin: 0;
    outline: 0;
  }
`,
);
/**
 * Interface from MUI for Autocomplete search bar.
 */
interface TagProps extends ReturnType<AutocompleteGetTagProps> {
  label: string;
  profileGraphic: number;
}
/**
 * From MUI for search bar.
 */
function Tag(props: TagProps) {
  const { label, onDelete, profileGraphic, ...other } = props;
  return (
    <div {...other}>
      <ProfileAvatar profileGraphic={profileGraphic} size={20} />
      <span style={{ marginLeft: 8 }}>{label}</span>
      <CloseIcon onClick={onDelete} />
    </div>
  );
}
/**
 * From MUI for search bar.
 */
const StyledTag = styled(Tag)<TagProps>(
  ({ theme }) => `
  display: flex;
  align-items: center;
  height: 24px;
  margin: 2px;
  line-height: 22px;
  background-color: #C8C7EC;
  border: 1px solid #e9e9f7;
  border-radius: 10px;
  box-sizing: content-box;
  padding: 0 4px 0 10px;
  outline: 0;
  overflow: hidden;

  &:focus {
    border-color: ${theme.palette.mode === 'dark' ? '#177ddc' : '#40a9ff'};
    background-color: ${theme.palette.mode === 'dark' ? '#003b57' : '#e6f7ff'};
  }

  & span {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  & svg {
    font-size: 12px;
    cursor: pointer;
    padding: 4px;
  }
`,
);
/**
 * From MUI for search bar.
 */
const Listbox = styled('ul')(
  ({ theme }) => `
  width: 48%;
  margin: 2px 0 0;
  padding: 0;
  position: absolute;
  list-style: none;
  background-color:#f5f3f5;
  overflow: auto;
  max-height: 250px;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgb(0, 0, 0);
  z-index: 1;

  & li {
    padding: 5px 12px;
    display: flex;

    & span {
      flex-grow: 1;
    }
  }

  & li[aria-selected='true'] {
    background-color: #c0a79c;
    font-weight: 600;

    & svg {
      color: #fff;
    }
  }

  & li.${autocompleteClasses.focused} {
    background-color: #d2c0b9;
    cursor: pointer;

    & svg {
      color: currentColor;
    }
  }
`,
);
/*
 * Custom hook component for search user component.
 * @returns allUsers - representing a list of all of the users for FakeStackOverflow.
 * @returns Root, Label, InputWrapper, StyledTag, Listbox - From MUI.
 */
const useCreateConversation = (
  setAlert: (alert: string) => void,
  navigation: (path: string | URL) => void,
  setConversations: (conversations: Conversation[]) => void,
  conversations: Conversation[],
  formatName: (user: User) => string,
) => {
  const [allUsers, setAllUsers] = useState<User[]>();
  const { user } = useUserContext();

  const {
    getRootProps,
    getInputLabelProps,
    getInputProps,
    getTagProps,
    getListboxProps,
    getOptionProps,
    groupedOptions,
    value,
    focused,
    setAnchorEl,
  } = useAutocomplete({
    id: 'customized-hook-demo',
    defaultValue: [],
    multiple: true,
    options: allUsers || [],
    getOptionLabel: option => formatName(option),
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const users = await getAllUsers();
        setAllUsers(users.filter(u => u.username !== user.username && !u.deleted));
      } catch (err) {
        setAllUsers([]);
      }
    };
    fetchData();
  }, [user.username]);

  /**
   * Creates a new conversation if one does not exist between users.
   */
  const createConversation = async () => {
    try {
      setAlert('');
      if (user._id) {
        // gets all of the conversations that include the current user.
        const usersConversations = await getConversations(user._id);

        // gets the selected user's usernames from the autocomplete input.
        // value contains the selected user (from MUI autocomplete)
        const valueUsernames: string[] = value.map((u: User) => u.username);

        // Goes through all conversations that the user is in
        for (let i = 0; i < usersConversations.length; i++) {
          // for the current conversation, it filters out the user if they were selected for the group one.
          // should only leave the current user if the conversation with the users selected exists.
          const userConversationsFilter = usersConversations[i].users.filter(
            u => !valueUsernames.includes(u.username),
          );
          // checks if the current conversation exists
          if (
            // checks that the length of the users in the convo (- current) is the same as the number of users selected.
            usersConversations[i].users.length - 1 === value.length &&
            // checks that after filtering the length was only one
            userConversationsFilter.length === 1 &&
            // checks that the only user left there is the current user.
            userConversationsFilter[0].username === user.username
          ) {
            navigation(`/conversation/${usersConversations[i]._id}`);
            return;
          }
        }
        // creates a new conversation if one doesn't exist.
        const convo: Conversation = {
          users: value.concat(user),
          messages: [],
          updatedAt: new Date(),
        };
        const conversation: Conversation = await addConversation(convo);
        setConversations([{ ...conversation, users: convo.users }, ...conversations]);
        navigation(`/conversation/${conversation._id}`);
      } else {
        throw Error('error getting user information.');
      }
    } catch (err) {
      setAlert('Error creating conversation. Please try again.');
    }
  };

  return {
    allUsers,
    Root,
    Label,
    InputWrapper,
    StyledTag,
    Listbox,
    getRootProps,
    getInputLabelProps,
    setAnchorEl,
    focused,
    value,
    getTagProps,
    getInputProps,
    groupedOptions,
    getListboxProps,
    getOptionProps,
    createConversation,
  };
};

export default useCreateConversation;
